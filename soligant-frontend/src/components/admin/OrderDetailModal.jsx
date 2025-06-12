import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetailModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [note, setNote] = useState("");

  if (!order) return null;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
    setUploadFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    const colors = {
      waiting: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipping: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      waiting: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return texts[status] || "Không xác định";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Chi tiết đơn hàng {order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Được tạo:{" "}
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: "details", name: "Thông tin đơn hàng" },
                      { id: "files", name: "Tệp đính kèm" },
                      { id: "workflow", name: "Quy trình xử lý" },
                      { id: "history", name: "Lịch sử thay đổi" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? "border-soligant-primary text-soligant-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Thông tin khách hàng
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Tên khách hàng:</span>
                          <span className="ml-2 font-medium">
                            {order.customerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Số điện thoại:</span>
                          <span className="ml-2 font-medium">
                            {order.phone || "0123456789"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">
                            {order.email || "customer@example.com"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Địa chỉ giao hàng:
                          </span>
                          <span className="ml-2 font-medium">
                            123 Đường ABC, Quận 1, TP.HCM
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Thông tin đơn hàng
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Mã đơn hàng:</span>
                          <span className="ml-2 font-medium">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tổng giá trị:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {new Intl.NumberFormat("vi-VN").format(order.total)}{" "}
                            VNĐ
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Phương thức thanh toán:
                          </span>
                          <span className="ml-2 font-medium">Chuyển khoản</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ghi chú:</span>
                          <span className="ml-2">Giao hàng vào buổi chiều</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "files" && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tải lên tệp đính kèm
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Nhấp để tải lên
                              </span>{" "}
                              hoặc kéo thả tệp
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, PDF (MAX. 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept=".png,.jpg,.jpeg,.pdf"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>

                    {uploadFiles.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Tệp đã tải lên ({uploadFiles.length})
                        </h4>
                        <div className="space-y-2">
                          {uploadFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)} •{" "}
                                    {file.uploadedAt.toLocaleTimeString(
                                      "vi-VN"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "workflow" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Quy trình xử lý đơn hàng
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          status: "waiting",
                          title: "Chờ xác nhận",
                          description:
                            "Đơn hàng vừa được tạo, cần xác nhận từ admin",
                        },
                        {
                          status: "confirmed",
                          title: "Đã xác nhận",
                          description: "Admin đã xác nhận đơn hàng",
                        },
                        {
                          status: "processing",
                          title: "Đang xử lý",
                          description: "Đang chuẩn bị sản phẩm và đóng gói",
                        },
                        {
                          status: "shipping",
                          title: "Đang giao hàng",
                          description:
                            "Đơn hàng đã được giao cho đơn vị vận chuyển",
                        },
                        {
                          status: "completed",
                          title: "Hoàn thành",
                          description: "Khách hàng đã nhận được hàng",
                        },
                      ].map((step, index) => (
                        <div
                          key={step.status}
                          className="flex items-start space-x-3"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              order.status === step.status
                                ? "bg-soligant-primary text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5
                              className={`text-sm font-medium ${
                                order.status === step.status
                                  ? "text-soligant-primary"
                                  : "text-gray-900"
                              }`}
                            >
                              {step.title}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Lịch sử thay đổi
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          time: "10:30 06/06/2025",
                          action: "Đơn hàng được tạo",
                          user: "Khách hàng",
                        },
                        {
                          time: "14:20 06/06/2025",
                          action: 'Chuyển sang trạng thái "Đã xác nhận"',
                          user: "Admin",
                        },
                        {
                          time: "16:45 06/06/2025",
                          action: "Tải lên file thiết kế",
                          user: "Admin",
                        },
                        {
                          time: "09:15 07/06/2025",
                          action: 'Chuyển sang trạng thái "Đang xử lý"',
                          user: "Admin",
                        },
                      ].map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {entry.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {entry.time} • bởi {entry.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="waiting">Chờ xác nhận</option>
                      <option value="confirmed">Xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipping">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Hủy</option>
                    </select>
                    <button className="px-4 py-2 bg-soligant-primary text-white rounded-md text-sm hover:bg-soligant-primary-dark">
                      Cập nhật trạng thái
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Đóng
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                      In đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailModal;
