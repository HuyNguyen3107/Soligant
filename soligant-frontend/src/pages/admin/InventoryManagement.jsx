import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mock inventory data
const mockInventoryData = [
  {
    id: "INV001",
    productId: "P001",
    productName: "Version 1",
    variantName: "Kích thước Nhỏ",
    currentStock: 25,
    reservedStock: 5,
    availableStock: 20,
    minStockLevel: 10,
    maxStockLevel: 100,
    costPrice: 200000,
    sellPrice: 245000,
    location: "Kho A - Kệ 1",
    supplier: "Nhà cung cấp A",
    lastUpdated: "2025-06-10T14:30:00",
    status: "in_stock",
  },
  {
    id: "INV002",
    productId: "P001",
    productName: "Version 1",
    variantName: "Kích thước Lớn",
    currentStock: 8,
    reservedStock: 3,
    availableStock: 5,
    minStockLevel: 10,
    maxStockLevel: 100,
    costPrice: 220000,
    sellPrice: 270000,
    location: "Kho A - Kệ 2",
    supplier: "Nhà cung cấp A",
    lastUpdated: "2025-06-11T09:15:00",
    status: "low_stock",
  },
  {
    id: "INV003",
    productId: "P002",
    productName: "Version 2",
    variantName: "Kích thước Nhỏ",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minStockLevel: 10,
    maxStockLevel: 80,
    costPrice: 210000,
    sellPrice: 250000,
    location: "Kho B - Kệ 1",
    supplier: "Nhà cung cấp B",
    lastUpdated: "2025-06-09T16:45:00",
    status: "out_of_stock",
  },
  {
    id: "INV004",
    productId: "P003",
    productName: "Phụ kiện Hoa",
    variantName: "Màu Đỏ",
    currentStock: 45,
    reservedStock: 8,
    availableStock: 37,
    minStockLevel: 15,
    maxStockLevel: 50,
    costPrice: 35000,
    sellPrice: 50000,
    location: "Kho C - Kệ 3",
    supplier: "Nhà cung cấp C",
    lastUpdated: "2025-06-12T11:20:00",
    status: "in_stock",
  },
  {
    id: "INV005",
    productId: "P004",
    productName: "Background A",
    variantName: "Kích thước Chuẩn",
    currentStock: 12,
    reservedStock: 2,
    availableStock: 10,
    minStockLevel: 8,
    maxStockLevel: 30,
    costPrice: 120000,
    sellPrice: 150000,
    location: "Kho D - Kệ 1",
    supplier: "Nhà cung cấp D",
    lastUpdated: "2025-06-11T13:00:00",
    status: "in_stock",
  },
];

// Mock stock movement data
const mockStockMovements = [
  {
    id: "MOV001",
    inventoryId: "INV001",
    productName: "Version 1 - Kích thước Nhỏ",
    type: "in",
    quantity: 10,
    reason: "Nhập hàng từ nhà cung cấp",
    performedBy: "Admin",
    timestamp: "2025-06-10T14:30:00",
    notes: "Lô hàng mới từ nhà cung cấp A",
  },
  {
    id: "MOV002",
    inventoryId: "INV002",
    productName: "Version 1 - Kích thước Lớn",
    type: "out",
    quantity: 5,
    reason: "Bán hàng",
    performedBy: "System",
    timestamp: "2025-06-11T09:15:00",
    notes: "Đơn hàng SO-202505",
  },
  {
    id: "MOV003",
    inventoryId: "INV003",
    productName: "Version 2 - Kích thước Nhỏ",
    type: "out",
    quantity: 3,
    reason: "Hàng lỗi",
    performedBy: "Admin",
    timestamp: "2025-06-09T16:45:00",
    notes: "Phát hiện lỗi chất lượng",
  },
];

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    location: "all",
    supplier: "all",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({
    type: "in",
    quantity: "",
    reason: "",
    notes: "",
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredItems = [...mockInventoryData];

        // Apply filters
        if (filters.status !== "all") {
          filteredItems = filteredItems.filter(
            (item) => item.status === filters.status
          );
        }

        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filteredItems = filteredItems.filter(
            (item) =>
              item.productName.toLowerCase().includes(searchLower) ||
              item.variantName.toLowerCase().includes(searchLower) ||
              item.id.toLowerCase().includes(searchLower)
          );
        }

        if (filters.location !== "all") {
          filteredItems = filteredItems.filter((item) =>
            item.location.includes(filters.location)
          );
        }

        if (filters.supplier !== "all") {
          filteredItems = filteredItems.filter(
            (item) => item.supplier === filters.supplier
          );
        }

        setInventoryItems(filteredItems);
        setStockMovements(mockStockMovements);
        setLoading(false);
      } catch (error) {
        console.error("Error loading inventory data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const getStatusInfo = (status) => {
    const statusMap = {
      in_stock: { text: "Còn hàng", color: "bg-green-100 text-green-800" },
      low_stock: { text: "Sắp hết", color: "bg-yellow-100 text-yellow-800" },
      out_of_stock: { text: "Hết hàng", color: "bg-red-100 text-red-800" },
      discontinued: {
        text: "Ngừng kinh doanh",
        color: "bg-gray-100 text-gray-800",
      },
    };
    return (
      statusMap[status] || {
        text: "Không xác định",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockAdjustment = () => {
    if (!selectedItem || !stockAdjustment.quantity || !stockAdjustment.reason) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const quantity = parseInt(stockAdjustment.quantity);
    const newMovement = {
      id: `MOV${Date.now()}`,
      inventoryId: selectedItem.id,
      productName: `${selectedItem.productName} - ${selectedItem.variantName}`,
      type: stockAdjustment.type,
      quantity: quantity,
      reason: stockAdjustment.reason,
      performedBy: "Admin",
      timestamp: new Date().toISOString(),
      notes: stockAdjustment.notes,
    };

    // Update inventory
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newStock =
            stockAdjustment.type === "in"
              ? item.currentStock + quantity
              : item.currentStock - quantity;
          const newAvailable = newStock - item.reservedStock;

          let newStatus = "in_stock";
          if (newStock <= 0) newStatus = "out_of_stock";
          else if (newStock <= item.minStockLevel) newStatus = "low_stock";

          return {
            ...item,
            currentStock: Math.max(0, newStock),
            availableStock: Math.max(0, newAvailable),
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    // Add to movements
    setStockMovements((prev) => [newMovement, ...prev]);

    // Reset form
    setStockAdjustment({
      type: "in",
      quantity: "",
      reason: "",
      notes: "",
    });
    setShowStockModal(false);
    setSelectedItem(null);
  };

  const getTotalValue = () => {
    return inventoryItems.reduce(
      (total, item) => total + item.currentStock * item.costPrice,
      0
    );
  };

  const getLowStockCount = () => {
    return inventoryItems.filter(
      (item) => item.status === "low_stock" || item.status === "out_of_stock"
    ).length;
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-900 font-utm-avo">
              Quản lý kho hàng
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng sản phẩm
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {inventoryItems.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Giá trị kho
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {new Intl.NumberFormat("vi-VN").format(getTotalValue())} VNĐ
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Cảnh báo tồn kho
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getLowStockCount()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-5"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v10h2V6H9zm4 0v10h2V6h-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Chuyển động hôm nay
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      stockMovements.filter(
                        (movement) =>
                          new Date(movement.timestamp).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("inventory")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "inventory"
                      ? "border-soligant-primary text-soligant-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Tồn kho
                </button>
                <button
                  onClick={() => setActiveTab("movements")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "movements"
                      ? "border-soligant-primary text-soligant-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Lịch sử xuất nhập
                </button>
                <button
                  onClick={() => setActiveTab("alerts")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "alerts"
                      ? "border-soligant-primary text-soligant-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Cảnh báo
                  {getLowStockCount() > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {getLowStockCount()}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "inventory" && (
                <div>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="all">Tất cả</option>
                        <option value="in_stock">Còn hàng</option>
                        <option value="low_stock">Sắp hết</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm
                      </label>
                      <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Tìm theo tên sản phẩm, mã..."
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vị trí
                      </label>
                      <select
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="all">Tất cả</option>
                        <option value="Kho A">Kho A</option>
                        <option value="Kho B">Kho B</option>
                        <option value="Kho C">Kho C</option>
                        <option value="Kho D">Kho D</option>
                      </select>
                    </div>
                  </div>

                  {/* Inventory Table */}
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soligant-primary"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tồn kho
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vị trí
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giá trị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inventoryItems.map((item) => {
                            const statusInfo = getStatusInfo(item.status);
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {item.productName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {item.variantName}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {item.id}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    <div>
                                      Hiện tại:{" "}
                                      <span className="font-medium">
                                        {item.currentStock}
                                      </span>
                                    </div>
                                    <div>
                                      Có thể bán:{" "}
                                      <span className="font-medium text-green-600">
                                        {item.availableStock}
                                      </span>
                                    </div>
                                    <div>
                                      Đã đặt:{" "}
                                      <span className="font-medium text-orange-600">
                                        {item.reservedStock}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                                  >
                                    {statusInfo.text}
                                  </span>
                                  {item.currentStock <= item.minStockLevel && (
                                    <div className="text-xs text-red-600 mt-1">
                                      Dưới mức tối thiểu ({item.minStockLevel})
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div>
                                    <div>
                                      Giá vốn:{" "}
                                      {new Intl.NumberFormat("vi-VN").format(
                                        item.costPrice
                                      )}{" "}
                                      VNĐ
                                    </div>
                                    <div>
                                      Giá bán:{" "}
                                      {new Intl.NumberFormat("vi-VN").format(
                                        item.sellPrice
                                      )}{" "}
                                      VNĐ
                                    </div>
                                    <div className="font-medium">
                                      Tổng:{" "}
                                      {new Intl.NumberFormat("vi-VN").format(
                                        item.currentStock * item.costPrice
                                      )}{" "}
                                      VNĐ
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setShowStockModal(true);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    Điều chỉnh
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-900">
                                    Chi tiết
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "movements" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Lịch sử xuất nhập kho
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số lượng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lý do
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người thực hiện
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockMovements.map((movement) => (
                          <tr key={movement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(movement.timestamp).toLocaleString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {movement.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  movement.type === "in"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {movement.type === "in" ? "Nhập" : "Xuất"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {movement.type === "in" ? "+" : "-"}
                              {movement.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.performedBy}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Cảnh báo tồn kho
                  </h3>
                  <div className="space-y-4">
                    {inventoryItems
                      .filter(
                        (item) =>
                          item.status === "low_stock" ||
                          item.status === "out_of_stock"
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            item.status === "out_of_stock"
                              ? "bg-red-50 border-red-400"
                              : "bg-yellow-50 border-yellow-400"
                          }`}
                        >
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className={`h-5 w-5 ${
                                  item.status === "out_of_stock"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3
                                className={`text-sm font-medium ${
                                  item.status === "out_of_stock"
                                    ? "text-red-800"
                                    : "text-yellow-800"
                                }`}
                              >
                                {item.status === "out_of_stock"
                                  ? "Hết hàng"
                                  : "Sắp hết hàng"}
                              </h3>
                              <div
                                className={`mt-2 text-sm ${
                                  item.status === "out_of_stock"
                                    ? "text-red-700"
                                    : "text-yellow-700"
                                }`}
                              >
                                <p>
                                  <strong>
                                    {item.productName} - {item.variantName}
                                  </strong>
                                </p>
                                <p>
                                  Tồn kho hiện tại: {item.currentStock} (Mức tối
                                  thiểu: {item.minStockLevel})
                                </p>
                                <p>Vị trí: {item.location}</p>
                              </div>
                              <div className="mt-4">
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowStockModal(true);
                                  }}
                                  className={`text-sm font-medium ${
                                    item.status === "out_of_stock"
                                      ? "text-red-800 hover:text-red-900"
                                      : "text-yellow-800 hover:text-yellow-900"
                                  }`}
                                >
                                  Nhập hàng ngay →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Stock Adjustment Modal */}
      {showStockModal && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowStockModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Điều chỉnh tồn kho - {selectedItem.productName}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại điều chỉnh
                    </label>
                    <select
                      value={stockAdjustment.type}
                      onChange={(e) =>
                        setStockAdjustment((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="in">Nhập kho</option>
                      <option value="out">Xuất kho</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={stockAdjustment.quantity}
                      onChange={(e) =>
                        setStockAdjustment((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Nhập số lượng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lý do
                    </label>
                    <select
                      value={stockAdjustment.reason}
                      onChange={(e) =>
                        setStockAdjustment((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Chọn lý do</option>
                      {stockAdjustment.type === "in" ? (
                        <>
                          <option value="Nhập hàng từ nhà cung cấp">
                            Nhập hàng từ nhà cung cấp
                          </option>
                          <option value="Hoàn trả từ khách hàng">
                            Hoàn trả từ khách hàng
                          </option>
                          <option value="Điều chỉnh kiểm kê">
                            Điều chỉnh kiểm kê
                          </option>
                          <option value="Sản xuất nội bộ">
                            Sản xuất nội bộ
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="Bán hàng">Bán hàng</option>
                          <option value="Hàng lỗi">Hàng lỗi</option>
                          <option value="Hao mòn">Hao mòn</option>
                          <option value="Điều chỉnh kiểm kê">
                            Điều chỉnh kiểm kê
                          </option>
                          <option value="Chuyển kho">Chuyển kho</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={stockAdjustment.notes}
                      onChange={(e) =>
                        setStockAdjustment((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Nhập ghi chú thêm..."
                    />
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      Tồn kho hiện tại:{" "}
                      <span className="font-medium">
                        {selectedItem.currentStock}
                      </span>
                    </p>
                    {stockAdjustment.quantity && (
                      <p className="text-sm text-gray-600">
                        Sau điều chỉnh:{" "}
                        <span className="font-medium">
                          {stockAdjustment.type === "in"
                            ? selectedItem.currentStock +
                              parseInt(stockAdjustment.quantity || 0)
                            : Math.max(
                                0,
                                selectedItem.currentStock -
                                  parseInt(stockAdjustment.quantity || 0)
                              )}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowStockModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStockAdjustment}
                  className="px-4 py-2 bg-soligant-primary text-white rounded-md text-sm font-medium hover:bg-soligant-primary-dark"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryManagement;
