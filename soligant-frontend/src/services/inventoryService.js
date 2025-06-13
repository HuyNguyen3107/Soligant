// src/services/inventoryService.js

/**
 * Inventory Management Service
 * Quản lý số lượng sản phẩm với hệ thống reservation
 */

// Mock inventory database - Trong thực tế sẽ là database thật
let realInventory = {
  // Sản phẩm chính
  products: {
    "version-1-single": {
      id: "version-1-single",
      name: "Version 1 - Single Character",
      stock: 50,
      price: 245000,
    },
    "version-2-couple": {
      id: "version-2-couple",
      name: "Version 2 - Couple",
      stock: 30,
      price: 290000,
    },
    "version-3-family": {
      id: "version-3-family",
      name: "Version 3 - Family",
      stock: 20,
      price: 390000,
    },
  },

  // Combo accessories
  accessories: {
    "lifestyle-combo": {
      id: "lifestyle-combo",
      name: "Gói phụ kiện Lifestyle",
      stock: 100,
      price: 35000,
    },
    "creative-combo": {
      id: "creative-combo",
      name: "Gói phụ kiện Sáng tạo",
      stock: 80,
      price: 45000,
    },
    "art-combo": {
      id: "art-combo",
      name: "Gói phụ kiện Nghệ thuật",
      stock: 60,
      price: 55000,
    },
    "gaming-combo": {
      id: "gaming-combo",
      name: "Gói phụ kiện Gaming Pro",
      stock: 40,
      price: 65000,
    },
  },

  // Full combo packages
  fullCombos: {
    "wedding-premium": {
      id: "wedding-premium",
      name: "Full Combo Wedding Premium",
      stock: 15,
      price: 450000,
    },
    "birthday-deluxe": {
      id: "birthday-deluxe",
      name: "Full Combo Birthday Deluxe",
      stock: 25,
      price: 380000,
    },
    "anniversary-special": {
      id: "anniversary-special",
      name: "Full Combo Anniversary Special",
      stock: 20,
      price: 420000,
    },
  },
};

// Bản sao để reservation - Sẽ được sync từ realInventory
let reservationInventory = JSON.parse(JSON.stringify(realInventory));

// Lưu trữ các reservation đang hoạt động
let activeReservations = new Map(); // userId -> { items: [...], timestamp: Date }

// Timeout cho reservation (15 phút)
const RESERVATION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

/**
 * Khởi tạo inventory service
 */
export const initializeInventoryService = () => {
  console.log("🏪 Inventory Service initialized");

  // Sync reservation inventory từ real inventory
  syncReservationInventory();

  // Cleanup expired reservations mỗi phút
  setInterval(cleanupExpiredReservations, 60 * 1000);
};

/**
 * Sync bản sao từ inventory thật
 */
const syncReservationInventory = () => {
  reservationInventory = JSON.parse(JSON.stringify(realInventory));
  console.log("📦 Reservation inventory synced from real inventory");
};

/**
 * Lấy thông tin inventory hiện tại (cho hiển thị)
 */
export const getAvailableInventory = () => {
  return {
    products: { ...reservationInventory.products },
    accessories: { ...reservationInventory.accessories },
    fullCombos: { ...reservationInventory.fullCombos },
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Đặt chỗ sản phẩm cho user
 */
export const reserveItems = (userId, items) => {
  console.log(`🔒 Reserving items for user ${userId}:`, items);

  // Kiểm tra availability trước
  const availabilityCheck = checkItemsAvailability(items);
  if (!availabilityCheck.available) {
    return {
      success: false,
      message: "Một số sản phẩm đã hết hàng",
      unavailableItems: availabilityCheck.unavailableItems,
    };
  }

  // Release reservation cũ nếu có
  releaseReservation(userId);

  // Tạo reservation mới
  const reservation = {
    items: [...items],
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + RESERVATION_TIMEOUT),
  };

  // Trừ số lượng trong reservation inventory
  items.forEach((item) => {
    const category = getItemCategory(item.id);
    if (
      reservationInventory[category] &&
      reservationInventory[category][item.id]
    ) {
      reservationInventory[category][item.id].stock -= item.quantity;
    }
  });

  // Lưu reservation
  activeReservations.set(userId, reservation);

  console.log(
    `✅ Items reserved for user ${userId} until ${reservation.expiresAt}`
  );

  return {
    success: true,
    expiresAt: reservation.expiresAt,
    message: `Sản phẩm đã được đặt chỗ trong ${
      RESERVATION_TIMEOUT / 1000 / 60
    } phút`,
  };
};

/**
 * Kiểm tra tính khả dụng của các items
 */
const checkItemsAvailability = (items) => {
  const unavailableItems = [];

  for (const item of items) {
    const category = getItemCategory(item.id);
    const product = reservationInventory[category]?.[item.id];

    if (!product || product.stock < item.quantity) {
      unavailableItems.push({
        ...item,
        availableStock: product?.stock || 0,
      });
    }
  }

  return {
    available: unavailableItems.length === 0,
    unavailableItems,
  };
};

/**
 * Xác định category của item
 */
const getItemCategory = (itemId) => {
  if (itemId.includes("version")) return "products";
  if (itemId.includes("combo") && !itemId.includes("full"))
    return "accessories";
  return "fullCombos";
};

/**
 * Trả lại reservation của user
 */
export const releaseReservation = (userId) => {
  const reservation = activeReservations.get(userId);
  if (!reservation) return false;

  console.log(`🔓 Releasing reservation for user ${userId}`);

  // Trả lại số lượng vào reservation inventory
  reservation.items.forEach((item) => {
    const category = getItemCategory(item.id);
    if (
      reservationInventory[category] &&
      reservationInventory[category][item.id]
    ) {
      reservationInventory[category][item.id].stock += item.quantity;
    }
  });

  // Xóa reservation
  activeReservations.delete(userId);

  console.log(`✅ Reservation released for user ${userId}`);
  return true;
};

/**
 * Xác nhận đơn hàng và cập nhật inventory thật
 */
export const confirmOrder = (userId, orderId) => {
  const reservation = activeReservations.get(userId);
  if (!reservation) {
    return {
      success: false,
      message: "Không tìm thấy reservation",
    };
  }

  console.log(`💰 Confirming order ${orderId} for user ${userId}`);

  // Cập nhật inventory thật
  reservation.items.forEach((item) => {
    const category = getItemCategory(item.id);
    if (realInventory[category] && realInventory[category][item.id]) {
      realInventory[category][item.id].stock -= item.quantity;
    }
  });

  // Xóa reservation
  activeReservations.delete(userId);

  console.log(
    `✅ Order confirmed and real inventory updated for order ${orderId}`
  );

  return {
    success: true,
    message: "Đơn hàng đã được xác nhận và inventory đã được cập nhật",
  };
};

/**
 * Cleanup các reservation đã hết hạn
 */
const cleanupExpiredReservations = () => {
  const now = new Date();
  let expiredCount = 0;

  for (const [userId, reservation] of activeReservations.entries()) {
    if (now > reservation.expiresAt) {
      releaseReservation(userId);
      expiredCount++;
    }
  }

  if (expiredCount > 0) {
    console.log(`🧹 Cleaned up ${expiredCount} expired reservations`);
  }
};

/**
 * Lấy thông tin reservation của user
 */
export const getUserReservation = (userId) => {
  return activeReservations.get(userId) || null;
};

/**
 * Lấy thống kê inventory
 */
export const getInventoryStats = () => {
  const totalReservations = activeReservations.size;
  const reservedItems = Array.from(activeReservations.values())
    .flatMap((r) => r.items)
    .reduce((total, item) => total + item.quantity, 0);

  return {
    totalReservations,
    reservedItems,
    realInventory: { ...realInventory },
    reservationInventory: { ...reservationInventory },
    activeReservations: Array.from(activeReservations.entries()).map(
      ([userId, reservation]) => ({
        userId,
        items: reservation.items,
        expiresAt: reservation.expiresAt,
      })
    ),
  };
};

/**
 * Reset inventory (cho testing)
 */
export const resetInventory = () => {
  // Clear all reservations
  activeReservations.clear();

  // Reset real inventory
  realInventory = {
    products: {
      "version-1-single": {
        id: "version-1-single",
        name: "Version 1 - Single Character",
        stock: 50,
        price: 245000,
      },
      "version-2-couple": {
        id: "version-2-couple",
        name: "Version 2 - Couple",
        stock: 30,
        price: 290000,
      },
      "version-3-family": {
        id: "version-3-family",
        name: "Version 3 - Family",
        stock: 20,
        price: 390000,
      },
    },
    accessories: {
      "lifestyle-combo": {
        id: "lifestyle-combo",
        name: "Gói phụ kiện Lifestyle",
        stock: 100,
        price: 35000,
      },
      "creative-combo": {
        id: "creative-combo",
        name: "Gói phụ kiện Sáng tạo",
        stock: 80,
        price: 45000,
      },
      "art-combo": {
        id: "art-combo",
        name: "Gói phụ kiện Nghệ thuật",
        stock: 60,
        price: 55000,
      },
      "gaming-combo": {
        id: "gaming-combo",
        name: "Gói phụ kiện Gaming Pro",
        stock: 40,
        price: 65000,
      },
    },
    fullCombos: {
      "wedding-premium": {
        id: "wedding-premium",
        name: "Full Combo Wedding Premium",
        stock: 15,
        price: 450000,
      },
      "birthday-deluxe": {
        id: "birthday-deluxe",
        name: "Full Combo Birthday Deluxe",
        stock: 25,
        price: 380000,
      },
      "anniversary-special": {
        id: "anniversary-special",
        name: "Full Combo Anniversary Special",
        stock: 20,
        price: 420000,
      },
    },
  };

  // Sync reservation inventory
  syncReservationInventory();

  console.log("🔄 Inventory reset to initial state");
};

// Auto-initialize when imported
if (typeof window !== "undefined") {
  initializeInventoryService();
}
