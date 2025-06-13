import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AdminHeader from "../../components/admin/AdminHeader";

// Mock data for products
const mockProductsData = [
  {
    id: "P001",
    name: "Version 1",
    display_name: "Version 1 (Cơ bản)",
    product_type: "primary",
    base_price: 245000,
    is_customizable: true,
    is_required: true,
    is_active: true,
    sort_order: 1,
    collection_id: "C001",
    collection_name: "Tốt nghiệp",
    variants: [
      {
        id: "V001",
        variant_name: "Kích thước",
        variant_value: "Nhỏ",
        price_adjustment: 0,
        is_default: true,
      },
      {
        id: "V002",
        variant_name: "Kích thước",
        variant_value: "Lớn",
        price_adjustment: 50000,
        is_default: false,
      },
    ],
    images: [
      {
        id: "I001",
        image_url: "https://via.placeholder.com/150?text=Version+1",
        is_primary: true,
      },
    ],
    created_at: "2025-05-01",
  },
  {
    id: "P002",
    name: "Version 2",
    display_name: "Version 2 (Nâng cao)",
    product_type: "primary",
    base_price: 345000,
    is_customizable: true,
    is_required: false,
    is_active: true,
    sort_order: 2,
    collection_id: "C001",
    collection_name: "Tốt nghiệp",
    variants: [
      {
        id: "V003",
        variant_name: "Kích thước",
        variant_value: "Nhỏ",
        price_adjustment: 0,
        is_default: true,
      },
      {
        id: "V004",
        variant_name: "Kích thước",
        variant_value: "Lớn",
        price_adjustment: 75000,
        is_default: false,
      },
    ],
    images: [
      {
        id: "I002",
        image_url: "https://via.placeholder.com/150?text=Version+2",
        is_primary: true,
      },
    ],
    created_at: "2025-05-01",
  },
  {
    id: "P003",
    name: "Phụ kiện Hoa",
    display_name: "Hoa trang trí",
    product_type: "accessory",
    base_price: 50000,
    is_customizable: false,
    is_required: false,
    is_active: true,
    sort_order: 3,
    collection_id: "C001",
    collection_name: "Tốt nghiệp",
    variants: [
      {
        id: "V005",
        variant_name: "Màu sắc",
        variant_value: "Hồng",
        price_adjustment: 0,
        is_default: true,
      },
      {
        id: "V006",
        variant_name: "Màu sắc",
        variant_value: "Trắng",
        price_adjustment: 0,
        is_default: false,
      },
    ],
    images: [
      {
        id: "I003",
        image_url: "https://via.placeholder.com/150?text=Hoa",
        is_primary: true,
      },
    ],
    created_at: "2025-05-02",
  },
  {
    id: "P004",
    name: "Phụ kiện Túi",
    display_name: "Túi giấy",
    product_type: "accessory",
    base_price: 75000,
    is_customizable: false,
    is_required: false,
    is_active: true,
    sort_order: 4,
    collection_id: "C001",
    collection_name: "Tốt nghiệp",
    variants: [],
    images: [
      {
        id: "I004",
        image_url: "https://via.placeholder.com/150?text=Tui",
        is_primary: true,
      },
    ],
    created_at: "2025-05-02",
  },
  {
    id: "P005",
    name: "Version 1",
    display_name: "Version 1 (Cơ bản)",
    product_type: "primary",
    base_price: 245000,
    is_customizable: true,
    is_required: true,
    is_active: true,
    sort_order: 1,
    collection_id: "C002",
    collection_name: "Sinh nhật",
    variants: [
      {
        id: "V007",
        variant_name: "Kích thước",
        variant_value: "Nhỏ",
        price_adjustment: 0,
        is_default: true,
      },
      {
        id: "V008",
        variant_name: "Kích thước",
        variant_value: "Lớn",
        price_adjustment: 50000,
        is_default: false,
      },
    ],
    images: [
      {
        id: "I005",
        image_url: "https://via.placeholder.com/150?text=Version+1+Birthday",
        is_primary: true,
      },
    ],
    created_at: "2025-05-10",
  },
  {
    id: "P006",
    name: "Phụ kiện Mũ",
    display_name: "Mũ sinh nhật",
    product_type: "accessory",
    base_price: 30000,
    is_customizable: false,
    is_required: false,
    is_active: false,
    sort_order: 2,
    collection_id: "C002",
    collection_name: "Sinh nhật",
    variants: [
      {
        id: "V009",
        variant_name: "Màu sắc",
        variant_value: "Xanh",
        price_adjustment: 0,
        is_default: true,
      },
      {
        id: "V010",
        variant_name: "Màu sắc",
        variant_value: "Đỏ",
        price_adjustment: 0,
        is_default: false,
      },
      {
        id: "V011",
        variant_name: "Màu sắc",
        variant_value: "Vàng",
        price_adjustment: 0,
        is_default: false,
      },
    ],
    images: [
      {
        id: "I006",
        image_url: "https://via.placeholder.com/150?text=Mu",
        is_primary: true,
      },
    ],
    created_at: "2025-05-10",
  },
  {
    id: "P007",
    name: "Combo Full",
    display_name: "Combo đầy đủ",
    product_type: "combo",
    base_price: 450000,
    is_customizable: true,
    is_required: false,
    is_active: true,
    sort_order: 3,
    collection_id: "C002",
    collection_name: "Sinh nhật",
    variants: [],
    images: [
      {
        id: "I007",
        image_url: "https://via.placeholder.com/150?text=Combo",
        is_primary: true,
      },
    ],
    created_at: "2025-05-11",
  },
];

// Mock collections data for filter
const mockCollectionsData = [
  { id: "C001", name: "Tốt nghiệp" },
  { id: "C002", name: "Sinh nhật" },
  { id: "C003", name: "Valentine" },
  { id: "C004", name: "Đám cưới" },
];

// Format product type to Vietnamese
const formatProductType = (type) => {
  const typeMap = {
    primary: { text: "Sản phẩm chính", color: "bg-blue-100 text-blue-800" },
    accessory: { text: "Phụ kiện", color: "bg-orange-100 text-orange-800" },
    combo: { text: "Combo", color: "bg-purple-100 text-purple-800" },
    background: { text: "Background", color: "bg-green-100 text-green-800" },
  };

  return (
    typeMap[type] || {
      text: "Không xác định",
      color: "bg-gray-100 text-gray-800",
    }
  );
};

// Format status to Vietnamese
const formatStatus = (isActive) => {
  return isActive
    ? { text: "Đang bán", color: "bg-green-100 text-green-800" }
    : { text: "Ngừng bán", color: "bg-red-100 text-red-800" };
};

const ProductManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    collection_id: searchParams.get("collection_id") || "all",
    product_type: searchParams.get("product_type") || "all",
    status: searchParams.get("status") || "all",
    search: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter products based on filters
        let filteredProducts = [...mockProductsData];

        // Collection filter
        if (filters.collection_id !== "all") {
          filteredProducts = filteredProducts.filter(
            (product) => product.collection_id === filters.collection_id
          );
        }

        // Product type filter
        if (filters.product_type !== "all") {
          filteredProducts = filteredProducts.filter(
            (product) => product.product_type === filters.product_type
          );
        }

        // Status filter
        if (filters.status !== "all") {
          const isActive = filters.status === "active";
          filteredProducts = filteredProducts.filter(
            (product) => product.is_active === isActive
          );
        }

        // Search filter
        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              product.display_name.toLowerCase().includes(searchLower)
          );
        }

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update URL params
    const params = {};
    if (newFilters.collection_id !== "all")
      params.collection_id = newFilters.collection_id;
    if (newFilters.product_type !== "all")
      params.product_type = newFilters.product_type;
    if (newFilters.status !== "all") params.status = newFilters.status;

    setSearchParams(params);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Toggle product status
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update product status in local state
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, is_active: !currentStatus }
          : product
      );

      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };
  return (
    <div className="overflow-auto">
      <div className="container mx-auto py-8 px-4">
        <AdminHeader title="Quản lý sản phẩm" showLogo={false}>
          <Link
            to="/admin/products/new"
            className="bg-soligant-primary hover:bg-soligant-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Thêm sản phẩm mới
          </Link>
        </AdminHeader>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Collection filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bộ sưu tập
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.collection_id}
                onChange={(e) =>
                  handleFilterChange("collection_id", e.target.value)
                }
              >
                <option value="all">Tất cả</option>
                {mockCollectionsData.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product type filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại sản phẩm
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.product_type}
                onChange={(e) =>
                  handleFilterChange("product_type", e.target.value)
                }
              >
                <option value="all">Tất cả</option>
                <option value="primary">Sản phẩm chính</option>
                <option value="accessory">Phụ kiện</option>
                <option value="combo">Combo</option>
                <option value="background">Background</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tên sản phẩm..."
                  value={filters.search}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-700">
            {products.length} sản phẩm{" "}
            {filters.collection_id !== "all" &&
              `trong bộ sưu tập ${
                mockCollectionsData.find((c) => c.id === filters.collection_id)
                  ?.name || ""
              }`}
          </h2>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm sản phẩm
          </Link>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bộ sưu tập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá cơ bản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biến thể
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={
                                product.images[0]?.image_url ||
                                "https://via.placeholder.com/150?text=No+Image"
                              }
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.display_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            formatProductType(product.product_type).color
                          }`}
                        >
                          {formatProductType(product.product_type).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.collection_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.base_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            formatStatus(product.is_active).color
                          }`}
                        >
                          {formatStatus(product.is_active).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.variants.length > 0
                          ? product.variants.length
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              toggleProductStatus(product.id, product.is_active)
                            }
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              product.is_active
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {product.is_active ? "Ngừng bán" : "Kích hoạt"}
                          </button>
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                Không tìm thấy sản phẩm
              </p>
              <p className="mt-2 text-gray-500">
                Thử thay đổi các bộ lọc hoặc tạo sản phẩm mới.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
