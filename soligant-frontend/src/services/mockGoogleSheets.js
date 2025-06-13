// src/services/mockGoogleSheets.js

/**
 * Mock service cho Google Sheets API
 * Sau này sẽ thay thế bằng real Google Sheets API
 */

// Mock data storage (in real app, this would be Google Sheets)
let mockOrdersDatabase = [
  {
    orderId: "SO20240115001",
    createdAt: "2024-01-15T10:30:00Z",
    status: "Hoàn thành",
    customerName: "Nguyễn Văn An",
    customerPhone: "0123456789",
    customerFacebook: "nguyenvanan.fb",
    customerInstagram: "an_nguyen_official",
    customerEmail: "an.nguyen@email.com",
    customerAddress: "123 Trần Hưng Đạo, Q1, TP.HCM",
    isUrgent: false,
    version: "Version 1 - Single Character",
    versionPrice: 245000,
    fullCombo: "",
    fullComboPrice: 0,
    accessoryCombo: "Gói phụ kiện Lifestyle",
    accessoryComboPrice: 35000,
    additionalAccessories: "Mũ baseball, Kính râm",
    additionalAccessoriesPrice: 25000,
    additionalPet: "",
    additionalPetPrice: 0,
    backgroundTemplate: "Template Sinh nhật - Happy Birthday",
    backgroundTitle: "Happy Birthday",
    backgroundName: "An",
    backgroundDate: "15/01/2024",
    backgroundSong: "",
    shippingFee: 0,
    discount: 10000,
    totalPrice: 295000,
    customizationNotes:
      "Khách hàng yêu cầu màu xanh lá cây, tóc ngắn, mặc áo thun trắng. Thích chơi bóng đá nên cần thêm quả bóng nhỏ bên cạnh nhân vật. Giao hàng khu vực Q1.",
    estimatedDelivery: "2024-01-22",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Paid",
    // Thông tin ảnh sản phẩm
    productImages: {
      demoImage: "https://picsum.photos/400/300?random=1", // Ảnh demo đã có
      backgroundImage: "https://picsum.photos/400/300?random=2", // Ảnh nền đã chốt
      finalImage: "https://picsum.photos/400/300?random=3", // Ảnh sản phẩm hoàn thiện
    },
    shippingInfo: {
      // Added for testing tracking button
      trackingUrl: "https://example.com/track/SO20240115001",
      trackingNumber: "TRACK001",
    },
    customizationData: JSON.stringify({
      version: {
        selected: {
          name: "Version 1 - Single Character",
          price: 245000,
          description: "Khung tranh có 01 LEGO-nhân",
        },
      },
      accessoryCombo: { name: "Gói phụ kiện Lifestyle", price: 35000 },
      additionalAccessories: [
        { name: "Mũ baseball", price: 15000 },
        { name: "Kính râm", price: 10000 },
      ],
      background: {
        template: { name: "Template Sinh nhật - Happy Birthday" },
        title: "Happy Birthday",
        name: "An",
        date: "15/01/2024",
      },
    }),
    char1_topColor: "Xanh dương",
    char1_bottomColor: "Đen",
    char1_hair: "Tóc ngắn",
    char1_face: "Mặt cười",
    char2_topColor: "",
    char2_bottomColor: "",
    char2_hair: "",
    char2_face: "",
  },
  {
    orderId: "SO20240114002",
    createdAt: "2024-01-14T16:45:00Z",
    status: "Đang sản xuất", // This status should NOT show tracking
    customerName: "Trần Thị Bình",
    customerPhone: "0987654321",
    customerFacebook: "tranthibinh.fb",
    customerInstagram: "binh_tran_ig",
    customerEmail: "binh.tran@gmail.com",
    customerAddress: "456 Nguyễn Huệ, Q1, TP.HCM",
    isUrgent: true,
    version: "Version 2 - Couple",
    versionPrice: 250000,
    fullCombo: "Full Combo Wedding Premium",
    fullComboPrice: 450000,
    accessoryCombo: "",
    accessoryComboPrice: 0,
    additionalAccessories: "",
    additionalAccessoriesPrice: 0,
    additionalPet: "Chó Golden",
    additionalPetPrice: 20000,
    backgroundTemplate: "Template Wedding - Lãng mạn",
    backgroundTitle: "Forever Together",
    backgroundName: "Bình & Minh",
    backgroundDate: "14/02/2024",
    backgroundSong: "Perfect - Ed Sheeran",
    shippingFee: 0,
    discount: 0,
    totalPrice: 470000,
    customizationNotes:
      "Đơn hàng cưới, cần gấp trước ngày 14/02. Yêu cầu chất lượng cao nhất, có thể tăng giá nếu cần.",
    estimatedDelivery: "2024-02-10",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Paid",
    // No shippingInfo here, so tracking button won't show
    customizationData: JSON.stringify({
      version: {
        selected: {
          name: "Version 2 - Couple",
          price: 250000,
          description: "Khung tranh có 02 LEGO-nhân",
        },
      },
      fullCombo: {
        name: "Full Combo Wedding Premium",
        price: 450000,
        description: "Gói cao cấp bao gồm tất cả phụ kiện",
      },
      additionalPet: { name: "Chó Golden", price: 20000 },
      background: {
        template: { name: "Template Wedding - Lãng mạn" },
        title: "Forever Together",
        name: "Bình & Minh",
        date: "14/02/2024",
        song: "Perfect - Ed Sheeran",
      },
    }),
    char1_topColor: "Trắng",
    char1_bottomColor: "Đen",
    char1_hair: "Tóc dài",
    char1_face: "Mặt cười",
    char2_topColor: "Xám",
    char2_bottomColor: "Xanh navy",
    char2_hair: "Tóc ngắn",
    char2_face: "Mặt cười",
  },
  {
    orderId: "SO20240113003",
    createdAt: "2024-01-13T09:15:00Z",
    status: "Chờ xác nhận", // This status should NOT show tracking
    customerName: "Lê Minh Cường",
    customerPhone: "0345678912",
    customerFacebook: "leminhcuong.official",
    customerInstagram: "cuong_le_2024",
    customerEmail: "cuong.le@email.com",
    customerAddress: "789 Lê Lợi, Q3, TP.HCM",
    isUrgent: false,
    version: "Version 2 - Family",
    versionPrice: 250000,
    fullCombo: "",
    fullComboPrice: 0,
    accessoryCombo: "Gói phụ kiện Sáng tạo",
    accessoryComboPrice: 55000,
    additionalAccessories: "Laptop mini, Cây guitar",
    additionalAccessoriesPrice: 30000,
    additionalPet: "Mèo Anh lông ngắn",
    additionalPetPrice: 25000,
    backgroundTemplate: "Template Cafe - Không gian ấm cúng",
    backgroundTitle: "Coffee Lover",
    backgroundName: "Cường",
    backgroundDate: "",
    backgroundSong: "Acoustic Vibes",
    shippingFee: 0,
    discount: 0,
    totalPrice: 360000,
    customizationNotes:
      "Khách hàng yêu cầu thiết kế theo phong cách cafe vintage, màu nâu chủ đạo. Cần demo trước khi sản xuất.",
    customizationData: JSON.stringify({
      version: { selected: { name: "Version 2", price: 250000 } },
      accessoryCombo: { name: "Combo Advanced", price: 55000 },
      additionalAccessories: [
        { name: "Laptop mini", price: 15000 },
        { name: "Cây guitar", price: 15000 },
      ],
      additionalPet: { name: "Mèo Anh lông ngắn", price: 25000 },
      background: {
        template: { name: "Template 3 - Cafe Theme" },
        title: "Coffee Lover",
        name: "Cường",
        song: "Acoustic Vibes",
      },
    }),
    char1_topColor: "Nâu",
    char1_bottomColor: "Xanh jean",
    char1_hair: "Tóc xoăn",
    char1_face: "Mặt nghiêm túc",
    char2_topColor: "Hồng",
    char2_bottomColor: "Trắng",
    char2_hair: "Tóc bob",
    char2_face: "Mặt cười",
  },
  {
    orderId: "SO20240112004",
    createdAt: "2024-01-12T14:20:00Z",
    status: "Đang vận chuyển", // This status SHOULD show tracking if URL exists
    customerName: "Phạm Thị Dung",
    customerPhone: "0456789123",
    customerFacebook: "phamthidung.fb",
    customerInstagram: "dung_pham_art",
    customerEmail: "dung.pham@email.com",
    customerAddress: "234 Hai Bà Trưng, Q3, TP.HCM",
    isUrgent: false,
    version: "Version 1 - Best Friends",
    versionPrice: 245000,
    fullCombo: "",
    fullComboPrice: 0,
    accessoryCombo: "Gói phụ kiện Nghệ thuật",
    accessoryComboPrice: 35000,
    additionalAccessories: "Túi xách mini, Hoa tulip",
    additionalAccessoriesPrice: 25000,
    additionalPet: "",
    additionalPetPrice: 0,
    backgroundTemplate: "Template Cafe - Thiết kế theo chủ đề",
    backgroundTitle: "Best Friends Forever",
    backgroundName: "Dung & Mai",
    backgroundDate: "12/03/2024",
    backgroundSong: "",
    shippingFee: 30000,
    discount: 0,
    totalPrice: 335000,
    customizationNotes:
      "Khách yêu cầu thanh toán COD, giao hàng tận nơi. Thiết kế 2 bạn nữ thân thiết, phong cách cafe vintage.",
    estimatedDelivery: "2024-03-18",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    shippingInfo: {
      // Added for testing tracking button
      trackingUrl: "https://example.com/track/SO20240112004",
      trackingNumber: "TRACK004",
    },
    customizationData: JSON.stringify({
      version: { selected: { name: "Version 1", price: 245000 } },
      accessoryCombo: { name: "Combo Basic", price: 35000 },
      additionalAccessories: [
        { name: "Túi xách mini", price: 12000 },
        { name: "Hoa tulip", price: 13000 },
      ],
      background: {
        template: { name: "Template 4 - Spring Theme" },
        title: "Spring Vibes",
        name: "Dung",
        date: "12/03/2024",
      },
    }),
    char1_topColor: "Hồng",
    char1_bottomColor: "Trắng",
    char1_hair: "Tóc dài thẳng",
    char1_face: "Mặt dễ thương",
    char2_topColor: "",
    char2_bottomColor: "",
    char2_hair: "",
    char2_face: "",
  },
  {
    orderId: "SO20240111005",
    createdAt: "2024-01-11T11:30:00Z",
    status: "Đã giao", // This status should NOT show tracking based on current logic
    customerName: "Hoàng Văn Ethan",
    customerPhone: "0567891234",
    customerFacebook: "hoangvanethan.gamer",
    customerInstagram: "ethan_gaming_setup",
    customerEmail: "ethan.hoang@email.com",
    customerAddress: "567 Võ Văn Tần, Q3, TP.HCM",
    isUrgent: true,
    version: "Version 2 - Gaming Setup",
    versionPrice: 250000,
    fullCombo: "",
    fullComboPrice: 0,
    accessoryCombo: "Gói phụ kiện Gaming Pro",
    accessoryComboPrice: 75000,
    additionalAccessories: "Tai nghe gaming, Bàn phím cơ mini",
    additionalAccessoriesPrice: 55000,
    additionalPet: "Rồng mini",
    additionalPetPrice: 35000,
    backgroundTemplate: "Template Gaming - LED Theme",
    backgroundTitle: "Gaming Master",
    backgroundName: "Ethan",
    backgroundDate: "",
    backgroundSong: "Epic Gaming Music",
    shippingFee: 0,
    discount: 0,
    totalPrice: 415000,
    customizationNotes:
      "Thiết kế gaming setup với đèn LED, màu đen và xanh neon. Nhân vật mặc hoodie gaming, có tai nghe to. Background có setup PC gaming đầy đủ.",
    estimatedDelivery: "2024-01-18",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Paid",
    shippingInfo: {
      trackingUrl: "https://example.com/track/SO20240111005", // Has URL
      trackingNumber: "TRACK005",
    },
    customizationData: JSON.stringify({
      version: { selected: { name: "Version 2", price: 250000 } },
      accessoryCombo: { name: "Combo Gaming", price: 75000 },
      additionalAccessories: [
        { name: "Tai nghe gaming", price: 25000 },
        { name: "Bàn phím cơ mini", price: 30000 },
      ],
      additionalPet: { name: "Rồng mini", price: 35000 },
      background: {
        template: { name: "Template 5 - Gaming Theme" },
        title: "Gaming Master",
        name: "Ethan",
        song: "Epic Gaming Music",
      },
    }),
    char1_topColor: "Đen",
    char1_bottomColor: "Đỏ",
    char1_hair: "Tóc spike",
    char1_face: "Mặt cool",
    char2_topColor: "Tím",
    char2_bottomColor: "Đen",
    char2_hair: "Tóc dài màu tím",
    char2_face: "Mặt bí ẩn",
  },
  // New order for testing "Chờ demo" status
  {
    orderId: "SO20250612006",
    createdAt: "2025-06-12T08:00:00Z",
    status: "Chờ demo", // <--- Status for testing
    customerName: "Tester Chờ Demo",
    customerPhone: "0900000001",
    customerFacebook: "tester.chodemo",
    customerInstagram: "tester_chodemo_ig",
    customerEmail: "chodemo@test.com",
    customerAddress: "1 Test Street, Test City",
    isUrgent: false,
    version: "Version 1",
    versionPrice: 245000,
    totalPrice: 245000,
    customizationNotes: "Đơn hàng test trạng thái Chờ demo.",
    paymentMethod: "Chưa chọn",
    paymentStatus: "Pending",
    // Thông tin ảnh sản phẩm - chưa có ảnh nào
    productImages: {
      demoImage: null, // Chưa có ảnh demo
      backgroundImage: null, // Chưa có ảnh nền
      finalImage: null, // Chưa có ảnh sản phẩm hoàn thiện
    },
    shippingInfo: {
      // Has tracking URL, but status should prevent button
      trackingUrl: "https://example.com/track/SO20250612006",
      trackingNumber: "TRACK006",
    },
    customizationData: JSON.stringify({
      version: { selected: "version1" },
      characters: { character1: {}, character2: {} },
    }),
    char1_topColor: "Đỏ",
    char1_bottomColor: "Đen",
    char1_hair: "Tóc tém",
    char1_face: "Mặt vui",
  },
  // New order for testing "Đang xử lý" with NO tracking URL
  {
    orderId: "SO20250612007",
    createdAt: "2025-06-12T09:00:00Z",
    status: "Đang xử lý", // <--- Status for testing (should show if URL existed)
    customerName: "Tester Xử Lý NoURL",
    customerPhone: "0900000002",
    isUrgent: true,
    version: "Version 2",
    versionPrice: 250000,
    totalPrice: 250000,
    customizationNotes:
      "Đơn hàng test trạng thái Đang xử lý, không có URL theo dõi.",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Paid",
    shippingInfo: {
      // NO trackingUrl
      trackingNumber: "TRACK007_NO_URL",
    },
    customizationData: JSON.stringify({
      version: { selected: "version2" },
      characters: { character1: {}, character2: {} },
    }),
    char1_topColor: "Vàng",
    char1_bottomColor: "Xanh",
    char1_hair: "Tóc dài",
    char1_face: "Mặt ngầu",
  },
  // New order for testing "Chờ xác nhận" status
  {
    orderId: "SO20250613008",
    createdAt: "2025-06-13T10:00:00Z",
    status: "Chờ xác nhận", // <--- New status for testing
    customerName: "Tester Chờ Xác Nhận",
    customerPhone: "0900000003",
    customerFacebook: "tester.choxacnhan",
    customerInstagram: "tester_choxacnhan_ig",
    isUrgent: false,
    version: "Version 1",
    versionPrice: 245000,
    totalPrice: 245000,
    customizationNotes: "Đơn hàng test trạng thái Chờ xác nhận từ admin.",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Pending", // Chưa thanh toán, chờ admin xác nhận
    shippingInfo: {
      trackingUrl: "https://example.com/track/SO20250613008",
      trackingNumber: "TRACK008",
    },
    customizationData: JSON.stringify({
      version: { selected: "version1" },
      characters: { character1: {}, character2: {} },
    }),
    char1_topColor: "Tím",
    char1_bottomColor: "Trắng",
    char1_hair: "Tóc bob",
    char1_face: "Mặt cười",
  },
  // New order for testing shipping status with images
  {
    orderId: "SO20250614009",
    createdAt: "2025-06-14T11:00:00Z",
    status: "Đang vận chuyển", // <--- Status for testing images
    customerName: "Tester Đang Vận Chuyển",
    customerPhone: "0900000004",
    customerFacebook: "tester.dangvanchuyen",
    customerInstagram: "tester_shipping_ig",
    isUrgent: false,
    version: "Version 2",
    versionPrice: 250000,
    totalPrice: 275000,
    customizationNotes: "Đơn hàng test hiển thị ảnh - Đang vận chuyển.",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Paid", // Đã thanh toán - sẽ hiển thị ảnh
    // Thông tin ảnh sản phẩm - có một phần ảnh
    productImages: {
      demoImage: "https://picsum.photos/400/300?random=4", // Đã có ảnh demo
      backgroundImage: "https://picsum.photos/400/300?random=5", // Đã có ảnh nền
      finalImage: null, // Chưa có ảnh sản phẩm hoàn thiện (đang vận chuyển)
    },
    shippingInfo: {
      trackingUrl: "https://example.com/track/SO20250614009",
      trackingNumber: "TRACK009",
    },
    customizationData: JSON.stringify({
      version: { selected: "version2" },
      characters: { character1: {}, character2: {} },
    }),
    char1_topColor: "Xanh",
    char1_bottomColor: "Đen",
    char1_hair: "Tóc dài",
    char1_face: "Mặt cười",
    char2_topColor: "Hồng",
    char2_bottomColor: "Trắng",
    char2_hair: "Tóc ngắn",
    char2_face: "Mặt dễ thương",
  },
];

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
    customerEmail: orderData.customer.customerEmail || "",
    customerAddress: orderData.customer.customerAddress || "",
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
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
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
