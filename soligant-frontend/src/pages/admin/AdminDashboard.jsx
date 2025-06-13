import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
// import Sidebar from "../../components/admin/Sidebar"; // Removed redundant Sidebar import
import NotificationSystem from "../../components/admin/NotificationSystem";
import AdminHeader from "../../components/admin/AdminHeader";
import useRealtimeNotifications from "../../hooks/useRealtimeNotifications";

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

// Mock sales data for charts
const salesData = [
  { day: "T2", sales: 4000000, orders: 12 },
  { day: "T3", sales: 3000000, orders: 8 },
  { day: "T4", sales: 5000000, orders: 15 },
  { day: "T5", sales: 4500000, orders: 13 },
  { day: "T6", sales: 6000000, orders: 18 },
  { day: "T7", sales: 5500000, orders: 16 },
  { day: "CN", sales: 3500000, orders: 10 },
];

// Mock order status distribution
const orderStatusData = [
  { name: "Chờ xác nhận", value: 15, color: "#FEF3C7" },
  { name: "Đã xác nhận", value: 25, color: "#DBEAFE" },
  { name: "Đang xử lý", value: 30, color: "#E0E7FF" },
  { name: "Đang giao", value: 20, color: "#FED7AA" },
  { name: "Hoàn thành", value: 10, color: "#D1FAE5" },
];

// Mock product performance data
const productPerformanceData = [
  { name: "Version 1", sold: 45, revenue: 11025000 },
  { name: "Version 2", sold: 38, revenue: 9500000 },
  { name: "Background A", sold: 25, revenue: 3750000 },
  { name: "Phụ kiện Mũ", sold: 15, revenue: 450000 },
  { name: "Combo Special", sold: 12, revenue: 6000000 },
];

// Mock monthly revenue data
const monthlyRevenueData = [
  { month: "T1", revenue: 45000000, target: 50000000 },
  { month: "T2", revenue: 52000000, target: 55000000 },
  { month: "T3", revenue: 48000000, target: 50000000 },
  { month: "T4", revenue: 61000000, target: 60000000 },
  { month: "T5", revenue: 55000000, target: 65000000 },
  { month: "T6", revenue: 68000000, target: 70000000 },
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
  // Hook for testing notifications
  const { triggerTestOrderNotification, triggerTestGeneralNotification } =
    useRealtimeNotifications();

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    newOrders: 0,
    totalRevenue: 0,
    pendingShipments: 0,
    recentOrders: [],
  });

  // State for real-time updates
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
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

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate real-time order updates
      const randomAction = Math.random();
      const now = new Date();

      if (randomAction < 0.3) {
        // New order notification
        const newNotification = {
          id: Date.now(),
          type: "new_order",
          message: `Đơn hàng mới từ ${getRandomCustomerName()}`,
          time: now,
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);

        // Update stats
        setDashboardData((prev) => ({
          ...prev,
          newOrders: prev.newOrders + 1,
          totalOrders: prev.totalOrders + 1,
        }));
      } else if (randomAction < 0.6) {
        // Status update notification
        const statusNotification = {
          id: Date.now(),
          type: "status_update",
          message: "Đơn hàng SO-202506 đã chuyển sang 'Đang giao'",
          time: now,
        };
        setNotifications((prev) => [statusNotification, ...prev.slice(0, 4)]);
      }

      setLastUpdate(now);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Helper function for random customer names
  const getRandomCustomerName = () => {
    const names = [
      "Nguyễn Văn An",
      "Trần Thị Bình",
      "Lê Hoàng Cường",
      "Phạm Thị Dung",
      "Võ Văn Em",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };
  return (
    <>
      {/* The main content area of the dashboard. Sidebar and outer layout div removed. */}
      <div className="flex-1">
        {" "}
        {/* Removed overflow-y-auto as AdminLayout handles scrolling */}
        {/* AdminHeader with logo and controls */}
        <AdminHeader title="Dashboard" showLogo={false}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span>
                {isLive ? "Cập nhật thời gian thực" : "Tạm dừng cập nhật"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Cập nhật lần cuối: {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                isLive
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isLive ? "Tạm dừng" : "Tiếp tục"}
            </button>
          </div>
        </AdminHeader>
        <main className="py-6">
          {/* Removed max-w-7xl mx-auto px-6 for better spacing */}
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
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weekly Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Doanh thu 7 ngày qua
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                  Doanh thu
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`,
                      "Doanh thu",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Order Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Phân bố trạng thái đơn hàng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hiệu suất sản phẩm
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "sold"
                        ? `${value} sản phẩm`
                        : `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`,
                      name === "sold" ? "Đã bán" : "Doanh thu",
                    ]}
                  />
                  <Bar dataKey="sold" fill="#10B981" name="sold" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Revenue vs Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Doanh thu vs Mục tiêu (6 tháng)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Doanh thu thực tế"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#EF4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Mục tiêu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>{" "}
          {/* Recent Orders and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden"
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

            {/* Real-time Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Thông báo thời gian thực
                </h3>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.type === "new_order"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {notification.type === "new_order" ? (
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        ) : (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time.toLocaleTimeString("vi-VN")}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <p className="mt-2 text-sm">Chưa có thông báo mới</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thao tác nhanh
            </h3>{" "}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link
                to="/admin/products/new"
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
                to="/admin/orders"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Quản lý đơn hàng
              </Link>

              <Link
                to="/admin/inventory"
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Quản lý kho hàng
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
                Xem báo cáo{" "}
              </Link>
            </div>
          </motion.div>
          {/* Dev Panel for Testing Notifications (only show in development) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6"
            >
              <h3 className="text-lg font-medium text-yellow-800 mb-3">
                🧪 Dev Panel - Test Notifications
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={triggerTestOrderNotification}
                  className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  🛒 Test Đơn Hàng Mới
                </button>
                <button
                  onClick={triggerTestGeneralNotification}
                  className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                >
                  📢 Test Thông Báo Khác
                </button>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                💡 <strong>Test đơn hàng mới:</strong> Sẽ tạo notification với
                thông tin khách hàng chi tiết, tin nhắn mẫu có thể copy/edit.
                <br />
                📞 Bao gồm: Tên, SĐT (có nút copy riêng), email, thông tin đơn
                hàng và tin nhắn liên hệ hoàn chỉnh.
              </p>
            </motion.div>
          )}
        </main>
      </div>
      <NotificationSystem />
    </>
  );
};

export default AdminDashboard;
