import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

// Mock data for dashboard
const mockOrdersData = [
  {
    id: "SO-202501",
    customerName: "Nguyễn Văn A",
    date: "2025-06-01",
    total: 295000,
    status: "waiting",
  },
  {
    id: "SO-202502",
    customerName: "Trần Thị B",
    date: "2025-06-05",
    total: 325000,
    status: "confirmed",
  },
  {
    id: "SO-202503",
    customerName: "Lê Văn C",
    date: "2025-06-08",
    total: 450000,
    status: "processing",
  },
  {
    id: "SO-202504",
    customerName: "Phạm Thị D",
    date: "2025-06-10",
    total: 275000,
    status: "shipping",
  },
  {
    id: "SO-202505",
    customerName: "Hoàng Văn E",
    date: "2025-06-10",
    total: 500000,
    status: "completed",
  },
];

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

const AdminDashboard = () => {
  // Auth check
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      window.location.href = "/admin/login";
    }
  }, []);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    newOrders: 0,
    totalRevenue: 0,
    pendingShipments: 0,
    recentOrders: [],
  });

  // Load dashboard data
  useEffect(() => {
    // In a real app, this would be an API call
    const loadDashboardData = async () => {
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Process mock data
        const totalOrders = mockOrdersData.length;
        const newOrders = mockOrdersData.filter(
          (order) => order.status === "waiting"
        ).length;
        const totalRevenue = mockOrdersData.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const pendingShipments = mockOrdersData.filter(
          (order) =>
            order.status === "confirmed" || order.status === "processing"
        ).length;

        setDashboardData({
          totalOrders,
          newOrders,
          totalRevenue,
          pendingShipments,
          recentOrders: mockOrdersData,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-900 font-utm-avo">
              Dashboard
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Tổng đơn hàng</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {dashboardData.totalOrders}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-sm mt-3">
                <span className="text-green-500 mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </span>
                <span className="text-green-500">10% tăng</span>
                <span className="text-gray-400 ml-1">so với tuần trước</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Đơn hàng mới</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {dashboardData.newOrders}
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-sm mt-3">
                <Link
                  to="/admin/orders?status=waiting"
                  className="text-blue-500 hover:underline"
                >
                  Xem tất cả đơn hàng mới
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Doanh thu</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {new Intl.NumberFormat("vi-VN").format(
                      dashboardData.totalRevenue
                    )}{" "}
                    VNĐ
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-sm mt-3">
                <span className="text-green-500 mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </span>
                <span className="text-green-500">8.2%</span>
                <span className="text-gray-400 ml-1">so với tháng trước</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Chờ giao hàng</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {dashboardData.pendingShipments}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-sm mt-3">
                <Link
                  to="/admin/orders?status=confirmed"
                  className="text-blue-500 hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Đơn hàng gần đây
                </h3>
                <Link
                  to="/admin/orders"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Xem tất cả đơn hàng
                </Link>
              </div>
            </div>
            <div className="bg-white overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order) => {
                    const statusInfo = formatStatus(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat("vi-VN").format(order.total)}{" "}
                          VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6 bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thao tác nhanh
            </h3>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/products/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-soligant-primary hover:text-white transition duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm sản phẩm mới
              </Link>

              <Link
                to="/admin/reports"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-soligant-primary hover:text-white transition duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Xem báo cáo
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
