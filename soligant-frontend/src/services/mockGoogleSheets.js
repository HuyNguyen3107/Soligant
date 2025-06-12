// src/services/mockGoogleSheets.js

/**
 * Mock service cho Google Sheets API
 * Sau này sẽ thay thế bằng real Google Sheets API
 */

// Mock data storage (in real app, this would be Google Sheets)
let mockOrdersDatabase = [];

/**
 * Generate unique order ID
 */
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `SO${timestamp}${random}`;
};

/**
 * Mock function: Create order in Google Sheets
 * @param {Object} orderData - Order data to save
 * @returns {Promise} Order result with ID
 */
export const createOrderInGoogleSheets = async (orderData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate order ID
  const orderId = generateOrderId();

  // Prepare data for "Google Sheets"
  const sheetRow = {
    orderId,
    createdAt: orderData.createdAt,
    status: orderData.status,

    // Customer info
    customerName: orderData.customer.customerName,
    customerPhone: orderData.customer.customerPhone,
    customerFacebook: orderData.customer.customerFacebook || "",
    customerInstagram: orderData.customer.customerInstagram || "",
    isUrgent: orderData.customer.isUrgent, // Product customization summary
    version:
      typeof orderData.customization.version?.selected === "string"
        ? orderData.customization.version.selected === "version1"
          ? "Version 1"
          : "Version 2"
        : orderData.customization.version?.selected?.name || "",
    versionPrice:
      typeof orderData.customization.version?.selected === "string"
        ? orderData.customization.version.selected === "version1"
          ? 245000
          : 250000
        : orderData.customization.version?.selected?.price || 0,

    // Characters
    char1_topColor:
      orderData.customization.characters.character1.topColor?.name || "",
    char1_bottomColor:
      orderData.customization.characters.character1.bottomColor?.name || "",
    char1_hair: orderData.customization.characters.character1.hair?.name || "",
    char1_face: orderData.customization.characters.character1.face?.name || "",

    char2_topColor:
      orderData.customization.characters.character2.topColor?.name || "",
    char2_bottomColor:
      orderData.customization.characters.character2.bottomColor?.name || "",
    char2_hair: orderData.customization.characters.character2.hair?.name || "",
    char2_face: orderData.customization.characters.character2.face?.name || "",

    // Combos
    fullCombo: orderData.customization.fullCombo?.name || "",
    fullComboPrice: orderData.customization.fullCombo?.price || 0,
    accessoryCombo: orderData.customization.accessoryCombo?.name || "",
    accessoryComboPrice: orderData.customization.accessoryCombo?.price || 0,

    // Additional items
    additionalAccessories:
      orderData.customization.additionalAccessories
        ?.map((acc) => acc.name)
        .join(", ") || "",
    additionalPet: orderData.customization.additionalPet?.name || "",

    // Background
    backgroundTemplate:
      orderData.customization.background?.template?.name || "",
    backgroundTitle: orderData.customization.background?.title || "",
    backgroundDate: orderData.customization.background?.date || "",
    backgroundName: orderData.customization.background?.name || "",
    backgroundSong: orderData.customization.background?.song || "",

    // Calculate total price
    totalPrice: calculateOrderTotal(orderData.customization),

    // Full customization data (JSON string for complex data)
    customizationData: JSON.stringify(orderData.customization),
  };

  // Simulate random API errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error("Google Sheets API error: Service temporarily unavailable");
  }

  // Add to mock database
  mockOrdersDatabase.push(sheetRow);

  // Console log for debugging
  console.log("📊 Mock order saved to Google Sheets:", sheetRow);
  console.log("📊 Total orders in mock database:", mockOrdersDatabase.length);

  return {
    orderId,
    status: "success",
    message: "Đơn hàng đã được lưu vào Google Sheets",
    sheetRow: sheetRow,
  };
};

/**
 * Calculate total order price
 */
const calculateOrderTotal = (customization) => {
  let total = 0;

  // Full combo price (override individual items)
  if (customization.fullCombo) {
    total = customization.fullCombo.price;
  } else {
    // Version price
    if (customization.version?.selected) {
      // Handle string versions like "version1" or "version2"
      if (typeof customization.version.selected === "string") {
        total +=
          customization.version.selected === "version1"
            ? 245000
            : customization.version.selected === "version2"
            ? 250000
            : 0;
      } else {
        // Handle object versions with price property
        total += customization.version.selected.price || 0;
      }
    }

    // Accessory combo
    if (customization.accessoryCombo) {
      total += customization.accessoryCombo.price;
    }

    // Additional accessories
    if (customization.additionalAccessories) {
      customization.additionalAccessories.forEach((accessory) => {
        total += accessory.price || 0;
      });
    }

    // Additional pet
    if (customization.additionalPet) {
      total += customization.additionalPet.price || 0;
    }
  }

  return total;
};

/**
 * Mock function: Search orders by phone or name
 * @param {string} searchTerm - Phone number or customer name
 * @returns {Promise} Array of matching orders
 */
export const searchOrdersInGoogleSheets = async (searchTerm) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Search in mock database
  const results = mockOrdersDatabase.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
  );

  console.log("🔍 Mock search results:", results);

  return {
    status: "success",
    results: results,
    total: results.length,
  };
};

/**
 * Mock function: Get order from Google Sheets by ID
 * @param {string} orderId - Order ID to search for
 * @returns {Promise} Order data if found
 */
export const getOrderFromGoogleSheets = async (orderId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find order in mock database
  const order = mockOrdersDatabase.find((order) => order.orderId === orderId);

  if (!order) {
    return {
      success: false,
      message: "Không tìm thấy đơn hàng",
      data: null,
    };
  }
  // Truy cập vào dữ liệu JSON từ chuỗi (nếu có)
  let customizationJson = {};
  try {
    if (order.customizationData) {
      customizationJson = JSON.parse(order.customizationData);
    }
  } catch (e) {
    console.error("Lỗi khi parse dữ liệu JSON:", e);
  }

  // Reconstruct full order data
  const fullOrderData = {
    orderId: order.orderId,
    createdAt: order.createdAt,
    status: order.status,
    isUrgent: order.isUrgent,

    customer: {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerFacebook: order.customerFacebook,
      customerInstagram: order.customerInstagram,
    },
    customization: {
      version: order.version
        ? {
            selected: customizationJson.version?.selected || {
              name: order.version,
              price: order.versionPrice,
              description:
                customizationJson.version?.selected?.description ||
                (order.version === "Version 1"
                  ? "Khung tranh có 01 LEGO-nhân"
                  : order.version === "Version 2"
                  ? "Khung tranh có 02 LEGO-nhân"
                  : ""),
            },
          }
        : null,

      fullCombo: order.fullCombo
        ? {
            name: order.fullCombo,
            price: order.fullComboPrice,
            description: customizationJson.fullCombo?.description || "",
            includes: customizationJson.fullCombo?.includes || {},
          }
        : null,

      accessoryCombo: order.accessoryCombo
        ? {
            name: order.accessoryCombo,
            price: order.accessoryComboPrice,
            description: customizationJson.accessoryCombo?.description || "",
            includes: customizationJson.accessoryCombo?.includes || [],
          }
        : null,

      characters: {
        character1: {
          topColor: order.char1_topColor
            ? { name: order.char1_topColor }
            : null,
          bottomColor: order.char1_bottomColor
            ? { name: order.char1_bottomColor }
            : null,
          hair: order.char1_hair ? { name: order.char1_hair } : null,
          face: order.char1_face ? { name: order.char1_face } : null,
        },
        character2: {
          topColor: order.char2_topColor
            ? { name: order.char2_topColor }
            : null,
          bottomColor: order.char2_bottomColor
            ? { name: order.char2_bottomColor }
            : null,
          hair: order.char2_hair ? { name: order.char2_hair } : null,
          face: order.char2_face ? { name: order.char2_face } : null,
        },
      },

      background: {
        template: order.backgroundTemplate
          ? { name: order.backgroundTemplate }
          : null,
        title: order.backgroundTitle || "",
        name: order.backgroundName || "",
        date: order.backgroundDate || "",
        song: order.backgroundSong || "",
      }, // Parse additional accessories from string back to array of objects
      additionalAccessories: order.additionalAccessories
        ? order.additionalAccessories.split(", ").map((name) => {
            // Try to find price from original data
            const accessory = customizationJson.additionalAccessories?.find(
              (acc) => acc.name === name
            );
            return {
              name,
              price: accessory?.price || 0,
              id:
                accessory?.id ||
                `acc-${Math.random().toString(36).substr(2, 9)}`,
            };
          })
        : [],

      additionalPet: order.additionalPet
        ? {
            name: order.additionalPet,
            price: customizationJson.additionalPet?.price || 0,
            id:
              customizationJson.additionalPet?.id ||
              `pet-${Math.random().toString(36).substr(2, 9)}`,
          }
        : null,
    },

    totalPrice: order.totalPrice || 0,
    notes: order.customizationNotes || "",
  };

  return {
    success: true,
    data: fullOrderData,
  };
};

/**
 * Mock function: Update order status
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status
 * @returns {Promise} Update result
 */
export const updateOrderStatusInGoogleSheets = async (orderId, newStatus) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Find and update order in mock database
  const orderIndex = mockOrdersDatabase.findIndex(
    (order) => order.orderId === orderId
  );

  if (orderIndex === -1) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  mockOrdersDatabase[orderIndex].status = newStatus;
  mockOrdersDatabase[orderIndex].updatedAt = new Date().toISOString();

  console.log("🔄 Mock order status updated:", mockOrdersDatabase[orderIndex]);

  return {
    status: "success",
    message: "Cập nhật trạng thái thành công",
    order: mockOrdersDatabase[orderIndex],
  };
};

/**
 * Get all mock orders (for debugging)
 */
export const getAllMockOrders = () => {
  return mockOrdersDatabase;
};

/**
 * Clear all mock orders (for testing)
 */
export const clearMockOrders = () => {
  mockOrdersDatabase = [];
  console.log("🗑️ Mock orders database cleared");
};
