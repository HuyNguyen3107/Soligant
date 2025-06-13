// src/redux/features/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Tin nhắn mẫu mặc định
const DEFAULT_MESSAGE_TEMPLATE = `Xin chào {customerName},

Cảm ơn bạn đã đặt hàng tại SOLIGANT! 🎓

📋 THÔNG TIN ĐŠN HÀNG:
• Mã đơn hàng: {orderCode}
• Sản phẩm: {productName} x{quantity}
• Tổng tiền: {totalAmount}
• Ngày đặt: {orderDate}
• Thời gian: {orderTime}

� THÔNG TIN KHÁCH HÀNG:
• Họ tên: {customerName}
• Số điện thoại: {customerPhone}
• Email: {customerEmail}

📞 LIÊN HỆ XÁC NHẬN ĐƠN HÀNG:
Anh/chị vui lòng xác nhận đơn hàng qua:
• Hotline: 0123.456.789
• Zalo: 0123.456.789

⏰ Chúng tôi sẽ xử lý đơn hàng trong vòng 30 phút.

Cảm ơn anh/chị đã tin tướng SOLIGANT! 💙

---
Team SOLIGANT
🎓 Chuyên nghiệp - Uy tín - Chất lượng`;

const initialState = {
  notifications: [],
  messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
  unreadCount: 0,
  orderNotifications: [], // Notifications specifically for new orders
  isEnabled: true, // Enable/disable notifications
  soundEnabled: true, // Enable/disable notification sound
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Add new order notification
    addOrderNotification: (state, action) => {
      const { order, customer } = action.payload;

      // Create notification
      const notification = {
        id: `order-${order.id}-${Date.now()}`,
        type: "new_order",
        title: "Đơn hàng mới",
        message: `Khách hàng ${customer.name} vừa đặt đơn hàng ${order.code}`,
        order: order,
        customer: customer,
        timestamp: new Date().toISOString(),
        read: false,
        priority: "high",
      };

      // Generate message template with customer data
      const orderDate = new Date(order.createdAt);
      const generatedMessage = state.messageTemplate
        .replace("{customerName}", customer.name)
        .replace("{orderCode}", order.code)
        .replace("{productName}", order.productName)
        .replace("{quantity}", order.quantity)
        .replace(
          "{totalAmount}",
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.total)
        )
        .replace("{orderDate}", orderDate.toLocaleDateString("vi-VN"))
        .replace("{orderTime}", orderDate.toLocaleTimeString("vi-VN"))
        .replace("{customerPhone}", customer.phone)
        .replace("{customerEmail}", customer.email);

      notification.generatedMessage = generatedMessage;

      state.notifications.unshift(notification);
      state.orderNotifications.unshift(notification);
      state.unreadCount += 1;

      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      if (state.orderNotifications.length > 20) {
        state.orderNotifications = state.orderNotifications.slice(0, 20);
      }
    },

    // Add general notification
    addNotification: (state, action) => {
      const notification = {
        id: `notification-${Date.now()}`,
        type: action.payload.type || "info",
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: action.payload.priority || "normal",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;

      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Mark notification as read
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Mark all as read
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },

    // Remove notification
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );

      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }

      state.notifications = state.notifications.filter(
        (n) => n.id !== notificationId
      );
      state.orderNotifications = state.orderNotifications.filter(
        (n) => n.id !== notificationId
      );
    },

    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.orderNotifications = [];
      state.unreadCount = 0;
    },

    // Update message template
    updateMessageTemplate: (state, action) => {
      state.messageTemplate = action.payload;
    },

    // Reset to default template
    resetMessageTemplate: (state) => {
      state.messageTemplate = DEFAULT_MESSAGE_TEMPLATE;
    },

    // Toggle notifications enabled/disabled
    toggleNotifications: (state) => {
      state.isEnabled = !state.isEnabled;
    },

    // Toggle sound enabled/disabled
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    // Update notification settings
    updateSettings: (state, action) => {
      const { isEnabled, soundEnabled } = action.payload;
      if (typeof isEnabled === "boolean") state.isEnabled = isEnabled;
      if (typeof soundEnabled === "boolean") state.soundEnabled = soundEnabled;
    },
  },
});

export const {
  addOrderNotification,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  updateMessageTemplate,
  resetMessageTemplate,
  toggleNotifications,
  toggleSound,
  updateSettings,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectOrderNotifications = (state) =>
  state.notifications.orderNotifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectMessageTemplate = (state) =>
  state.notifications.messageTemplate;
export const selectNotificationSettings = (state) => ({
  isEnabled: state.notifications.isEnabled,
  soundEnabled: state.notifications.soundEnabled,
});
