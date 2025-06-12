// src/pages/OrderTracking.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderFound, setOrderFound] = useState(true);
  // Mock data cho order tracking
  const orderData = {
    id: "ORD-2024-001",
    status: "shipped",
    customerName: "Nguyễn Văn A",
    customerEmail: "customer@email.com",
    customerPhone: "0123456789",
    orderDate: "2024-01-10T10:30:00",
    estimatedDelivery: "2024-01-15T18:00:00",
    trackingNumber: "VN123456789",
    shippingMethod: "Giao hàng nhanh",
    total: 850000,
    items: [
      {
        id: 1,
        name: "Bộ LEGO tùy chỉnh - Tượng Nữ thần Tự do",
        quantity: 1,
        price: 750000,
        customizations: [
          'Đế tùy chỉnh với khắc chữ "Chúc mừng sinh nhật"',
          "Hoàn thiện vàng kim loại",
          "Đóng gói tùy chỉnh",
        ],
        image: "/api/placeholder/200/200",
      },
      {
        id: 2,
        name: "Hộp quà tùy chỉnh",
        quantity: 1,
        price: 100000,
        customizations: ["Nội thất nhung đỏ cao cấp", "Logo dập nổi tùy chỉnh"],
        image: "/api/placeholder/200/200",
      },
    ],
    shippingAddress: {
      name: "Nguyễn Văn A",
      address: "123 Đường Nguyễn Huệ",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "Thành phố Hồ Chí Minh",
      phone: "0123456789",
    },
    timeline: [
      {
        status: "pending",
        title: "Đơn hàng được đặt",
        description: "Đơn hàng đã được tiếp nhận và đang chuẩn bị",
        timestamp: "2024-01-10T10:30:00",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Xác nhận đơn hàng",
        description: "Thanh toán đã được xác nhận và bắt đầu tùy chỉnh",
        timestamp: "2024-01-10T14:00:00",
        completed: true,
      },
      {
        status: "processing",
        title: "Đang sản xuất",
        description: "Bộ LEGO tùy chỉnh của bạn đang được lắp ráp",
        timestamp: "2024-01-11T09:00:00",
        completed: true,
      },
      {
        status: "quality_check",
        title: "Kiểm tra chất lượng",
        description: "Kiểm tra chất lượng cuối cùng và đóng gói",
        timestamp: "2024-01-12T16:00:00",
        completed: true,
      },
      {
        status: "shipped",
        title: "Đã giao cho vận chuyển",
        description: "Gói hàng đã được chuyển cho đơn vị vận chuyển",
        timestamp: "2024-01-13T08:30:00",
        completed: true,
        trackingNumber: "VN123456789",
      },
      {
        status: "out_for_delivery",
        title: "Đang giao hàng",
        description: "Gói hàng đang trên đường đến địa chỉ của bạn",
        timestamp: null,
        completed: false,
      },
      {
        status: "delivered",
        title: "Đã giao hàng",
        description: "Gói hàng đã được giao thành công",
        timestamp: null,
        completed: false,
      },
    ],
  };

  const getStatusColor = (status, completed) => {
    if (completed) return "text-green-600 bg-green-100";
    if (status === orderData.status) return "text-blue-600 bg-blue-100";
    return "text-gray-400 bg-gray-100";
  };

  const getStatusIcon = (status, completed) => {
    if (completed) return CheckCircleIcon;
    if (status === orderData.status) return ClockIcon;
    return ClockIcon;
  };
  if (!orderFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi không thể tìm thấy đơn hàng với mã:{" "}
            <span className="font-mono">{orderId}</span>
          </p>
          <Link
            to="/order-search"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Tìm kiếm lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/order-search"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Về trang tìm kiếm
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Theo dõi đơn hàng
              </h1>
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-mono">{orderData.id}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">Dự kiến giao hàng</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(orderData.estimatedDelivery).toLocaleDateString(
                  "vi-VN",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {" "}
            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tiến trình đơn hàng
              </h2>
              <div className="space-y-6">
                {orderData.timeline.map((step, index) => {
                  const StatusIcon = getStatusIcon(step.status, step.completed);
                  const isActive = step.status === orderData.status;

                  return (
                    <div key={index} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                          step.status,
                          step.completed
                        )}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-lg font-medium ${
                              step.completed
                                ? "text-gray-900"
                                : isActive
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {step.timestamp && (
                            <span className="text-sm text-gray-500">
                              {new Date(step.timestamp).toLocaleString("vi-VN")}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            step.completed
                              ? "text-gray-600"
                              : isActive
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </p>{" "}
                        {step.trackingNumber && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <TruckIcon className="h-3 w-3 mr-1" />
                              Mã vận đơn: {step.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>{" "}
            </div>
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Sản phẩm trong đơn hàng
              </h2>

              <div className="space-y-6">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>{" "}
                      <p className="text-sm text-gray-600 mt-1">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {item.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                      {item.customizations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Tùy chỉnh:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.customizations.map((customization, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                {customization}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {" "}
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngày đặt hàng:</span>
                  <span className="font-medium">
                    {new Date(orderData.orderDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phương thức giao hàng:</span>
                  <span className="font-medium">
                    {orderData.shippingMethod}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số sản phẩm:</span>
                  <span className="font-medium">{orderData.items.length}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {orderData.total.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Địa chỉ giao hàng
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {orderData.shippingAddress.name}
                </p>
                <p>{orderData.shippingAddress.address}</p>
                <p>{orderData.shippingAddress.ward}</p>
                <p>{orderData.shippingAddress.district}</p>
                <p>{orderData.shippingAddress.city}</p>
                <p className="mt-2">
                  <span className="font-medium">Điện thoại:</span>{" "}
                  {orderData.shippingAddress.phone}
                </p>
              </div>
            </div>{" "}
            {/* Contact Support */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Cần hỗ trợ?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Có thắc mắc về đơn hàng của bạn? Đội ngũ hỗ trợ của chúng tôi
                luôn sẵn sàng giúp đỡ.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-blue-700">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  <span>Email: support@soligant.com</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Thứ 2-6: 9h-18h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
