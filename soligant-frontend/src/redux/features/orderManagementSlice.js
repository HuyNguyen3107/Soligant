// src/redux/features/orderManagementSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [], // Tất cả đơn hàng
  myAssignedOrders: [], // Đơn hàng được assign cho user hiện tại
  orderDetails: {}, // Cache chi tiết đơn hàng
  uploadProgress: {}, // Progress upload files
  isLoading: false,
  error: null,
};

const orderManagementSlice = createSlice({
  name: "orderManagement",
  initialState,
  reducers: {
    // Add new order from notification
    addNewOrder: (state, action) => {
      const { order, customer } = action.payload;
      const newOrder = {
        ...order,
        customer,
        assignedTo: null,
        assignedBy: null,
        assignedAt: null,
        status: "pending",
        priority: "normal",
        notes: [],
        attachments: {
          backgroundImages: [],
          demoImages: [],
          finalProductImages: [],
        },
        timeline: [
          {
            id: Date.now(),
            action: "order_created",
            message: "Đơn hàng được tạo",
            user: "System",
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.orders.unshift(newOrder);
    },

    // Assign order to user
    assignOrder: (state, action) => {
      const { orderId, userId, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        order.assignedTo = userId;
        order.assignedBy = userName;
        order.assignedAt = new Date().toISOString();
        order.status = "assigned";
        order.updatedAt = new Date().toISOString();

        // Add to timeline
        order.timeline.push({
          id: Date.now(),
          action: "order_assigned",
          message: `Đơn hàng được nhận xử lý bởi ${userName}`,
          user: userName,
          timestamp: new Date().toISOString(),
        });

        // Add to myAssignedOrders if current user
        state.myAssignedOrders.unshift(order);
      }
    },

    // Transfer order to another user
    transferOrder: (state, action) => {
      const { orderId, fromUserId, toUserId, toUserName, reason } =
        action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        order.assignedTo = toUserId;
        order.assignedBy = toUserName;
        order.assignedAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: Date.now(),
          action: "order_transferred",
          message: `Đơn hàng được chuyển giao cho ${toUserName}. Lý do: ${reason}`,
          user: toUserName,
          timestamp: new Date().toISOString(),
        });

        // Remove from current user's assigned orders
        state.myAssignedOrders = state.myAssignedOrders.filter(
          (o) => o.id !== orderId
        );
      }
    },

    // Update order status
    updateOrderStatus: (state, action) => {
      const { orderId, status, note, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        const oldStatus = order.status;
        order.status = status;
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: Date.now(),
          action: "status_updated",
          message: `Trạng thái đổi từ "${oldStatus}" thành "${status}"${
            note ? `. Ghi chú: ${note}` : ""
          }`,
          user: userName,
          timestamp: new Date().toISOString(),
        });

        // Update in myAssignedOrders
        const myOrder = state.myAssignedOrders.find((o) => o.id === orderId);
        if (myOrder) {
          myOrder.status = status;
          myOrder.updatedAt = order.updatedAt;
          myOrder.timeline = order.timeline;
        }
      }
    },

    // Add note to order
    addOrderNote: (state, action) => {
      const { orderId, note, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        const newNote = {
          id: Date.now(),
          content: note,
          user: userName,
          timestamp: new Date().toISOString(),
        };

        order.notes.push(newNote);
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: Date.now(),
          action: "note_added",
          message: `Thêm ghi chú: "${note}"`,
          user: userName,
          timestamp: new Date().toISOString(),
        });

        // Update in myAssignedOrders
        const myOrder = state.myAssignedOrders.find((o) => o.id === orderId);
        if (myOrder) {
          myOrder.notes = order.notes;
          myOrder.timeline = order.timeline;
          myOrder.updatedAt = order.updatedAt;
        }
      }
    },

    // Upload attachments
    uploadAttachment: (state, action) => {
      const { orderId, type, file, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order && order.attachments[type]) {
        const attachment = {
          id: Date.now(),
          name: file.name,
          url: file.url || URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadedBy: userName,
          uploadedAt: new Date().toISOString(),
        };

        order.attachments[type].push(attachment);
        order.updatedAt = new Date().toISOString();

        const typeNames = {
          backgroundImages: "ảnh background",
          demoImages: "ảnh demo",
          finalProductImages: "ảnh sản phẩm hoàn thiện",
        };

        order.timeline.push({
          id: Date.now(),
          action: "file_uploaded",
          message: `Tải lên ${typeNames[type]}: ${file.name}`,
          user: userName,
          timestamp: new Date().toISOString(),
        });

        // Update in myAssignedOrders
        const myOrder = state.myAssignedOrders.find((o) => o.id === orderId);
        if (myOrder) {
          myOrder.attachments = order.attachments;
          myOrder.timeline = order.timeline;
          myOrder.updatedAt = order.updatedAt;
        }
      }
    },

    // Remove attachment
    removeAttachment: (state, action) => {
      const { orderId, type, attachmentId, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order && order.attachments[type]) {
        const attachment = order.attachments[type].find(
          (a) => a.id === attachmentId
        );
        if (attachment) {
          order.attachments[type] = order.attachments[type].filter(
            (a) => a.id !== attachmentId
          );
          order.updatedAt = new Date().toISOString();

          order.timeline.push({
            id: Date.now(),
            action: "file_removed",
            message: `Xóa file: ${attachment.name}`,
            user: userName,
            timestamp: new Date().toISOString(),
          });

          // Update in myAssignedOrders
          const myOrder = state.myAssignedOrders.find((o) => o.id === orderId);
          if (myOrder) {
            myOrder.attachments = order.attachments;
            myOrder.timeline = order.timeline;
            myOrder.updatedAt = order.updatedAt;
          }
        }
      }
    },

    // Confirm order (customer paid)
    confirmOrder: (state, action) => {
      const { orderId, paymentInfo, userName } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        order.status = "confirmed";
        order.paymentInfo = paymentInfo;
        order.confirmedAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: Date.now(),
          action: "order_confirmed",
          message: `Đơn hàng được xác nhận đã thanh toán. Phương thức: ${paymentInfo.method}`,
          user: userName,
          timestamp: new Date().toISOString(),
        });

        // Update in myAssignedOrders
        const myOrder = state.myAssignedOrders.find((o) => o.id === orderId);
        if (myOrder) {
          myOrder.status = order.status;
          myOrder.paymentInfo = order.paymentInfo;
          myOrder.confirmedAt = order.confirmedAt;
          myOrder.timeline = order.timeline;
          myOrder.updatedAt = order.updatedAt;
        }
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Load my assigned orders
    loadMyAssignedOrders: (state, action) => {
      state.myAssignedOrders = action.payload;
    },

    // Update order details cache
    updateOrderDetails: (state, action) => {
      const { orderId, details } = action.payload;
      state.orderDetails[orderId] = details;
    },
  },
});

export const {
  addNewOrder,
  assignOrder,
  transferOrder,
  updateOrderStatus,
  addOrderNote,
  uploadAttachment,
  removeAttachment,
  confirmOrder,
  setLoading,
  setError,
  clearError,
  loadMyAssignedOrders,
  updateOrderDetails,
} = orderManagementSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orderManagement.orders;
export const selectMyAssignedOrders = (state) =>
  state.orderManagement.myAssignedOrders;
export const selectOrderDetails = (state, orderId) =>
  state.orderManagement.orderDetails[orderId];
export const selectUnassignedOrders = (state) =>
  state.orderManagement.orders.filter((order) => !order.assignedTo);
export const selectOrdersAssignedToMe = (state, userId) =>
  state.orderManagement.orders.filter((order) => order.assignedTo === userId);
export const selectIsLoading = (state) => state.orderManagement.isLoading;
export const selectError = (state) => state.orderManagement.error;

export default orderManagementSlice.reducer;
