import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/admin/Sidebar";

// Mock product data - should be fetched from API
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
        image_url: "https://via.placeholder.com/300?text=Version+1",
        is_primary: true,
      },
    ],
    created_at: "2025-05-01",
    updated_at: "2025-05-01",
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
        image_url: "https://via.placeholder.com/300?text=Version+2",
        is_primary: true,
      },
    ],
    created_at: "2025-05-01",
    updated_at: "2025-05-10",
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
        image_url: "https://via.placeholder.com/300?text=Hoa",
        is_primary: true,
      },
    ],
    created_at: "2025-05-02",
    updated_at: "2025-05-02",
  },
];

// Mock collections data for dropdown
const mockCollectionsData = [
  { id: "C001", name: "Tốt nghiệp" },
  { id: "C002", name: "Sinh nhật" },
  { id: "C003", name: "Valentine" },
  { id: "C004", name: "Đám cưới" },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isNew = productId === "new";

  // Auth check
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      window.location.href = "/admin/login";
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(isNew);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    display_name: "",
    product_type: "primary",
    base_price: 0,
    is_customizable: true,
    is_required: false,
    is_active: true,
    sort_order: 0,
    collection_id: "C001",
    variants: [],
    images: [],
  });

  const [newVariant, setNewVariant] = useState({
    variant_name: "",
    variant_value: "",
    price_adjustment: 0,
    is_default: false,
  });

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isNew) {
          // For new product, use default state
          setLoading(false);
          return;
        }

        // Find product in mock data
        const foundProduct = mockProductsData.find((p) => p.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Handle not found
          navigate("/admin/products");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isNew, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct({
      ...product,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (isNew) {
        // In real app, would create product in API
        console.log("Creating product:", product);
      } else {
        // In real app, would update product in API
        console.log("Updating product:", product);
      }

      // Navigate back to products list after save
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      setSaving(false);
    }
  };

  // Add new variant
  const handleAddVariant = () => {
    if (!newVariant.variant_name.trim() || !newVariant.variant_value.trim())
      return;

    const updatedVariants = [
      ...product.variants,
      {
        id: `temp-${Date.now()}`, // Temporary ID for UI
        ...newVariant,
        price_adjustment: parseFloat(newVariant.price_adjustment) || 0,
      },
    ];

    setProduct({ ...product, variants: updatedVariants });
    setNewVariant({
      variant_name: "",
      variant_value: "",
      price_adjustment: 0,
      is_default: false,
    });
  };

  // Remove variant
  const handleRemoveVariant = (variantId) => {
    const updatedVariants = product.variants.filter((v) => v.id !== variantId);
    setProduct({ ...product, variants: updatedVariants });
  };

  // Format to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/admin/products")}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {isNew ? "Thêm sản phẩm mới" : product.display_name}
              </h1>
            </div>

            {!isNew && (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    editMode
                      ? "bg-gray-200 text-gray-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {editMode ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                </button>

                {!editMode && (
                  <button
                    type="button"
                    onClick={() => {
                      // Toggle active status
                      setProduct({ ...product, is_active: !product.is_active });
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      product.is_active
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {product.is_active ? "Ngừng bán" : "Kích hoạt"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Main info section */}
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Thông tin cơ bản
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bộ sưu tập <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="collection_id"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={product.collection_id}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      {mockCollectionsData.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="product_type"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={product.product_type}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <option value="primary">Sản phẩm chính</option>
                      <option value="accessory">Phụ kiện</option>
                      <option value="combo">Combo</option>
                      <option value="background">Background</option>
                    </select>
                  </div>

                  {/* Internal Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên nội bộ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={product.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      placeholder="Tên nội bộ (chỉ hiển thị trong admin)"
                    />
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên hiển thị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="display_name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={product.display_name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      placeholder="Tên hiển thị cho khách hàng"
                    />
                  </div>

                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá cơ bản <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="base_price"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={product.base_price}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                        min="0"
                        step="1000"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">VND</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thứ tự sắp xếp
                    </label>
                    <input
                      type="number"
                      name="sort_order"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={product.sort_order}
                      onChange={handleChange}
                      disabled={!editMode}
                      min="0"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="is_customizable"
                      name="is_customizable"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={product.is_customizable}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    <label
                      htmlFor="is_customizable"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Cho phép tùy chỉnh (khách hàng có thể cá nhân hóa sản
                      phẩm)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="is_required"
                      name="is_required"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={product.is_required}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    <label
                      htmlFor="is_required"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Bắt buộc (khách hàng phải chọn sản phẩm này)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={product.is_active}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    <label
                      htmlFor="is_active"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Kích hoạt (sản phẩm hiển thị và có thể mua)
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants section */}
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Biến thể sản phẩm
                </h2>

                {editMode && (
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Thêm biến thể mới
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Loại biến thể
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newVariant.variant_name}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              variant_name: e.target.value,
                            })
                          }
                          placeholder="VD: Kích thước, Màu sắc..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Giá trị
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newVariant.variant_value}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              variant_value: e.target.value,
                            })
                          }
                          placeholder="VD: Nhỏ, Đỏ, S..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Điều chỉnh giá
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="number"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={newVariant.price_adjustment}
                            onChange={(e) =>
                              setNewVariant({
                                ...newVariant,
                                price_adjustment: e.target.value,
                              })
                            }
                            min="0"
                            step="1000"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">
                              VND
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={handleAddVariant}
                        >
                          Thêm biến thể
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <input
                        id="is_default"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={newVariant.is_default}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            is_default: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="is_default"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Đặt làm biến thể mặc định
                      </label>
                    </div>
                  </div>
                )}

                {product.variants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại biến thể
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá trị
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Điều chỉnh giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mặc định
                          </th>
                          {editMode && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.variants.map((variant) => (
                          <motion.tr
                            key={variant.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {variant.variant_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {variant.variant_value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(variant.price_adjustment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {variant.is_default ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Mặc định
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            {editMode && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveVariant(variant.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Xóa
                                </button>
                              </td>
                            )}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Chưa có biến thể nào cho sản phẩm này
                    </p>
                  </div>
                )}
              </div>

              {/* Images section */}
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Hình ảnh sản phẩm
                </h2>

                {editMode && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thêm hình ảnh mới
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        accept="image/*"
                        disabled
                      />
                      <button
                        type="button"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled
                      >
                        Tải lên
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      (Tính năng tải ảnh sẽ được triển khai sau khi kết nối API)
                    </p>
                  </div>
                )}

                {product.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {product.images.map((image) => (
                      <div
                        key={image.id}
                        className="relative bg-gray-100 rounded-md overflow-hidden"
                      >
                        <img
                          src={image.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Chính
                            </span>
                          </div>
                        )}
                        {editMode && (
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              disabled
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Chưa có hình ảnh nào cho sản phẩm này
                    </p>
                  </div>
                )}
              </div>

              {/* Actions section */}
              {editMode && (
                <div className="p-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isNew) {
                        navigate("/admin/products");
                      } else {
                        setEditMode(false);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {!isNew && !editMode && (
            <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Thông tin hệ thống
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mã sản phẩm:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {product.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Ngày tạo:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(product.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Cập nhật cuối:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(product.updated_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
