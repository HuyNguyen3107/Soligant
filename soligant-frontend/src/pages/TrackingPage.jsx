// src/pages/TrackingPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  trackShippingPublic,
  clearTrackingResult,
  selectTrackingResult,
  selectTrackingLoading,
  selectTrackingError,
} from "../redux/features/shippingSlice";
import {
  MagnifyingGlassIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const TrackingPage = () => {
  const dispatch = useDispatch();

  // Redux state
  const trackingResult = useSelector(selectTrackingResult);
  const loading = useSelector(selectTrackingLoading);
  const error = useSelector(selectTrackingError);

  // Local state
  const [trackingCode, setTrackingCode] = useState("");

  // Handle search tracking
  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      return;
    }

    try {
      await dispatch(trackShippingPublic(trackingCode.trim())).unwrap();
    } catch (err) {
      console.error("Error tracking shipping:", err);
    }
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear results
  const handleClearResults = () => {
    dispatch(clearTrackingResult());
    setTrackingCode("");
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusConfig = {
      created: {
        label: "Đã tạo đơn",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: CubeIcon,
      },
      picked_up: {
        label: "Đã nhận hàng",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircleIcon,
      },
      in_transit: {
        label: "Đang vận chuyển",
        color: "text-purple-600",
        bg: "bg-purple-100",
        icon: TruckIcon,
      },
      out_for_delivery: {
        label: "Đang giao hàng",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        icon: TruckIcon,
      },
      delivered: {
        label: "Đã giao hàng",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircleIcon,
      },
      failed: {
        label: "Giao không thành công",
        color: "text-red-600",
        bg: "bg-red-100",
        icon: XCircleIcon,
      },
    };
    return statusConfig[status] || statusConfig.created;
  };

  const getMainStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        label: "Chờ nhận hàng",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: ClockIcon,
      },
      picked_up: {
        label: "Đã nhận hàng",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: CubeIcon,
      },
      in_transit: {
        label: "Đang vận chuyển",
        color: "text-purple-600",
        bg: "bg-purple-100",
        icon: TruckIcon,
      },
      out_for_delivery: {
        label: "Đang giao hàng",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        icon: TruckIcon,
      },
      delivered: {
        label: "Đã giao hàng",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircleIcon,
      },
      failed: {
        label: "Giao không thành công",
        color: "text-red-600",
        bg: "bg-red-100",
        icon: XCircleIcon,
      },
    };

    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tra cứu vận chuyển
          </h1>
          <p className="text-gray-600">
            Nhập mã vận đơn Viettel Post để kiểm tra trạng thái giao hàng
          </p>
        </div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập mã vận đơn (VD: VP2025061401)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tìm...
                </div>
              ) : (
                "Tra cứu"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </motion.div>

        {/* Sample Tracking Codes */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">Mã vận đơn mẫu để test:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(mockTrackingData).map((code) => (
              <button
                key={code}
                onClick={() => setTrackingCode(code)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin đơn hàng
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Mã vận đơn:</span>
                  <span className="font-medium text-blue-600">
                    {trackingResult.viettelPostCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        trackingResult.viettelPostCode
                      );
                      alert("Đã copy mã vận đơn!");
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Người nhận:</span>
                      <span className="font-medium">
                        {trackingResult.customerName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-600 w-23">Điện thoại:</span>
                      <span className="font-medium">
                        {trackingResult.customerPhone}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mr-1 mt-0.5" />
                      <span className="text-gray-600 w-23">Địa chỉ:</span>
                      <span className="font-medium">
                        {trackingResult.customerAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Thông tin hàng hóa
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-gray-600 w-20">Sản phẩm:</span>
                      <span className="font-medium">
                        {trackingResult.productInfo}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Khối lượng:</span>
                      <span className="font-medium">
                        {trackingResult.weight} kg
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Kích thước:</span>
                      <span className="font-medium">
                        {trackingResult.dimensions} cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Trạng thái hiện tại
              </h2>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                {(() => {
                  const statusInfo = getMainStatusInfo(trackingResult.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <>
                      <div className={`p-3 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {trackingResult.currentLocation}
                        </p>
                        {trackingResult.expectedDelivery && (
                          <p className="text-sm text-gray-500 mt-1">
                            Dự kiến giao:{" "}
                            {new Date(
                              trackingResult.expectedDelivery
                            ).toLocaleString("vi-VN")}
                          </p>
                        )}
                        {trackingResult.actualDelivery && (
                          <p className="text-sm text-green-600 mt-1">
                            Đã giao:{" "}
                            {new Date(
                              trackingResult.actualDelivery
                            ).toLocaleString("vi-VN")}
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Tracking History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Lịch sử vận chuyển
              </h2>

              <div className="space-y-4">
                {trackingResult.trackingHistory.map((track, index) => {
                  const statusInfo = getStatusInfo(track.status);
                  const isLast =
                    index === trackingResult.trackingHistory.length - 1;

                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg} border-2 border-white shadow`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${statusInfo.color.replace(
                              "text-",
                              "bg-"
                            )}`}
                          ></div>
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(track.time).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {track.location}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {track.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Cần hỗ trợ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800">
                    <strong>Hotline Soligant:</strong> 1900-xxxx
                  </p>
                  <p className="text-blue-700">Email: support@soligant.com</p>
                </div>
                <div>
                  <p className="text-blue-800">
                    <strong>Hotline Viettel Post:</strong> 1900-545-411
                  </p>
                  <p className="text-blue-700">Website: viettelpost.com.vn</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
