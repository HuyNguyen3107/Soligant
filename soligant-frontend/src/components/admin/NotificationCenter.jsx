// src/components/admin/NotificationCenter.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CogIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  TrashIcon,
  UserPlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/24/solid";
import {
  selectNotifications,
  selectOrderNotifications,
  selectUnreadCount,
  selectMessageTemplate,
  selectNotificationSettings,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  updateMessageTemplate,
  resetMessageTemplate,
  toggleNotifications,
  toggleSound,
} from "../../redux/features/notificationSlice";
import { assignOrder } from "../../redux/features/orderManagementSlice";
import { selectCurrentUser } from "../../redux/features/authSlice";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'orders'
  const [showSettings, setShowSettings] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [templateText, setTemplateText] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector(selectNotifications);
  const orderNotifications = useSelector(selectOrderNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const messageTemplate = useSelector(selectMessageTemplate);
  const { isEnabled, soundEnabled } = useSelector(selectNotificationSettings);
  const currentUser = useSelector(selectCurrentUser);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;

    // Create audio context for better browser support
    try {
      // Use Web Audio API to generate a simple notification sound
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a pleasant notification sound (two-tone bell)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback: use a simple beep
      console.log("🔔 Notification sound (audio not available)");
    }
  };

  // Watch for new notifications and play sound
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const isNewNotification =
        !latestNotification.read &&
        Date.now() - new Date(latestNotification.timestamp).getTime() < 5000; // Within 5 seconds

      if (isNewNotification && soundEnabled) {
        setTimeout(() => playNotificationSound(), 100); // Small delay to ensure notification is rendered
      }
    }
  }, [notifications, soundEnabled]);

  const displayNotifications =
    activeTab === "orders" ? orderNotifications : notifications;

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemoveNotification = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };
  const handleToggleNotifications = () => {
    dispatch(toggleNotifications());
    const newStatus = !isEnabled;
    setToastMessage(newStatus ? "🔔 Đã bật thông báo" : "🔕 Đã tắt thông báo");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSound = () => {
    dispatch(toggleSound());
    const newStatus = !soundEnabled;
    setToastMessage(newStatus ? "🔊 Đã bật âm thanh" : "🔇 Đã tắt âm thanh");
    setTimeout(() => setToastMessage(null), 3000);
  };
  const handleCopyMessage = async (text, notificationId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(notificationId);
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };
  const handleCopyPhoneNumber = async (phone, notificationId) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedMessage(`phone-${notificationId}`);
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };
  const handleClearAll = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả thông báo?")) {
      dispatch(clearAllNotifications());
    }
  };

  const handleSaveTemplate = () => {
    dispatch(updateMessageTemplate(templateText));
    setEditingTemplate(false);
  };

  const handleResetTemplate = () => {
    if (confirm("Bạn có chắc chắn muốn reset về tin nhắn mẫu mặc định?")) {
      dispatch(resetMessageTemplate());
      setTemplateText(messageTemplate);
    }
  };
  const handleAssignOrder = (notification) => {
    if (!currentUser) return;

    // Assign order to current user
    dispatch(
      assignOrder({
        orderId: notification.order.id,
        userId: currentUser.id,
        userName: currentUser.name,
      })
    ); // Mark notification as read
    dispatch(markAsRead(notification.id));

    // Show success message and navigate
    setToastMessage(`✅ Đã nhận xử lý đơn hàng ${notification.order.code}`);
    setTimeout(() => {
      setToastMessage(null);
      setIsOpen(false);
      navigate("/admin/my-orders");
    }, 1500);
  };

  const handleViewOrderDetails = (notification) => {
    // Navigate to order details page (will implement later)
    console.log("View order details:", notification.order);
    // For now, just mark as read
    dispatch(markAsRead(notification.id));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_order":
        return "🛒";
      case "payment":
        return "💰";
      case "shipping":
        return "🚚";
      case "review":
        return "⭐";
      default:
        return "📋";
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title={`Thông báo (${unreadCount} chưa đọc)`}
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="h-6 w-6 text-blue-600" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Cài đặt"
                  >
                    <CogIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Settings Panel */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2"
                >
                  {" "}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">
                        Bật thông báo
                      </span>
                      <span className="text-xs text-gray-500">
                        Nhận thông báo mới
                      </span>
                    </div>{" "}
                    <button
                      onClick={handleToggleNotifications}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        isEnabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      title={isEnabled ? "Tắt thông báo" : "Bật thông báo"}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">
                        Âm thanh thông báo
                      </span>
                      <span className="text-xs text-gray-500">
                        Phát âm thanh khi có thông báo mới
                      </span>
                    </div>
                    <button
                      onClick={handleToggleSound}
                      className={`p-1 rounded transition-colors ${
                        soundEnabled
                          ? "text-blue-600 hover:text-blue-800 bg-blue-50"
                          : "text-gray-400 hover:text-gray-600 bg-gray-50"
                      }`}
                      title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                    >
                      {soundEnabled ? (
                        <SpeakerWaveIcon className="h-4 w-4" />
                      ) : (
                        <SpeakerXMarkIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Test Sound Button */}
                  <button
                    onClick={playNotificationSound}
                    disabled={!soundEnabled}
                    className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                      soundEnabled
                        ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    🔊 Test âm thanh thông báo
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(true);
                      setTemplateText(messageTemplate);
                      setShowSettings(false);
                    }}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800"
                  >
                    Chỉnh sửa tin nhắn mẫu
                  </button>
                </motion.div>
              )}
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "orders"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Đơn hàng ({orderNotifications.length})
                </button>
              </div>{" "}
              {/* Notification Status */}
              {!isEnabled && (
                <div className="px-4 py-2 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Thông báo đã bị tắt. Bật lại trong cài đặt để nhận thông
                    báo mới.
                  </p>
                </div>
              )}
              {/* Actions */}
              {displayNotifications.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-sm px-4">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Đánh dấu đã đọc
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {displayNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Không có thông báo nào</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {displayNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onRemove={handleRemoveNotification}
                      onCopyMessage={handleCopyMessage}
                      onCopyPhoneNumber={handleCopyPhoneNumber}
                      copiedMessage={copiedMessage}
                      formatTime={formatTime}
                      getNotificationIcon={getNotificationIcon}
                      onAssignOrder={handleAssignOrder}
                      onViewOrderDetails={handleViewOrderDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">
              Chỉnh sửa tin nhắn mẫu
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung tin nhắn
              </label>
              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập nội dung tin nhắn mẫu..."
              />{" "}
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  <strong>Biến có thể sử dụng:</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p>• {"{customerName}"} - Tên khách hàng</p>
                    <p>• {"{customerPhone}"} - Số điện thoại</p>
                    <p>• {"{customerEmail}"} - Email khách hàng</p>
                  </div>
                  <div>
                    <p>• {"{orderCode}"} - Mã đơn hàng</p>
                    <p>• {"{productName}"} - Tên sản phẩm</p>
                    <p>• {"{quantity}"} - Số lượng</p>
                  </div>
                  <div>
                    <p>• {"{totalAmount}"} - Tổng tiền</p>
                    <p>• {"{orderDate}"} - Ngày đặt</p>
                    <p>• {"{orderTime}"} - Giờ đặt</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleResetTemplate}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset mặc định
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => setEditingTemplate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onRemove,
  onCopyMessage,
  onCopyPhoneNumber,
  copiedMessage,
  formatTime,
  getNotificationIcon,
  onAssignOrder,
  onViewOrderDetails,
}) => {
  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
        notification.read
          ? "border-gray-200 bg-white"
          : "border-blue-500 bg-blue-50"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4
              className={`text-sm font-medium ${
                notification.read ? "text-gray-900" : "text-blue-900"
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatTime(notification.timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>

          {/* Order notification specific content */}
          {notification.type === "new_order" && notification.customer && (
            <div className="mt-3 space-y-2">
              {/* Customer Info */}
              <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="text-xs font-medium text-yellow-800 mb-1">
                  Thông tin khách hàng:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-700">
                      📞 {notification.customer.phone}
                    </span>
                    <button
                      onClick={() =>
                        onCopyPhoneNumber(
                          notification.customer.phone,
                          notification.id
                        )
                      }
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        copiedMessage === `phone-${notification.id}`
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {copiedMessage === `phone-${notification.id}`
                        ? "✓ Đã copy"
                        : "Copy SĐT"}
                    </button>
                  </div>
                  <p className="text-xs text-yellow-700">
                    ✉️ {notification.customer.email}
                  </p>
                  <p className="text-xs text-yellow-700">
                    🛒 {notification.order.code} -{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(notification.order.total)}
                  </p>
                </div>
              </div>

              {/* Generated Message */}
              {notification.generatedMessage && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">
                      💬 Tin nhắn liên hệ:
                    </span>
                    <button
                      onClick={() =>
                        onCopyMessage(
                          notification.generatedMessage,
                          notification.id
                        )
                      }
                      className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                        copiedMessage === notification.id
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {copiedMessage === notification.id ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <ClipboardDocumentIcon className="h-3 w-3" />
                      )}
                      <span>
                        {copiedMessage === notification.id
                          ? "Đã copy"
                          : "Copy tin nhắn"}
                      </span>
                    </button>
                  </div>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4 font-mono">
                    {notification.generatedMessage}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Đánh dấu đã đọc
                </button>
              )}
              {notification.type === "new_order" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAssignOrder(notification)}
                    className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Nhận đơn
                  </button>
                  <button
                    onClick={() => onViewOrderDetails(notification)}
                    className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Xóa thông báo"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
