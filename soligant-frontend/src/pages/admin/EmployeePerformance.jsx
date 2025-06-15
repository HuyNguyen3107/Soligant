// src/pages/admin/EmployeePerformance.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  UserIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

// Mock performance data
const mockPerformanceData = [
  {
    id: "EMP001",
    employeeId: "NV001",
    employeeName: "Nguyễn Văn An",
    department: "Thiết kế",
    position: "Designer",
    avatar: "/images/avatars/user1.jpg",
    period: "2025-06",
    statistics: {
      totalOrders: 45,
      completedOrders: 42,
      pendingOrders: 3,
      cancelledOrders: 0,
      averageCompletionTime: 2.5, // days
      customerRating: 4.8,
      revenue: 25600000, // VND
    },
    metrics: {
      productivity: 93, // %
      quality: 96, // %
      punctuality: 98, // %
      customerSatisfaction: 95, // %
    },
    achievements: [
      "Hoàn thành xuất sắc 42/45 đơn hàng",
      "Đạt rating khách hàng 4.8/5",
      "Tăng 15% so với tháng trước",
    ],
    issues: ["3 đơn hàng chưa hoàn thành đúng hạn"],
    goals: [
      { name: "Hoàn thành 50 đơn hàng", progress: 90 },
      { name: "Đạt rating 4.9/5", progress: 85 },
      { name: "Giảm thời gian xử lý xuống 2 ngày", progress: 70 },
    ],
    lastUpdated: "2025-06-14T10:30:00",
  },
  {
    id: "EMP002",
    employeeId: "NV002",
    employeeName: "Trần Thị Bình",
    department: "Sản xuất",
    position: "Production Manager",
    avatar: "/images/avatars/user2.jpg",
    period: "2025-06",
    statistics: {
      totalOrders: 38,
      completedOrders: 35,
      pendingOrders: 2,
      cancelledOrders: 1,
      averageCompletionTime: 3.2,
      customerRating: 4.6,
      revenue: 19800000,
    },
    metrics: {
      productivity: 89,
      quality: 92,
      punctuality: 95,
      customerSatisfaction: 88,
    },
    achievements: [
      "Quản lý tốt quy trình sản xuất",
      "Giảm 10% thời gian sản xuất",
    ],
    issues: [
      "1 đơn hàng bị hủy do lỗi kỹ thuật",
      "Cần cải thiện giao tiếp với khách hàng",
    ],
    goals: [
      { name: "Hoàn thành 40 đơn hàng", progress: 95 },
      { name: "Đạt rating 4.7/5", progress: 75 },
      { name: "Giảm tỷ lệ hủy đơn xuống 0%", progress: 60 },
    ],
    lastUpdated: "2025-06-14T09:15:00",
  },
  {
    id: "EMP003",
    employeeId: "NV003",
    employeeName: "Lê Minh Cường",
    department: "Kinh doanh",
    position: "Sales Executive",
    avatar: "/images/avatars/user3.jpg",
    period: "2025-06",
    statistics: {
      totalOrders: 52,
      completedOrders: 48,
      pendingOrders: 4,
      cancelledOrders: 0,
      averageCompletionTime: 1.8,
      customerRating: 4.9,
      revenue: 31200000,
    },
    metrics: {
      productivity: 98,
      quality: 94,
      punctuality: 96,
      customerSatisfaction: 97,
    },
    achievements: [
      "Đạt top 1 doanh số tháng",
      "Rating khách hàng cao nhất",
      "Xử lý nhanh nhất",
    ],
    issues: [],
    goals: [
      { name: "Hoàn thành 55 đơn hàng", progress: 95 },
      { name: "Duy trì rating 4.9/5", progress: 100 },
      { name: "Tăng doanh thu 20%", progress: 85 },
    ],
    lastUpdated: "2025-06-14T11:45:00",
  },
];

const EmployeePerformance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("2025-06");
  const [sortBy, setSortBy] = useState("productivity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load employee performance data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setEmployees(mockPerformanceData);
      } catch (error) {
        console.error("Error loading performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort employees
  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch =
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || emp.department === departmentFilter;
      const matchesPeriod = emp.period === periodFilter;

      return matchesSearch && matchesDepartment && matchesPeriod;
    })
    .sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "name") {
        valueA = a.employeeName;
        valueB = b.employeeName;
      } else if (sortBy === "revenue") {
        valueA = a.statistics.revenue;
        valueB = b.statistics.revenue;
      } else if (sortBy === "rating") {
        valueA = a.statistics.customerRating;
        valueB = b.statistics.customerRating;
      } else {
        valueA = a.metrics[sortBy];
        valueB = b.metrics[sortBy];
      }

      if (typeof valueA === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

  // Get unique departments
  const departments = [...new Set(employees.map((emp) => emp.department))];

  // Calculate overall stats
  const overallStats = {
    totalEmployees: employees.length,
    avgProductivity: Math.round(
      employees.reduce((sum, emp) => sum + emp.metrics.productivity, 0) /
        employees.length
    ),
    avgQuality: Math.round(
      employees.reduce((sum, emp) => sum + emp.metrics.quality, 0) /
        employees.length
    ),
    totalRevenue: employees.reduce(
      (sum, emp) => sum + emp.statistics.revenue,
      0
    ),
  };

  // Handle detail modal
  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  // Get performance level
  const getPerformanceLevel = (score) => {
    if (score >= 95)
      return { label: "Xuất sắc", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 90)
      return { label: "Tốt", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 80)
      return { label: "Khá", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score >= 70)
      return {
        label: "Trung bình",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    return { label: "Cần cải thiện", color: "text-red-600", bg: "bg-red-100" };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hiệu suất nhân viên
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và đánh giá hiệu suất làm việc của nhân viên
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2025-06">Tháng 6/2025</option>
            <option value="2025-05">Tháng 5/2025</option>
            <option value="2025-04">Tháng 4/2025</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Tổng nhân viên
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.totalEmployees}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Năng suất TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.avgProductivity}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Chất lượng TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.avgQuality}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Tổng doanh thu
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(overallStats.totalRevenue)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="productivity">Năng suất</option>
              <option value="quality">Chất lượng</option>
              <option value="customerSatisfaction">Hài lòng KH</option>
              <option value="revenue">Doanh thu</option>
              <option value="rating">Rating</option>
              <option value="name">Tên</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === "asc" ? (
                <ArrowUpIcon className="w-4 h-4 mr-2" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-2" />
              )}
              {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
            </button>
          </div>
        </div>
      </div>

      {/* Employee Performance Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Nhân viên
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Phòng ban
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Năng suất
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Chất lượng
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Hài lòng KH
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Đơn hàng
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Rating
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Doanh thu
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const productivityLevel = getPerformanceLevel(
                    employee.metrics.productivity
                  );
                  const qualityLevel = getPerformanceLevel(
                    employee.metrics.quality
                  );
                  const satisfactionLevel = getPerformanceLevel(
                    employee.metrics.customerSatisfaction
                  );

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img
                            src={employee.avatar}
                            alt={employee.employeeName}
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkM5LjIgMTIgNy4yIDkuOCA3LjIgN0M3LjIgNC4yIDkuMiAyIDEyIDJDMTQuOCAyIDE2LjggNC4yIDE2LjggN0MxNi44IDkuOCAxNC44IDEyIDEyIDEyWk0xMiA0QzEwLjMgNCAxMSA0LjcgMTEgNi4yQzEwLjIgOC44IDEwLjIgMTAgMTIgMTBDMTMuOCAxMCAxNCA4LjggMTQgN0MxNCA0LjIgMTMuOCA0IDEyIDRaTTIxIDIySDNWMjBDMyAxNiA2IDE0IDEyIDE0QzE4IDE0IDIxIDE2IDIxIDIwVjIyWk01IDE5LjhIMTlDMTguNiAxNy4yIDE2IDE2IDEyIDE2QzggMTYgNS40IDE3LjIgNSAxOS44WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4KPC9zdmc+";
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {employee.employeeName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employee.employeeId} • {employee.position}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {employee.department}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${productivityLevel.bg} ${productivityLevel.color}`}
                        >
                          {employee.metrics.productivity}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${qualityLevel.bg} ${qualityLevel.color}`}
                        >
                          {employee.metrics.quality}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${satisfactionLevel.bg} ${satisfactionLevel.color}`}
                        >
                          {employee.metrics.customerSatisfaction}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">
                            {employee.statistics.completedOrders}
                          </span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-600">
                            {employee.statistics.totalOrders}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="font-medium">
                            {employee.statistics.customerRating}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
                        {formatCurrency(employee.statistics.revenue)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openDetailModal(employee)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy nhân viên nào"
                    : "Chưa có dữ liệu hiệu suất"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <PerformanceDetailModal
          employee={selectedEmployee}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

// Performance Detail Modal Component
const PerformanceDetailModal = ({ employee, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Chi tiết hiệu suất - {employee.employeeName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <img
                    src={employee.avatar}
                    alt={employee.employeeName}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=";
                    }}
                  />
                  <h3 className="font-bold text-gray-900">
                    {employee.employeeName}
                  </h3>
                  <p className="text-gray-600">{employee.employeeId}</p>
                  <p className="text-sm text-gray-500">
                    {employee.department} • {employee.position}
                  </p>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Mục tiêu tháng
                </h4>
                <div className="space-y-3">
                  {employee.goals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          {goal.name}
                        </span>
                        <span className="text-sm font-medium">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Details */}
            <div className="lg:col-span-2">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(employee.metrics).map(([key, value]) => {
                  const labels = {
                    productivity: "Năng suất",
                    quality: "Chất lượng",
                    punctuality: "Đúng giờ",
                    customerSatisfaction: "Hài lòng KH",
                  };

                  return (
                    <div key={key} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {labels[key]}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            value >= 95
                              ? "bg-green-500"
                              : value >= 90
                              ? "bg-blue-500"
                              : value >= 80
                              ? "bg-yellow-500"
                              : value >= 70
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statistics */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Thống kê chi tiết
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {employee.statistics.totalOrders}
                    </p>
                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {employee.statistics.completedOrders}
                    </p>
                    <p className="text-sm text-gray-600">Đã hoàn thành</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {employee.statistics.pendingOrders}
                    </p>
                    <p className="text-sm text-gray-600">Đang xử lý</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {employee.statistics.averageCompletionTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày TB (hoàn thành)
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {employee.statistics.customerRating}
                    </p>
                    <p className="text-sm text-gray-600">Rating khách hàng</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(employee.statistics.revenue)}
                    </p>
                    <p className="text-sm text-gray-600">Doanh thu</p>
                  </div>
                </div>
              </div>

              {/* Achievements & Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Achievements */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2" />
                    Thành tích nổi bật
                  </h4>
                  <ul className="space-y-2">
                    {employee.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="text-sm text-green-700 flex items-start"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Issues */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Vấn đề cần cải thiện
                  </h4>
                  {employee.issues.length > 0 ? (
                    <ul className="space-y-2">
                      {employee.issues.map((issue, index) => (
                        <li
                          key={index}
                          className="text-sm text-orange-700 flex items-start"
                        >
                          <XCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-orange-600">
                      Không có vấn đề nào được ghi nhận
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeePerformance;
