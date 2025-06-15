// src/pages/admin/ShippingManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShippingOrders,
  createShippingOrder,
  updateShippingStatus,
  setFilters,
  setSelectedOrder,
  clearError,
  selectShippingOrders,
  selectShippingLoading,
  selectShippingError,
  selectShippingFilters,
  selectShippingStatistics,
  selectShippingPagination,
  selectSelectedShippingOrder,
} from "../../redux/features/shippingSlice";
import {
  PlusIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  PhoneIcon,
  MapPinIcon,
  CubeIcon,
  ArrowPathIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

const ShippingManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const orders = useSelector(selectShippingOrders);
  const loading = useSelector(selectShippingLoading);
  const error = useSelector(selectShippingError);
  const filters = useSelector(selectShippingFilters);
  const statistics = useSelector(selectShippingStatistics);
  const pagination = useSelector(selectShippingPagination);
  const selectedOrder = useSelector(selectSelectedShippingOrder);

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.status);

  // Mock orders without shipping (for create modal)
  const [availableOrders] = useState([
    {
      id: "SO-202505",
      customerName: "Võ Văn Em",
      customerPhone: "0945678901",
      customerAddress: "202 Cách Mạng Tháng 8, Q10, TP.HCM",
      customerEmail: "vovanem@email.com",
      productInfo: "Jacket custom + Background vintage",
      value: 520000,
      weight: 0.9,
      dimensions: "40x35x10",
    },
    {
      id: "SO-202506",
      customerName: "Hoàng Thị Phương",
      customerPhone: "0956789012",
      customerAddress: "303 Nguyễn Đình Chiểu, Q1, TP.HCM",
      customerEmail: "hoangthiphuong@email.com",
      productInfo: "Dress custom design + Background floral",
      value: 680000,
      weight: 0.6,
      dimensions: "35x32x8",
    },
  ]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    dispatch(fetchShippingOrders(filters));
  }, [dispatch, filters]);

  // Update filters when search or status changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      dispatch(
        setFilters({ search: searchTerm, status: statusFilter, page: 1 })
      );
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, dispatch]);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchShippingOrders(filters));
  };

  // Handle create shipping order
  const handleCreateOrder = async (orderData) => {
    try {
      await dispatch(createShippingOrder(orderData)).unwrap();
      setShowCreateModal(false);
      // Refresh data
      dispatch(fetchShippingOrders(filters));
    } catch (error) {
      console.error("Error creating shipping order:", error);
    }
  };

  // Handle update shipping status
  const handleUpdateStatus = async (updateData) => {
    try {
      await dispatch(updateShippingStatus(updateData)).unwrap();
      setShowUpdateModal(false);
      // Refresh data
      dispatch(fetchShippingOrders(filters));
    } catch (error) {
      console.error("Error updating shipping status:", error);
    }
  };

  // Handle view order details
  const handleViewDetails = (order) => {
    dispatch(setSelectedOrder(order));
    setShowDetailModal(true);
  };

  // Handle update order status
  const handleUpdateOrder = (order) => {
    dispatch(setSelectedOrder(order));
    setShowUpdateModal(true);
  };

  // Clear error
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Status configuration
  const statusConfig = {
    pending: {
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      label: "Chờ xử lý",
    },
    picked_up: {
      icon: CubeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      label: "Đã nhận hàng",
    },
    in_transit: {
      icon: TruckIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      label: "Đang vận chuyển",
    },
    out_for_delivery: {
      icon: TruckIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      label: "Đang giao hàng",
    },
    delivered: {
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      label: "Đã giao hàng",
    },
    failed: {
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
      label: "Giao thất bại",
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý vận chuyển
          </h1>
          <p className="text-gray-600">
            Quản lý các đơn hàng vận chuyển qua Viettel Post
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-soligant-primary text-white rounded-md hover:bg-soligant-primary-dark"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tạo đơn vận chuyển
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={handleClearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalShipments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.pendingShipments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <TruckIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đang vận chuyển
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.inTransitShipments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã giao hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.deliveredShipments}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT, mã vận chuyển..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="picked_up">Đã nhận hàng</option>
              <option value="in_transit">Đang vận chuyển</option>
              <option value="out_for_delivery">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="failed">Giao thất bại</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Shipping Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soligant-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có đơn hàng vận chuyển nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã vận chuyển
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const StatusIcon =
                      statusConfig[order.status]?.icon || ClockIcon;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.viettelPostCode}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.orderId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customerPhone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-1 rounded-full ${
                                statusConfig[order.status]?.bgColor
                              }`}
                            >
                              <StatusIcon
                                className={`h-4 w-4 ${
                                  statusConfig[order.status]?.color
                                }`}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                statusConfig[order.status]?.color
                              }`}
                            >
                              {statusConfig[order.status]?.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.value)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Phí ship: {formatCurrency(order.shippingFee)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-2 text-gray-600 hover:text-gray-800"
                              title="Xem chi tiết"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(order.viettelPostCode)
                              }
                              className="p-2 text-gray-600 hover:text-gray-800"
                              title="Copy mã vận chuyển"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order)}
                              className="p-2 text-soligant-primary hover:text-soligant-primary-dark"
                              title="Cập nhật trạng thái"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {(pagination.currentPage - 1) * filters.limit + 1}{" "}
                    -{" "}
                    {Math.min(
                      pagination.currentPage * filters.limit,
                      pagination.totalOrders
                    )}{" "}
                    của {pagination.totalOrders} kết quả
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Simple Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Tạo đơn vận chuyển</h3>
            <p className="text-gray-600 mb-4">
              Chọn đơn hàng để tạo vận chuyển Viettel Post.
            </p>
            <div className="mb-4">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">-- Chọn đơn hàng --</option>
                {availableOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} - {order.customerName} -{" "}
                    {formatCurrency(order.value)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Demo: Tạo đơn mẫu
                  handleCreateOrder(availableOrders[0]);
                }}
                className="px-4 py-2 bg-soligant-primary text-white rounded-md"
              >
                Tạo đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chi tiết vận chuyển</h3>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Mã Viettel Post:</strong>{" "}
                  {selectedOrder.viettelPostCode}
                </p>
                <p>
                  <strong>Mã đơn hàng:</strong> {selectedOrder.orderId}
                </p>
              </div>
              <div>
                <p>
                  <strong>Khách hàng:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedOrder.customerPhone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {selectedOrder.customerAddress}
                </p>
              </div>
              <div>
                <p>
                  <strong>Sản phẩm:</strong> {selectedOrder.productInfo}
                </p>
                <p>
                  <strong>Giá trị:</strong>{" "}
                  {formatCurrency(selectedOrder.value)}
                </p>
                <p>
                  <strong>Phí ship:</strong>{" "}
                  {formatCurrency(selectedOrder.shippingFee)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {statusConfig[selectedOrder.status]?.label}
                </p>
                <p>
                  <strong>Vị trí:</strong> {selectedOrder.currentLocation}
                </p>
              </div>
              {selectedOrder.trackingHistory && (
                <div>
                  <p className="font-semibold mb-2">Lịch sử vận chuyển:</p>
                  <div className="space-y-2">
                    {selectedOrder.trackingHistory.map((event, index) => (
                      <div
                        key={index}
                        className="text-sm border-l-2 border-gray-200 pl-4"
                      >
                        <p className="font-medium">{event.description}</p>
                        <p className="text-gray-600">{event.location}</p>
                        <p className="text-gray-500">
                          {formatDateTime(event.time)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="mt-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h3>
            <p className="text-gray-600 mb-4">
              {selectedOrder.viettelPostCode} - {selectedOrder.customerName}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="pending">Chờ xử lý</option>
                  <option value="picked_up">Đã nhận hàng</option>
                  <option value="in_transit">Đang vận chuyển</option>
                  <option value="out_for_delivery">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="failed">Giao thất bại</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí hiện tại
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập vị trí hiện tại..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Mô tả chi tiết..."
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Demo: Cập nhật trạng thái
                  setShowUpdateModal(false);
                }}
                className="px-4 py-2 bg-soligant-primary text-white rounded-md"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingManagement;
