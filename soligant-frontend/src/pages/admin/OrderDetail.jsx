import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
// import Sidebar from "../../components/admin/Sidebar";
import { showSuccess, showError, showInfo } from "../../utils/toast";

// Mock data for a specific order
const mockOrderData = {
  id: "SO-202501",
  date: "2025-06-01T10:30:00",
  status: "waiting",
  isUrgent: true,
  totalPrice: 295000,
  customer: {
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerFacebook: "https://facebook.com/nguyenvana",
    customerInstagram: "https://instagram.com/nguyenvana",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  },
  customization: {
    version: {
      selected: {
        name: "Version 1",
        price: 245000,
        description: "Khung tranh có 01 LEGO-nhân",
      },
    },
    additionalAccessories: [
      {
        id: "flower_red",
        name: "Hoa Hồng",
        price: 50000,
        description: "Phụ kiện hoa hồng trang trí",
      },
    ],
    characters: {
      character1: {
        topColor: { name: "Xanh dương", colorCode: "#1E90FF" },
        bottomColor: { name: "Đen", colorCode: "#000000" },
        hair: { name: "Tóc Nam - Ngắn", price: 25000 },
        face: { name: "Mặt cười", price: 0 },
      },
    },
    background: {
      color: "#FFFFFF",
      text: "Happy Birthday",
      date: "01/01/2000",
      song: "Happy Birthday Song",
    },
  },
  shipping: {
    status: "pending",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    method: "COD",
    trackingNumber: "",
    estimatedDelivery: "",
    notes: "Giao buổi sáng",
  },
  notes: "Khách hàng yêu cầu giao gấp",
  logs: [
    {
      date: "2025-06-01T10:30:00",
      status: "created",
      description: "Đơn hàng được tạo",
      user: "Customer",
    },
    {
      date: "2025-06-01T10:35:00",
      status: "waiting",
      description: "Đang chờ xác nhận",
      user: "System",
    },
  ],
};

// Format status to Vietnamese
const formatStatus = (status) => {
  const statusMap = {
    waiting: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    processing: { text: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
    shipping: { text: "Đang giao", color: "bg-orange-100 text-orange-800" },
    completed: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },
    cancelled: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
  };

  return (
    statusMap[status] || {
      text: "Không xác định",
      color: "bg-gray-100 text-gray-800",
    }
  );
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);

  // Auth check
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      window.location.href = "/admin/login";
    }
  }, []);

  // Load order data
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In real app, fetch order by ID
        // const response = await fetchOrderById(orderId);
        // const orderData = response.data;

        // Use mock data for now
        const orderData = { ...mockOrderData, id: orderId };
        setOrder(orderData);
        setEditedOrder(JSON.parse(JSON.stringify(orderData))); // Deep copy for editing
        setLoading(false);
      } catch (error) {
        console.error("Error loading order:", error);
        setLoading(false);
        showError("Không thể tải thông tin đơn hàng");
      }
    };

    loadOrderData();
  }, [orderId]);

  const handleEditChange = (section, field, value) => {
    if (section === "root") {
      setEditedOrder((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setEditedOrder((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update order logs
      const now = new Date().toISOString();
      const newLog = {
        date: now,
        status: "updated",
        description: `Đơn hàng được cập nhật bởi admin`,
        user: "Admin",
      };

      editedOrder.logs = [...(editedOrder.logs || []), newLog];

      setOrder(editedOrder);
      setEditMode(false);
      showSuccess("Cập nhật đơn hàng thành công");
    } catch (error) {
      console.error("Error updating order:", error);
      showError("Có lỗi khi cập nhật đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update order status and logs
      const now = new Date().toISOString();
      const newLog = {
        date: now,
        status: newStatus,
        description: `Trạng thái đơn hàng đã được thay đổi thành "${
          formatStatus(newStatus).text
        }"`,
        user: "Admin",
      };

      const updatedOrder = {
        ...order,
        status: newStatus,
        logs: [...(order.logs || []), newLog],
      };

      setOrder(updatedOrder);
      setEditedOrder(updatedOrder);
      showSuccess("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      console.error("Error updating order status:", error);
      showError("Có lỗi khi cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      // <div className="flex h-screen bg-gray-100">
      //   <Sidebar />
      //   <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-soligant-primary mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-soligant-primary">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
      //   </div>
      // </div>
    );
  }

  if (!order) {
    return (
      // <div className="flex h-screen bg-gray-100">
      //   <Sidebar />
      //   <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy đơn hàng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Không thể tìm thấy đơn hàng với mã {orderId}.
          </p>
          <div className="mt-6">
            <Link
              to="/admin/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-soligant-primary hover:bg-soligant-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
      //   </div>
      // </div>
    );
  }

  const statusInfo = formatStatus(order.status);

  return (
    <>
      {/* <Sidebar /> */}

      <div className="overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 font-utm-avo">
                  Chi tiết đơn hàng: {order.id}
                </h1>
                {order.isUrgent && (
                  <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ⚡ Gấp
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Ngày tạo: {new Date(order.date).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/orders"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Quay lại
              </Link>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-soligant-primary hover:bg-soligant-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => {
                      setEditedOrder(JSON.parse(JSON.stringify(order)));
                      setEditMode(false);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 bg-white shadow rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    Cập nhật cuối:{" "}
                    {new Date(order.date).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Thay đổi trạng thái:
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="block w-40 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm rounded-md"
                  >
                    <option value="waiting">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Thông tin khách hàng
                </h3>
              </div>
              <div className="px-6 py-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        value={editedOrder.customer.customerName}
                        onChange={(e) =>
                          handleEditChange(
                            "customer",
                            "customerName",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={editedOrder.customer.customerPhone}
                        onChange={(e) =>
                          handleEditChange(
                            "customer",
                            "customerPhone",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={editedOrder.customer.customerFacebook}
                        onChange={(e) =>
                          handleEditChange(
                            "customer",
                            "customerFacebook",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={editedOrder.customer.customerInstagram}
                        onChange={(e) =>
                          handleEditChange(
                            "customer",
                            "customerInstagram",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium">Tên:</span>{" "}
                      {order.customer.customerName}
                    </p>
                    <p>
                      <span className="font-medium">SĐT:</span>{" "}
                      {order.customer.customerPhone}
                    </p>
                    {order.customer.customerFacebook && (
                      <p>
                        <span className="font-medium">Facebook:</span>{" "}
                        <a
                          href={order.customer.customerFacebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {order.customer.customerFacebook}
                        </a>
                      </p>
                    )}
                    {order.customer.customerInstagram && (
                      <p>
                        <span className="font-medium">Instagram:</span>{" "}
                        <a
                          href={order.customer.customerInstagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800"
                        >
                          {order.customer.customerInstagram}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href={`tel:${order.customer.customerPhone}`}
                      className="font-medium text-soligant-primary hover:text-soligant-primary-dark"
                    >
                      Gọi điện
                    </a>
                  </div>
                  <div className="text-sm">
                    <a
                      href={`sms:${order.customer.customerPhone}`}
                      className="font-medium text-soligant-primary hover:text-soligant-primary-dark"
                    >
                      Nhắn tin
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết sản phẩm
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {/* Version */}
                  {order.customization.version?.selected && (
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Phiên bản
                      </h4>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="font-medium">
                          {order.customization.version.selected.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customization.version.selected.description}
                        </p>
                        <p className="text-sm font-medium text-soligant-primary mt-1">
                          {new Intl.NumberFormat("vi-VN").format(
                            order.customization.version.selected.price
                          )}{" "}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Characters */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Tùy chỉnh nhân vật
                    </h4>

                    {/* Character 1 */}
                    <div className="mb-3">
                      <div className="bg-blue-50 rounded p-3">
                        <p className="font-medium">Nhân vật 1</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Màu áo</p>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-4 h-4 rounded mr-1"
                                style={{
                                  backgroundColor:
                                    order.customization.characters.character1
                                      .topColor?.colorCode,
                                }}
                              ></div>
                              <p className="text-sm">
                                {
                                  order.customization.characters.character1
                                    .topColor?.name
                                }
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Màu quần</p>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-4 h-4 rounded mr-1"
                                style={{
                                  backgroundColor:
                                    order.customization.characters.character1
                                      .bottomColor?.colorCode,
                                }}
                              ></div>
                              <p className="text-sm">
                                {
                                  order.customization.characters.character1
                                    .bottomColor?.name
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Tóc</p>
                            <p className="text-sm">
                              {
                                order.customization.characters.character1.hair
                                  ?.name
                              }
                              {order.customization.characters.character1.hair
                                ?.price > 0 && (
                                <span className="text-xs text-soligant-primary ml-1">
                                  (+
                                  {new Intl.NumberFormat("vi-VN").format(
                                    order.customization.characters.character1
                                      .hair.price
                                  )}{" "}
                                  VNĐ)
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Mặt</p>
                            <p className="text-sm">
                              {
                                order.customization.characters.character1.face
                                  ?.name
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Character 2 (if version 2) */}
                    {order.customization.characters.character2 && (
                      <div>
                        <div className="bg-purple-50 rounded p-3">
                          <p className="font-medium">Nhân vật 2</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Màu áo</p>
                              <div className="flex items-center mt-1">
                                <div
                                  className="w-4 h-4 rounded mr-1"
                                  style={{
                                    backgroundColor:
                                      order.customization.characters.character2
                                        .topColor?.colorCode,
                                  }}
                                ></div>
                                <p className="text-sm">
                                  {
                                    order.customization.characters.character2
                                      .topColor?.name
                                  }
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Màu quần</p>
                              <div className="flex items-center mt-1">
                                <div
                                  className="w-4 h-4 rounded mr-1"
                                  style={{
                                    backgroundColor:
                                      order.customization.characters.character2
                                        .bottomColor?.colorCode,
                                  }}
                                ></div>
                                <p className="text-sm">
                                  {
                                    order.customization.characters.character2
                                      .bottomColor?.name
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Tóc</p>
                              <p className="text-sm">
                                {
                                  order.customization.characters.character2.hair
                                    ?.name
                                }
                                {order.customization.characters.character2.hair
                                  ?.price > 0 && (
                                  <span className="text-xs text-soligant-primary ml-1">
                                    (+
                                    {new Intl.NumberFormat("vi-VN").format(
                                      order.customization.characters.character2
                                        .hair.price
                                    )}{" "}
                                    VNĐ)
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Mặt</p>
                              <p className="text-sm">
                                {
                                  order.customization.characters.character2.face
                                    ?.name
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Accessories */}
                  {order.customization.additionalAccessories?.length > 0 && (
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Phụ kiện thêm
                      </h4>
                      <div className="space-y-2">
                        {order.customization.additionalAccessories.map(
                          (acc) => (
                            <div
                              key={acc.id}
                              className="bg-green-50 rounded p-3"
                            >
                              <p className="font-medium">{acc.name}</p>
                              {acc.description && (
                                <p className="text-sm text-gray-500">
                                  {acc.description}
                                </p>
                              )}
                              <p className="text-sm font-medium text-green-700 mt-1">
                                {new Intl.NumberFormat("vi-VN").format(
                                  acc.price
                                )}{" "}
                                VNĐ
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Background */}
                  {order.customization.background && (
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Nền tranh
                      </h4>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Màu nền</p>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-4 h-4 rounded mr-1 border border-gray-300"
                                style={{
                                  backgroundColor:
                                    order.customization.background.color,
                                }}
                              ></div>
                              <p className="text-sm">
                                {order.customization.background.color}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Text</p>
                            <p className="text-sm">
                              {order.customization.background.text}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Ngày</p>
                            <p className="text-sm">
                              {order.customization.background.date}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bài hát</p>
                            <p className="text-sm">
                              {order.customization.background.song}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Tổng tiền
                    </h4>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tổng cộng:</span>
                        <span className="text-xl font-bold text-soligant-primary">
                          {new Intl.NumberFormat("vi-VN").format(
                            order.totalPrice
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Thông tin giao hàng
                </h3>
              </div>
              <div className="px-6 py-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        value={editedOrder.shipping.address}
                        onChange={(e) =>
                          handleEditChange(
                            "shipping",
                            "address",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phương thức
                      </label>
                      <select
                        value={editedOrder.shipping.method}
                        onChange={(e) =>
                          handleEditChange("shipping", "method", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      >
                        <option value="COD">
                          Thanh toán khi nhận hàng (COD)
                        </option>
                        <option value="PREPAID">Đã thanh toán trước</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mã vận đơn
                      </label>
                      <input
                        type="text"
                        value={editedOrder.shipping.trackingNumber}
                        onChange={(e) =>
                          handleEditChange(
                            "shipping",
                            "trackingNumber",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ghi chú
                      </label>
                      <textarea
                        value={editedOrder.shipping.notes}
                        onChange={(e) =>
                          handleEditChange("shipping", "notes", e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Địa chỉ
                      </p>
                      <p>{order.shipping.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Phương thức thanh toán
                      </p>
                      <p>
                        {order.shipping.method === "COD"
                          ? "Thanh toán khi nhận hàng (COD)"
                          : "Đã thanh toán trước"}
                      </p>
                    </div>
                    {order.shipping.trackingNumber && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Mã vận đơn
                        </p>
                        <p>{order.shipping.trackingNumber}</p>
                      </div>
                    )}
                    {order.shipping.estimatedDelivery && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Dự kiến giao hàng
                        </p>
                        <p>
                          {new Date(
                            order.shipping.estimatedDelivery
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    )}
                    {order.shipping.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Ghi chú
                        </p>
                        <p>{order.shipping.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notes & Order Logs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white shadow rounded-lg overflow-hidden lg:col-span-3"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ghi chú và lịch sử đơn hàng
                  </h3>
                </div>
              </div>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                  {editMode ? (
                    <textarea
                      value={editedOrder.notes}
                      onChange={(e) =>
                        handleEditChange("root", "notes", e.target.value)
                      }
                      rows={5}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-soligant-primary focus:border-soligant-primary sm:text-sm"
                      placeholder="Nhập ghi chú cho đơn hàng..."
                    ></textarea>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded min-h-[100px]">
                      {order.notes || "Không có ghi chú"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Lịch sử đơn hàng
                  </h4>
                  <div className="bg-gray-50 p-4 rounded max-h-[200px] overflow-y-auto">
                    <ul className="space-y-3">
                      {order.logs && order.logs.length > 0 ? (
                        order.logs.map((log, index) => (
                          <li key={index} className="relative pb-3">
                            {index < order.logs.length - 1 && (
                              <div className="absolute left-2.5 top-5 -bottom-3 w-0.5 bg-gray-200"></div>
                            )}
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 rounded-full bg-soligant-primary"></div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-900 font-medium">
                                  {log.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(log.date).toLocaleString("vi-VN")} -{" "}
                                  {log.user}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>Không có lịch sử</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrderDetail;
