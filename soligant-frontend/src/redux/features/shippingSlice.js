// src/redux/features/shippingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock API calls - sẽ thay thế bằng API thật sau
export const fetchShippingOrders = createAsyncThunk(
  "shipping/fetchOrders",
  async ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data
    const allOrders = [
      {
        id: "SHIP001",
        orderId: "SO-202501",
        viettelPostCode: "VP2025061401",
        customerName: "Nguyễn Văn An",
        customerPhone: "0901234567",
        customerAddress: "123 Nguyễn Huệ, Q1, TP.HCM",
        customerEmail: "nguyenvanan@email.com",
        productInfo: "Áo thun custom in hình + Background gradient",
        weight: 0.3,
        dimensions: "30x25x5",
        value: 295000,
        shippingFee: 25000,
        codAmount: 295000,
        status: "in_transit",
        createdAt: "2025-06-14T08:30:00",
        expectedDelivery: "2025-06-16T17:00:00",
        currentLocation: "Bưu cục Quận 1, TP.HCM",
        trackingHistory: [
          {
            time: "2025-06-14T08:30:00",
            location: "Kho Soligant",
            status: "created",
            description: "Đơn hàng được tạo và chuẩn bị giao cho Viettel Post",
          },
          {
            time: "2025-06-14T10:15:00",
            location: "Bưu cục phát, Q1",
            status: "picked_up",
            description: "Viettel Post đã nhận hàng từ người gửi",
          },
          {
            time: "2025-06-14T14:20:00",
            location: "Trung tâm phân loại TP.HCM",
            status: "in_transit",
            description: "Hàng đang được vận chuyển",
          },
        ],
      },
      {
        id: "SHIP002",
        orderId: "SO-202502",
        viettelPostCode: "VP2025061402",
        customerName: "Trần Thị Bích",
        customerPhone: "0912345678",
        customerAddress: "456 Lê Lợi, Q3, TP.HCM",
        customerEmail: "tranthbich@email.com",
        productInfo: "Áo hoodie custom logo công ty",
        weight: 0.5,
        dimensions: "35x30x8",
        value: 450000,
        shippingFee: 30000,
        codAmount: 450000,
        status: "delivered",
        createdAt: "2025-06-13T09:15:00",
        expectedDelivery: "2025-06-15T16:00:00",
        currentLocation: "Đã giao hàng",
        trackingHistory: [
          {
            time: "2025-06-13T09:15:00",
            location: "Kho Soligant",
            status: "created",
            description: "Đơn hàng được tạo và chuẩn bị giao cho Viettel Post",
          },
          {
            time: "2025-06-13T11:30:00",
            location: "Bưu cục phát, Q3",
            status: "picked_up",
            description: "Viettel Post đã nhận hàng từ người gửi",
          },
          {
            time: "2025-06-13T15:45:00",
            location: "Trung tâm phân loại TP.HCM",
            status: "in_transit",
            description: "Hàng đang được vận chuyển",
          },
          {
            time: "2025-06-14T09:20:00",
            location: "Bưu cục giao hàng Q3",
            status: "out_for_delivery",
            description: "Hàng đang được giao",
          },
          {
            time: "2025-06-14T14:30:00",
            location: "456 Lê Lợi, Q3",
            status: "delivered",
            description: "Đã giao hàng thành công",
          },
        ],
      },
      {
        id: "SHIP003",
        orderId: "SO-202503",
        viettelPostCode: "VP2025061403",
        customerName: "Phạm Minh Tuấn",
        customerPhone: "0923456789",
        customerAddress: "789 Võ Văn Tần, Q5, TP.HCM",
        customerEmail: "phamminhtuan@email.com",
        productInfo: "Set áo đôi custom cho couple",
        weight: 0.4,
        dimensions: "32x28x6",
        value: 380000,
        shippingFee: 28000,
        codAmount: 380000,
        status: "pending",
        createdAt: "2025-06-14T15:20:00",
        expectedDelivery: "2025-06-17T17:00:00",
        currentLocation: "Chưa giao cho Viettel Post",
        trackingHistory: [
          {
            time: "2025-06-14T15:20:00",
            location: "Kho Soligant",
            status: "created",
            description: "Đơn hàng được tạo và đang chuẩn bị",
          },
        ],
      },
    ];

    // Filter by search
    let filteredOrders = allOrders;
    if (search) {
      filteredOrders = allOrders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.viettelPostCode.toLowerCase().includes(search.toLowerCase()) ||
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          order.customerPhone.includes(search)
      );
    }

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      totalOrders: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / limit),
      currentPage: page,
    };
  }
);

export const createShippingOrder = createAsyncThunk(
  "shipping/createOrder",
  async (orderData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock creating shipping order
    const newShippingOrder = {
      id: `SHIP${Date.now()}`,
      viettelPostCode: `VP${Date.now()}`,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
      expectedDelivery: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      currentLocation: "Chưa giao cho Viettel Post",
      trackingHistory: [
        {
          time: new Date().toISOString(),
          location: "Kho Soligant",
          status: "created",
          description: "Đơn hàng được tạo và đang chuẩn bị",
        },
      ],
    };

    return newShippingOrder;
  }
);

export const updateShippingStatus = createAsyncThunk(
  "shipping/updateStatus",
  async ({ shippingId, status, location, description }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTrackingEntry = {
      time: new Date().toISOString(),
      location,
      status,
      description,
    };

    return {
      shippingId,
      status,
      location,
      newTrackingEntry,
    };
  }
);

export const trackShippingPublic = createAsyncThunk(
  "shipping/trackPublic",
  async (trackingCode) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock tracking data
    const trackingData = {
      VP2025061401: {
        viettelPostCode: "VP2025061401",
        orderId: "SO-202501",
        customerName: "Nguyễn Văn An",
        customerPhone: "0901234567",
        customerAddress: "123 Nguyễn Huệ, Q1, TP.HCM",
        productInfo: "Áo thun custom in hình + Background gradient",
        weight: 0.3,
        dimensions: "30x25x5",
        value: 295000,
        shippingFee: 25000,
        status: "in_transit",
        createdAt: "2025-06-14T08:30:00",
        expectedDelivery: "2025-06-16T17:00:00",
        currentLocation: "Bưu cục Quận 1, TP.HCM",
        trackingHistory: [
          {
            time: "2025-06-14T08:30:00",
            location: "Kho Soligant",
            status: "created",
            description: "Đơn hàng được tạo và chuẩn bị giao cho Viettel Post",
          },
          {
            time: "2025-06-14T10:15:00",
            location: "Bưu cục phát, Q1",
            status: "picked_up",
            description: "Viettel Post đã nhận hàng từ người gửi",
          },
          {
            time: "2025-06-14T14:20:00",
            location: "Trung tâm phân loại TP.HCM",
            status: "in_transit",
            description: "Hàng đang được vận chuyển",
          },
        ],
      },
      VP2025061402: {
        viettelPostCode: "VP2025061402",
        orderId: "SO-202502",
        customerName: "Trần Thị Bích",
        customerPhone: "0912345678",
        customerAddress: "456 Lê Lợi, Q3, TP.HCM",
        productInfo: "Áo hoodie custom logo công ty",
        weight: 0.5,
        dimensions: "35x30x8",
        value: 450000,
        shippingFee: 30000,
        status: "delivered",
        createdAt: "2025-06-13T09:15:00",
        expectedDelivery: "2025-06-15T16:00:00",
        currentLocation: "Đã giao hàng",
        trackingHistory: [
          {
            time: "2025-06-13T09:15:00",
            location: "Kho Soligant",
            status: "created",
            description: "Đơn hàng được tạo và chuẩn bị giao cho Viettel Post",
          },
          {
            time: "2025-06-13T11:30:00",
            location: "Bưu cục phát, Q3",
            status: "picked_up",
            description: "Viettel Post đã nhận hàng từ người gửi",
          },
          {
            time: "2025-06-13T15:45:00",
            location: "Trung tâm phân loại TP.HCM",
            status: "in_transit",
            description: "Hàng đang được vận chuyển",
          },
          {
            time: "2025-06-14T09:20:00",
            location: "Bưu cục giao hàng Q3",
            status: "out_for_delivery",
            description: "Hàng đang được giao",
          },
          {
            time: "2025-06-14T14:30:00",
            location: "456 Lê Lợi, Q3",
            status: "delivered",
            description: "Đã giao hàng thành công",
          },
        ],
      },
    };

    const result = trackingData[trackingCode];
    if (!result) {
      throw new Error("Không tìm thấy thông tin vận chuyển");
    }

    return result;
  }
);

const initialState = {
  orders: [],
  totalOrders: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedOrder: null,
  trackingResult: null,
  trackingLoading: false,
  trackingError: null,
  filters: {
    search: "",
    status: "",
    page: 1,
    limit: 10,
  },
  statistics: {
    totalShipments: 0,
    pendingShipments: 0,
    inTransitShipments: 0,
    deliveredShipments: 0,
    totalRevenue: 0,
  },
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearTrackingResult: (state) => {
      state.trackingResult = null;
      state.trackingError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.trackingError = null;
    },
    updateOrderInList: (state, action) => {
      const { shippingId, updates } = action.payload;
      const orderIndex = state.orders.findIndex(
        (order) => order.id === shippingId
      );
      if (orderIndex !== -1) {
        state.orders[orderIndex] = { ...state.orders[orderIndex], ...updates };
      }
    },
    calculateStatistics: (state) => {
      const orders = state.orders;
      state.statistics = {
        totalShipments: orders.length,
        pendingShipments: orders.filter((o) => o.status === "pending").length,
        inTransitShipments: orders.filter((o) => o.status === "in_transit")
          .length,
        deliveredShipments: orders.filter((o) => o.status === "delivered")
          .length,
        totalRevenue: orders.reduce(
          (sum, order) => sum + (order.value || 0),
          0
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shipping orders
      .addCase(fetchShippingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        shippingSlice.caseReducers.calculateStatistics(state);
      })
      .addCase(fetchShippingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create shipping order
      .addCase(createShippingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShippingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.totalOrders += 1;
        shippingSlice.caseReducers.calculateStatistics(state);
      })
      .addCase(createShippingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update shipping status
      .addCase(updateShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { shippingId, status, location, newTrackingEntry } =
          action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order.id === shippingId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
          state.orders[orderIndex].currentLocation = location;
          state.orders[orderIndex].trackingHistory.push(newTrackingEntry);
        }
        shippingSlice.caseReducers.calculateStatistics(state);
      })
      .addCase(updateShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Track shipping public
      .addCase(trackShippingPublic.pending, (state) => {
        state.trackingLoading = true;
        state.trackingError = null;
        state.trackingResult = null;
      })
      .addCase(trackShippingPublic.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.trackingResult = action.payload;
      })
      .addCase(trackShippingPublic.rejected, (state, action) => {
        state.trackingLoading = false;
        state.trackingError = action.error.message;
      });
  },
});

export const {
  setFilters,
  setSelectedOrder,
  clearTrackingResult,
  clearError,
  updateOrderInList,
  calculateStatistics,
} = shippingSlice.actions;

// Selectors
export const selectShippingOrders = (state) => state.shipping.orders;
export const selectShippingLoading = (state) => state.shipping.loading;
export const selectShippingError = (state) => state.shipping.error;
export const selectShippingFilters = (state) => state.shipping.filters;
export const selectShippingStatistics = (state) => state.shipping.statistics;
export const selectShippingPagination = (state) => ({
  currentPage: state.shipping.currentPage,
  totalPages: state.shipping.totalPages,
  totalOrders: state.shipping.totalOrders,
});
export const selectSelectedShippingOrder = (state) =>
  state.shipping.selectedOrder;
export const selectTrackingResult = (state) => state.shipping.trackingResult;
export const selectTrackingLoading = (state) => state.shipping.trackingLoading;
export const selectTrackingError = (state) => state.shipping.trackingError;

export default shippingSlice.reducer;
