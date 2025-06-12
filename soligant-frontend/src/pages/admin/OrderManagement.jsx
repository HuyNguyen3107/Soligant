import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/admin/Sidebar";

// Mock data for orders
const mockOrdersData = [
  {
    id: "SO-202501",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    date: "2025-06-01",
    total: 295000,
    status: "waiting",
    items: [
      { name: "Version 1", price: 245000 },
      { name: "Phụ kiện Hoa", price: 50000 },
    ],
    isUrgent: true,
  },
  {
    id: "SO-202502",
    customerName: "Trần Thị B",
    customerPhone: "0901234568",
    date: "2025-06-05",
    total: 325000,
    status: "confirmed",
    items: [
      { name: "Version 2", price: 250000 },
      { name: "Phụ kiện Túi", price: 75000 },
    ],
    isUrgent: false,
  },
  {
    id: "SO-202503",
    customerName: "Lê Văn C",
    customerPhone: "0901234569",
    date: "2025-06-08",
    total: 450000,
    status: "processing",
    items: [{ name: "Combo Full", price: 450000 }],
    isUrgent: true,
  },
  {
    id: "SO-202504",
    customerName: "Phạm Thị D",
    customerPhone: "0901234570",
    date: "2025-06-10",
    total: 275000,
    status: "shipping",
    items: [
      { name: "Version 1", price: 245000 },
      { name: "Phụ kiện Mũ", price: 30000 },
    ],
    isUrgent: false,
  },
  {
    id: "SO-202505",
    customerName: "Hoàng Văn E",
    customerPhone: "0901234571",
    date: "2025-06-10",
    total: 500000,
    status: "completed",
    items: [
      { name: "Version 2", price: 250000 },
      { name: "Combo Phụ kiện", price: 250000 },
    ],
    isUrgent: false,
  },
  {
    id: "SO-202506",
    customerName: "Mai Thị F",
    customerPhone: "0901234572",
    date: "2025-06-09",
    total: 245000,
    status: "cancelled",
    items: [{ name: "Version 1", price: 245000 }],
    isUrgent: false,
  },
  {
    id: "SO-202507",
    customerName: "Vũ Văn G",
    customerPhone: "0901234573",
    date: "2025-06-11",
    total: 320000,
    status: "waiting",
    items: [
      { name: "Version 2", price: 250000 },
      { name: "Phụ kiện Hoa", price: 70000 },
    ],
    isUrgent: true,
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

const OrderManagement = () => {
  // Auth check
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      window.location.href = "/admin/login";
    }
  }, []);
  // Custom debounce hook
  function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    const debouncedFn = useCallback(
      (...args) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );

    return debouncedFn;
  }
  // Tạo hàm tìm kiếm debounced
  const debouncedSearch = useDebounce((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Cập nhật URL params
    const newParams = { ...Object.fromEntries(searchParams) };
    newParams[name] = value;

    // Xóa các param trống
    if (value === "") {
      delete newParams[name];
    }

    setSearchParams(newParams);
    setSearching(false); // Kết thúc trạng thái tìm kiếm
  }, 500); // Delay 500ms

  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    search: searchParams.get("search") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    sortBy: searchParams.get("sortBy") || "date",
    sortOrder: searchParams.get("sortOrder") || "desc",
    urgentOnly: searchParams.get("urgentOnly") === "true" || false,
    priceRange: {
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    },
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter orders based on filters
        let filteredOrders = [...mockOrdersData];

        // Status filter
        if (filters.status !== "all") {
          filteredOrders = filteredOrders.filter(
            (order) => order.status === filters.status
          );
        }

        // Search filter
        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.id.toLowerCase().includes(searchLower) ||
              order.customerName.toLowerCase().includes(searchLower) ||
              order.customerPhone.toLowerCase().includes(searchLower)
          );
        }

        // Date filter
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          filteredOrders = filteredOrders.filter(
            (order) => new Date(order.date) >= fromDate
          );
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredOrders = filteredOrders.filter(
            (order) => new Date(order.date) <= toDate
          );
        }

        // Price range filter
        if (filters.priceRange.min) {
          filteredOrders = filteredOrders.filter(
            (order) => order.total >= parseFloat(filters.priceRange.min)
          );
        }

        if (filters.priceRange.max) {
          filteredOrders = filteredOrders.filter(
            (order) => order.total <= parseFloat(filters.priceRange.max)
          );
        }

        // Urgent orders only filter
        if (filters.urgentOnly) {
          filteredOrders = filteredOrders.filter((order) => order.isUrgent);
        }

        // Sort orders
        filteredOrders.sort((a, b) => {
          if (filters.sortBy === "date") {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          } else if (filters.sortBy === "total") {
            return filters.sortOrder === "asc"
              ? a.total - b.total
              : b.total - a.total;
          } else if (filters.sortBy === "id") {
            return filters.sortOrder === "asc"
              ? a.id.localeCompare(b.id)
              : b.id.localeCompare(a.id);
          }
          return 0;
        });

        setOrders(filteredOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error loading orders:", error);
        setLoading(false);
      }
    };

    loadOrders();
  }, [filters]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Xử lý trường hợp thuộc tính lồng nhau (nested properties)
      const [parent, child] = name.split(".");
      setFilters((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Xử lý trường hợp thuộc tính đơn giản
      setFilters((prev) => ({ ...prev, [name]: value }));
    } // Cập nhật tham số URL để lưu trữ trạng thái lọc
    const newParams = { ...Object.fromEntries(searchParams) };

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "priceRange") {
        if (child === "min") newParams["minPrice"] = value;
        if (child === "max") newParams["maxPrice"] = value;
      }
    } else if (name === "urgentOnly") {
      newParams[name] = value.toString();
    } else {
      newParams[name] = value;
    }

    // Xóa các tham số trống
    Object.keys(newParams).forEach((key) => {
      if (
        newParams[key] === "" ||
        newParams[key] === null ||
        newParams[key] === undefined
      ) {
        delete newParams[key];
      }
    });

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The filter will be applied by the useEffect hook
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-900 font-utm-avo">
              Quản lý đơn hàng
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          {/* Filters */}{" "}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow p-6 mb-6"
          >
            {/* Bộ lọc cơ bản */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                >
                  <option value="all">Tất cả</option>
                  <option value="waiting">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="w-full md:w-auto flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <label className="block text-sm font-medium text-gray-700">
                    Tìm kiếm
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    {" "}
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={(e) => {
                        // Cập nhật local state ngay lập tức để UI phản hồi nhanh
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }));
                        // Hiển thị trạng thái đang tìm kiếm
                        setSearching(true);
                        // Debounce cập nhật URL và thực hiện tìm kiếm
                        debouncedSearch("search", e.target.value);
                      }}
                      placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
                      className="flex-1 block w-full rounded-md border-gray-300 focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                    />{" "}
                    <button
                      type="submit"
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-soligant-primary hover:bg-soligant-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
                    >
                      {searching ? (
                        <svg
                          className="animate-spin h-4 w-4"
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
                      ) : (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700">
                  Từ ngày
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                />
              </div>

              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700">
                  Đến ngày
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Bộ lọc nâng cao */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex flex-wrap gap-4">
                {/* Sắp xếp theo */}
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700">
                    Sắp xếp theo
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                  >
                    <option value="date">Thời gian đặt hàng</option>
                    <option value="total">Giá trị đơn hàng</option>
                    <option value="id">Mã đơn hàng</option>
                  </select>
                </div>
                {/* Thứ tự sắp xếp */}
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700">
                    Thứ tự
                  </label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                  >
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                  </select>
                </div>
                {/* Khoảng giá */}
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá trị từ (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="priceRange.min"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      handleFilterChange({
                        target: {
                          name: "priceRange.min",
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="Giá trị tối thiểu"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700">
                    Đến (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="priceRange.max"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      handleFilterChange({
                        target: {
                          name: "priceRange.max",
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="Giá trị tối đa"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-soligant-primary focus:ring focus:ring-soligant-primary focus:ring-opacity-50"
                  />
                </div>
                {/* Đơn gấp */}
                <div className="w-full md:w-auto flex items-end">
                  <div className="flex items-center mt-6">
                    <input
                      id="urgentOnly"
                      name="urgentOnly"
                      type="checkbox"
                      checked={filters.urgentOnly}
                      onChange={(e) =>
                        handleFilterChange({
                          target: {
                            name: "urgentOnly",
                            value: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-soligant-primary focus:ring-soligant-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="urgentOnly"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Chỉ hiện đơn gấp
                    </label>
                  </div>
                </div>{" "}
              </div>

              {/* Nút làm mới bộ lọc */}
              <div className="w-full flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      status: "all",
                      search: "",
                      dateFrom: "",
                      dateTo: "",
                      sortBy: "date",
                      sortOrder: "desc",
                      urgentOnly: false,
                      priceRange: {
                        min: "",
                        max: "",
                      },
                    });
                    setSearchParams({});
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soligant-primary"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Làm mới bộ lọc
                </button>
              </div>
            </div>
          </motion.div>
          {/* Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {" "}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách đơn hàng
                <span className="ml-2 text-sm text-gray-500">
                  ({orders.length} đơn hàng)
                </span>
              </h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <svg
                  className="animate-spin h-8 w-8 text-soligant-primary"
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
              </div>
            ) : orders.length > 0 ? (
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
                        SĐT
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
                    {orders.map((order) => {
                      const statusInfo = formatStatus(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          {" "}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                            {order.id}
                            {order.isUrgent && (
                              <span className="ml-2 flex items-center">
                                <span className="flex h-2 w-2 relative mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full font-medium">
                                  Gấp
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerPhone}
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
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/admin/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Chi tiết
                              </Link>
                              <div className="relative inline-block text-left">
                                <select
                                  className="cursor-pointer text-sm text-gray-500 bg-white border border-gray-300 rounded px-2 py-1"
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(order.id, e.target.value)
                                  }
                                >
                                  <option value="waiting">Chờ xác nhận</option>
                                  <option value="confirmed">Xác nhận</option>
                                  <option value="processing">Đang xử lý</option>
                                  <option value="shipping">Đang giao</option>
                                  <option value="completed">Hoàn thành</option>
                                  <option value="cancelled">Hủy</option>
                                </select>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không tìm thấy đơn hàng nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không có đơn hàng nào phù hợp với điều kiện lọc.
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default OrderManagement;
