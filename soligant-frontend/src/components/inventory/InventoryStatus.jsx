// src/components/inventory/InventoryStatus.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventory } from "../../hooks/useInventory";

const InventoryStatus = ({ userId, selectedItems = [], onItemsChange }) => {
  const { inventory, reservation, loading, error, actions } =
    useInventory(userId);
  const [showReservationTimer, setShowReservationTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Timer cho reservation
  useEffect(() => {
    if (reservation && reservation.expiresAt) {
      const updateTimer = () => {
        const now = new Date();
        const expires = new Date(reservation.expiresAt);
        const remaining = Math.max(0, expires - now);

        setTimeRemaining(remaining);

        if (remaining <= 0) {
          // Reservation đã hết hạn
          actions.reload();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [reservation, actions]);

  // Format thời gian còn lại
  const formatTimeRemaining = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Kiểm tra items có available không
  const checkItemsAvailability = () => {
    if (!inventory || !selectedItems.length)
      return { available: true, issues: [] };

    const issues = [];
    selectedItems.forEach((item) => {
      if (!actions.isItemAvailable(item.id, item.quantity)) {
        const stock = actions.getItemStock(item.id);
        issues.push({
          ...item,
          availableStock: stock,
          issue: stock === 0 ? "Hết hàng" : `Chỉ còn ${stock} sản phẩm`,
        });
      }
    });

    return {
      available: issues.length === 0,
      issues,
    };
  };

  // Reserve items
  const handleReserveItems = async () => {
    if (!selectedItems.length) return;

    const result = await actions.reserve(selectedItems);

    if (result.success) {
      setShowReservationTimer(true);
    }

    return result;
  };

  // Release reservation
  const handleReleaseReservation = async () => {
    const success = await actions.release();
    if (success) {
      setShowReservationTimer(false);
      setTimeRemaining(0);
    }
    return success;
  };

  const availability = checkItemsAvailability();

  if (loading && !inventory) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-soligant-primary"></div>
        <span className="ml-2 text-sm text-gray-600">
          Đang tải thông tin sản phẩm...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-center">
              <span className="text-red-600 text-sm">⚠️ {error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability issues */}
      <AnimatePresence>
        {!availability.available && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
          >
            <h4 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Vấn đề về số lượng:
            </h4>
            <div className="space-y-1">
              {availability.issues.map((issue, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  • <span className="font-medium">{issue.name}</span>:{" "}
                  {issue.issue}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current reservation status */}
      <AnimatePresence>
        {reservation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-800">
                🔒 Sản phẩm đã được đặt chỗ
              </h4>
              {timeRemaining > 0 && (
                <span className="text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  ⏰ {formatTimeRemaining(timeRemaining)}
                </span>
              )}
            </div>

            <div className="space-y-1 mb-3">
              {reservation.items.map((item, index) => (
                <div key={index} className="text-sm text-blue-700">
                  • <span className="font-medium">{item.name}</span> x
                  {item.quantity}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReleaseReservation}
                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Hủy đặt chỗ
              </button>

              {timeRemaining <= 300000 && ( // 5 minutes warning
                <span className="text-xs text-orange-600">
                  ⚠️ Đặt chỗ sắp hết hạn!
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {selectedItems.length > 0 && !reservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2"
        >
          <button
            onClick={handleReserveItems}
            disabled={!availability.available || loading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                availability.available && !loading
                  ? "bg-soligant-primary text-white hover:bg-soligant-primary-dark"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </span>
            ) : (
              "🔒 Đặt chỗ sản phẩm"
            )}
          </button>

          <button
            onClick={() => actions.reload()}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            🔄 Làm mới
          </button>
        </motion.div>
      )}

      {/* Inventory summary */}
      {inventory && (
        <div className="text-xs text-gray-500 border-t pt-2">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Sản phẩm chính:</span>
              <div className="space-y-1 mt-1">
                {Object.values(inventory.products).map((product) => (
                  <div key={product.id} className="flex justify-between">
                    <span className="truncate">{product.name}</span>
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-medium">Phụ kiện:</span>
              <div className="space-y-1 mt-1">
                {Object.values(inventory.accessories).map((accessory) => (
                  <div key={accessory.id} className="flex justify-between">
                    <span className="truncate">{accessory.name}</span>
                    <span
                      className={
                        accessory.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {accessory.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-medium">Full Combo:</span>
              <div className="space-y-1 mt-1">
                {Object.values(inventory.fullCombos).map((combo) => (
                  <div key={combo.id} className="flex justify-between">
                    <span className="truncate">{combo.name}</span>
                    <span
                      className={
                        combo.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {combo.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryStatus;
