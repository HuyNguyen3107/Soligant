// src/pages/admin/MyOrderManagement.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  PencilIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  TrashIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import {
  selectMyAssignedOrders,
  updateOrderStatus,
  addOrderNote,
  uploadAttachment,
  removeAttachment,
  confirmOrder,
  transferOrder,
} from "../../redux/features/orderManagementSlice";
import { selectCurrentUser } from "../../redux/features/authSlice";
import { selectMessageTemplate } from "../../redux/features/notificationSlice";

const MyOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // details, timeline, attachments
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [transferUserId, setTransferUserId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [draggedFile, setDraggedFile] = useState(null);
  const [uploadType, setUploadType] = useState("backgroundImages");
  const [generatedMessage, setGeneratedMessage] = useState("");

  const dispatch = useDispatch();
  const myOrders = useSelector(selectMyAssignedOrders);
  const currentUser = useSelector(selectCurrentUser);
  const messageTemplate = useSelector(selectMessageTemplate);

  // Mock users for transfer
  const availableUsers = [
    { id: "user1", name: "Admin Chính", role: "Super Admin" },
    { id: "user2", name: "Quản lý A", role: "Manager" },
    { id: "user3", name: "Nhân viên B", role: "Staff" },
    { id: "user4", name: "Nhân viên C", role: "Staff" },
  ].filter((user) => user.id !== currentUser?.id);

  const statusOptions = [
    { value: "assigned", label: "Đã nhận", color: "blue" },
    { value: "processing", label: "Đang xử lý", color: "yellow" },
    { value: "waiting_payment", label: "Chờ thanh toán", color: "orange" },
    { value: "confirmed", label: "Đã xác nhận", color: "green" },
    { value: "completed", label: "Hoàn thành", color: "emerald" },
    { value: "cancelled", label: "Đã hủy", color: "red" },
  ];

  const attachmentTypes = [
    { key: "backgroundImages", label: "Ảnh Background", icon: PhotoIcon },
    { key: "demoImages", label: "Ảnh Demo", icon: EyeIcon },
    { key: "finalProductImages", label: "Ảnh Sản phẩm", icon: CheckCircleIcon },
  ];

  const filteredOrders = myOrders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  // Generate message when order is selected
  useEffect(() => {
    if (selectedOrder && messageTemplate) {
      const message = messageTemplate
        .replace("{customerName}", selectedOrder.customer.name)
        .replace("{orderCode}", selectedOrder.code)
        .replace("{productName}", selectedOrder.productName)
        .replace("{quantity}", selectedOrder.quantity)
        .replace(
          "{totalAmount}",
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(selectedOrder.total)
        )
        .replace(
          "{orderDate}",
          new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")
        )
        .replace(
          "{orderTime}",
          new Date(selectedOrder.createdAt).toLocaleTimeString("vi-VN")
        )
        .replace("{customerPhone}", selectedOrder.customer.phone)
        .replace("{customerEmail}", selectedOrder.customer.email);

      setGeneratedMessage(message);
    }
  }, [selectedOrder, messageTemplate]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    setActiveTab("details");
    setNewStatus(order.status);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus && newStatus !== selectedOrder.status) {
      dispatch(
        updateOrderStatus({
          orderId: selectedOrder.id,
          status: newStatus,
          note: newNote,
          userName: currentUser?.name || "Unknown",
        })
      );
      setNewNote("");
    }
  };

  const handleAddNote = () => {
    if (selectedOrder && newNote.trim()) {
      dispatch(
        addOrderNote({
          orderId: selectedOrder.id,
          note: newNote.trim(),
          userName: currentUser?.name || "Unknown",
        })
      );
      setNewNote("");
    }
  };

  const handleFileUpload = (files, type) => {
    if (selectedOrder && files.length > 0) {
      Array.from(files).forEach((file) => {
        dispatch(
          uploadAttachment({
            orderId: selectedOrder.id,
            type: type,
            file: file,
            userName: currentUser?.name || "Unknown",
          })
        );
      });
    }
  };

  const handleRemoveAttachment = (type, attachmentId) => {
    if (selectedOrder) {
      dispatch(
        removeAttachment({
          orderId: selectedOrder.id,
          type: type,
          attachmentId: attachmentId,
          userName: currentUser?.name || "Unknown",
        })
      );
    }
  };

  const handleConfirmOrder = () => {
    if (selectedOrder) {
      const paymentInfo = {
        method: "bank_transfer", // Could be made dynamic
        amount: selectedOrder.total,
        confirmedAt: new Date().toISOString(),
      };

      dispatch(
        confirmOrder({
          orderId: selectedOrder.id,
          paymentInfo: paymentInfo,
          userName: currentUser?.name || "Unknown",
        })
      );
    }
  };

  const handleTransferOrder = () => {
    if (selectedOrder && transferUserId && transferReason.trim()) {
      const toUser = availableUsers.find((u) => u.id === transferUserId);
      dispatch(
        transferOrder({
          orderId: selectedOrder.id,
          fromUserId: currentUser?.id,
          toUserId: transferUserId,
          toUserName: toUser?.name || "Unknown",
          reason: transferReason.trim(),
        })
      );

      setShowTransferModal(false);
      setShowOrderModal(false);
      setTransferUserId("");
      setTransferReason("");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show toast or feedback
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("vi-VN");
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    return statusObj?.color || "gray";
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    return statusObj?.label || status;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các đơn hàng đã nhận xử lý ({myOrders.length} đơn)
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.code}</h3>
                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full bg-${getStatusColor(
                    order.status
                  )}-100 text-${getStatusColor(order.status)}-800`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Order Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatTime(order.createdAt)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  {order.productName} x{order.quantity}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => copyToClipboard(order.customer.phone)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy SĐT"
                >
                  📞
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-600">
            {filterStatus === "all"
              ? "Hãy nhận xử lý đơn hàng từ thông báo để bắt đầu."
              : `Không có đơn hàng nào với trạng thái "${getStatusLabel(
                  filterStatus
                )}".`}
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Đơn hàng {selectedOrder.code}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Khách hàng: {selectedOrder.customer.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    {
                      id: "details",
                      label: "Chi tiết",
                      icon: DocumentTextIcon,
                    },
                    { id: "timeline", label: "Timeline", icon: ClockIcon },
                    { id: "attachments", label: "Files", icon: PaperClipIcon },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === "details" && (
                  <OrderDetailsTab
                    order={selectedOrder}
                    currentUser={currentUser}
                    statusOptions={statusOptions}
                    newStatus={newStatus}
                    setNewStatus={setNewStatus}
                    newNote={newNote}
                    setNewNote={setNewNote}
                    onUpdateStatus={handleUpdateStatus}
                    onAddNote={handleAddNote}
                    onConfirmOrder={handleConfirmOrder}
                    onTransfer={() => setShowTransferModal(true)}
                    generatedMessage={generatedMessage}
                    onCopyMessage={copyToClipboard}
                  />
                )}

                {activeTab === "timeline" && (
                  <TimelineTab order={selectedOrder} />
                )}

                {activeTab === "attachments" && (
                  <AttachmentsTab
                    order={selectedOrder}
                    attachmentTypes={attachmentTypes}
                    onFileUpload={handleFileUpload}
                    onRemoveAttachment={handleRemoveAttachment}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Chuyển giao đơn hàng
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chuyển cho:
                    </label>
                    <select
                      value={transferUserId}
                      onChange={(e) => setTransferUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn người nhận</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do chuyển giao:
                    </label>
                    <textarea
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lý do chuyển giao..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleTransferOrder}
                    disabled={!transferUserId || !transferReason.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Chuyển giao
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Details Tab Component
const OrderDetailsTab = ({
  order,
  currentUser,
  statusOptions,
  newStatus,
  setNewStatus,
  newNote,
  setNewNote,
  onUpdateStatus,
  onAddNote,
  onConfirmOrder,
  onTransfer,
  generatedMessage,
  onCopyMessage,
}) => {
  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-3">
          👤 Thông tin khách hàng
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-yellow-700">Họ tên:</label>
            <p className="font-medium">{order.customer.name}</p>
          </div>
          <div>
            <label className="text-sm text-yellow-700">Số điện thoại:</label>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{order.customer.phone}</p>
              <button
                onClick={() => onCopyMessage(order.customer.phone)}
                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-yellow-700">Email:</label>
            <p className="font-medium">{order.customer.email}</p>
          </div>
          <div>
            <label className="text-sm text-yellow-700">Mã đơn hàng:</label>
            <p className="font-medium">{order.code}</p>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-3">
          🛒 Thông tin đơn hàng
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-blue-700">Sản phẩm:</label>
            <p className="font-medium">{order.productName}</p>
          </div>
          <div>
            <label className="text-sm text-blue-700">Số lượng:</label>
            <p className="font-medium">{order.quantity}</p>
          </div>
          <div>
            <label className="text-sm text-blue-700">Tổng tiền:</label>
            <p className="font-medium text-lg text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total)}
            </p>
          </div>
          <div>
            <label className="text-sm text-blue-700">Trạng thái:</label>
            <span
              className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800`}
            >
              {statusOptions.find((s) => s.value === order.status)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Generated Message */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">
            💬 Tin nhắn liên hệ khách hàng
          </h3>
          <button
            onClick={() => onCopyMessage(generatedMessage)}
            className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            <span>Copy tin nhắn</span>
          </button>
        </div>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
          {generatedMessage}
        </pre>
      </div>

      {/* Status Update */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-medium text-green-800 mb-3">
          ⚡ Cập nhật trạng thái
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-green-700 mb-2">
              Trạng thái mới:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-green-700 mb-2">
              Ghi chú (tùy chọn):
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ghi chú về thay đổi..."
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={onUpdateStatus}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Cập nhật trạng thái
          </button>
          {order.status === "waiting_payment" && (
            <button
              onClick={onConfirmOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xác nhận đã thanh toán
            </button>
          )}
          <button
            onClick={onTransfer}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Chuyển giao
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-medium text-purple-800 mb-3">📝 Ghi chú</h3>
        <div className="space-y-3">
          {order.notes?.map((note) => (
            <div
              key={note.id}
              className="bg-white p-3 rounded border border-purple-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-purple-700">
                  {note.user}
                </span>
                <span className="text-xs text-purple-600">
                  {new Date(note.timestamp).toLocaleString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>
          ))}

          <div className="flex space-x-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Thêm ghi chú..."
            />
            <button
              onClick={onAddNote}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline Tab Component
const TimelineTab = ({ order }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">📅 Lịch sử đơn hàng</h3>
      <div className="space-y-4">
        {order.timeline?.map((event, index) => (
          <div key={event.id} className="flex space-x-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              {index < order.timeline.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  {event.message}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-gray-600">Bởi: {event.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Attachments Tab Component
const AttachmentsTab = ({
  order,
  attachmentTypes,
  onFileUpload,
  onRemoveAttachment,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState("backgroundImages");

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFileUpload(files, activeUploadType);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    onFileUpload(files, activeUploadType);
    e.target.value = ""; // Reset input
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-800 mb-4">📎 Quản lý Files</h3>

        {/* Upload Type Selector */}
        <div className="flex space-x-2 mb-4">
          {attachmentTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setActiveUploadType(type.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeUploadType === type.key
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Kéo thả files vào đây hoặc{" "}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
              chọn files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Đang upload cho:{" "}
            {attachmentTypes.find((t) => t.key === activeUploadType)?.label}
          </p>
        </div>
      </div>

      {/* Files Display */}
      {attachmentTypes.map((type) => (
        <div key={type.key} className="space-y-3">
          <h4 className="flex items-center space-x-2 font-medium text-gray-700">
            <type.icon className="h-5 w-5" />
            <span>{type.label}</span>
            <span className="text-sm text-gray-500">
              ({order.attachments?.[type.key]?.length || 0})
            </span>
          </h4>

          {order.attachments?.[type.key]?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {order.attachments[type.key].map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => onRemoveAttachment(type.key, file.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p
                    className="text-xs text-gray-600 mt-1 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Chưa có {type.label.toLowerCase()} nào
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrderManagement;
