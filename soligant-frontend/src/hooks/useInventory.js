// src/hooks/useInventory.js

import { useState, useEffect, useCallback } from "react";
import {
  getAvailableInventory,
  reserveItems,
  releaseReservation,
  confirmOrder,
  getUserReservation,
  getInventoryStats,
} from "../services/inventoryService";

/**
 * Hook để quản lý inventory và reservations
 */
export const useInventory = (userId) => {
  const [inventory, setInventory] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load inventory data
  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = getAvailableInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải thông tin sản phẩm");
      console.error("Load inventory error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user reservation
  const loadUserReservation = useCallback(() => {
    if (userId) {
      const userReservation = getUserReservation(userId);
      setReservation(userReservation);
    }
  }, [userId]);

  // Reserve items for user
  const reserve = useCallback(
    async (items) => {
      if (!userId) {
        throw new Error("User ID is required for reservation");
      }

      try {
        setLoading(true);
        setError(null);

        const result = reserveItems(userId, items);

        if (result.success) {
          // Reload inventory và reservation
          await loadInventory();
          loadUserReservation();

          return result;
        } else {
          setError(result.message);
          return result;
        }
      } catch (err) {
        const errorMsg = "Không thể đặt chỗ sản phẩm";
        setError(errorMsg);
        console.error("Reserve error:", err);
        return { success: false, message: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [userId, loadInventory, loadUserReservation]
  );

  // Release reservation
  const release = useCallback(async () => {
    if (!userId) return false;

    try {
      setLoading(true);
      const success = releaseReservation(userId);

      if (success) {
        // Reload inventory và clear reservation
        await loadInventory();
        setReservation(null);
      }

      return success;
    } catch (err) {
      console.error("Release error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadInventory]);

  // Confirm order
  const confirm = useCallback(
    async (orderId) => {
      if (!userId) {
        throw new Error("User ID is required for order confirmation");
      }

      try {
        setLoading(true);
        setError(null);

        const result = confirmOrder(userId, orderId);

        if (result.success) {
          // Reload inventory và clear reservation
          await loadInventory();
          setReservation(null);

          return result;
        } else {
          setError(result.message);
          return result;
        }
      } catch (err) {
        const errorMsg = "Không thể xác nhận đơn hàng";
        setError(errorMsg);
        console.error("Confirm error:", err);
        return { success: false, message: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [userId, loadInventory]
  );

  // Check if item is available
  const isItemAvailable = useCallback(
    (itemId, quantity = 1) => {
      if (!inventory) return false;

      const getItemFromInventory = (id) => {
        return (
          inventory.products[id] ||
          inventory.accessories[id] ||
          inventory.fullCombos[id]
        );
      };

      const item = getItemFromInventory(itemId);
      return item && item.stock >= quantity;
    },
    [inventory]
  );

  // Get item stock
  const getItemStock = useCallback(
    (itemId) => {
      if (!inventory) return 0;

      const getItemFromInventory = (id) => {
        return (
          inventory.products[id] ||
          inventory.accessories[id] ||
          inventory.fullCombos[id]
        );
      };

      const item = getItemFromInventory(itemId);
      return item ? item.stock : 0;
    },
    [inventory]
  );

  // Auto-refresh inventory mỗi 30 giây
  useEffect(() => {
    loadInventory();
    loadUserReservation();

    const interval = setInterval(() => {
      loadInventory();
      loadUserReservation();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadInventory, loadUserReservation]);

  // Auto-release reservation trước khi component unmount
  useEffect(() => {
    return () => {
      if (userId && reservation) {
        releaseReservation(userId);
      }
    };
  }, [userId, reservation]);

  return {
    inventory,
    reservation,
    loading,
    error,
    actions: {
      reserve,
      release,
      confirm,
      reload: loadInventory,
      isItemAvailable,
      getItemStock,
    },
  };
};

/**
 * Hook đơn giản để lấy inventory stats (cho admin)
 */
export const useInventoryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = getInventoryStats();
      setStats(data);
    } catch (err) {
      console.error("Load inventory stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();

    // Refresh stats mỗi 10 giây
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return {
    stats,
    loading,
    reload: loadStats,
  };
};
