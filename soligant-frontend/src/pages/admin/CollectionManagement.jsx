// src/pages/admin/CollectionManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  TagIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Mock collections data
const mockCollectionsData = [
  {
    id: "COL001",
    name: "Bộ sưu tập Xuân 2025",
    description:
      "Bộ sưu tập đặc biệt cho mùa xuân với các thiết kế tươi sáng và năng động",
    status: "active",
    visibility: "public",
    thumbnailUrl: "/images/collections/spring-2025.jpg",
    totalProducts: 25,
    createdAt: "2025-01-15T10:30:00",
    updatedAt: "2025-06-10T14:20:00",
    tags: ["xuân", "tươi sáng", "năng động"],
    featured: true,
  },
  {
    id: "COL002",
    name: "Phong cách Classic",
    description: "Những thiết kế kinh điển, thanh lịch phù hợp mọi lứa tuổi",
    status: "active",
    visibility: "public",
    thumbnailUrl: "/images/collections/classic.jpg",
    totalProducts: 18,
    createdAt: "2025-02-01T09:15:00",
    updatedAt: "2025-06-12T11:30:00",
    tags: ["classic", "thanh lịch", "kinh điển"],
    featured: false,
  },
  {
    id: "COL003",
    name: "Limited Edition 2025",
    description: "Bộ sưu tập giới hạn với số lượng có hạn",
    status: "active",
    visibility: "private",
    thumbnailUrl: "/images/collections/limited.jpg",
    totalProducts: 12,
    createdAt: "2025-03-10T16:45:00",
    updatedAt: "2025-06-08T13:15:00",
    tags: ["limited", "đặc biệt", "giới hạn"],
    featured: true,
  },
  {
    id: "COL004",
    name: "Bộ sưu tập Trẻ em",
    description:
      "Thiết kế dành riêng cho trẻ em với màu sắc và hình ảnh vui nhộn",
    status: "draft",
    visibility: "private",
    thumbnailUrl: "/images/collections/kids.jpg",
    totalProducts: 8,
    createdAt: "2025-04-20T12:00:00",
    updatedAt: "2025-06-05T15:45:00",
    tags: ["trẻ em", "vui nhộn", "màu sắc"],
    featured: false,
  },
];

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view

  // Load collections
  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCollections(mockCollectionsData);
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  // Filter collections
  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || collection.status === statusFilter;
    const matchesVisibility =
      visibilityFilter === "all" || collection.visibility === visibilityFilter;

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  // Handle modal
  const openModal = (mode, collection = null) => {
    setModalMode(mode);
    setSelectedCollection(collection);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCollection(null);
    setModalMode("create");
  };

  // Handle delete
  const handleDelete = (collectionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bộ sưu tập này?")) {
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    }
  };

  // Toggle featured
  const toggleFeatured = (collectionId) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, featured: !c.featured } : c
      )
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Nháp" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Lưu trữ" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Bộ sưu tập
          </h1>
          <p className="text-gray-600 mt-1">Quản lý các bộ sưu tập sản phẩm</p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm bộ sưu tập
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Tổng bộ sưu tập
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {collections.length}
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
              <p className="text-sm font-medium text-gray-500">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {collections.filter((c) => c.status === "active").length}
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Nổi bật</p>
              <p className="text-2xl font-bold text-gray-900">
                {collections.filter((c) => c.featured).length}
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {collections.reduce((sum, c) => sum + c.totalProducts, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Tìm kiếm bộ sưu tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="draft">Nháp</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
          <div>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả hiển thị</option>
              <option value="public">Công khai</option>
              <option value="private">Riêng tư</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              {/* Collection Image */}
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {collection.thumbnailUrl ? (
                  <img
                    src={collection.thumbnailUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDgwQzEwNy4xOCA4MCA3My4yNTQgMTEzLjI1NCA4MCA4MEg4MEM3Mi43NDYgODAgODAgNzIuNzQ2IDgwIDgwSDgwWk0xMjAgMTAwQzEyNy4yNTQgMTAwIDEyMCAxMDcuMjU0IDEyMCAxMDBIMTIwQzExMi43NDYgMTAwIDEyMCA5Mi43NDYgMTIwIDEwMEgxMjBaTTgwIDEyMEM4Ny4yNTQgMTIwIDgwIDEyNy4yNTQgODAgMTIwSDgwQzcyLjc0NiAxMjAgODAgMTEyLjc0NiA4MCAxMjBIODBaIiBmaWxsPSIjOUI5QkEzIi8+PC9zdmc+";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Featured Badge */}
                {collection.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full">
                      Nổi bật
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  {getStatusBadge(collection.status)}
                </div>
              </div>

              {/* Collection Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {collection.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      collection.visibility === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {collection.visibility === "public"
                      ? "Công khai"
                      : "Riêng tư"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {collection.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{collection.totalProducts} sản phẩm</span>
                  <span>
                    {new Date(collection.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {collection.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal("view", collection)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("edit", collection)}
                      className="p-1 text-blue-400 hover:text-blue-600"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Xóa"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleFeatured(collection.id)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      collection.featured
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {collection.featured ? "Bỏ nổi bật" : "Làm nổi bật"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredCollections.length === 0 && !loading && (
        <div className="text-center py-12">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy bộ sưu tập
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc tạo bộ sưu tập mới
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-10"
              onClick={closeModal}
            />

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-20">
              <div className="bg-white px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === "create" && "Thêm bộ sưu tập mới"}
                    {modalMode === "edit" && "Chỉnh sửa bộ sưu tập"}
                    {modalMode === "view" && "Chi tiết bộ sưu tập"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên bộ sưu tập
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCollection?.name || ""}
                        disabled={modalMode === "view"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        defaultValue={selectedCollection?.status || "draft"}
                        disabled={modalMode === "view"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="draft">Nháp</option>
                        <option value="archived">Lưu trữ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={selectedCollection?.description || ""}
                      disabled={modalMode === "view"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hiển thị
                      </label>
                      <select
                        defaultValue={
                          selectedCollection?.visibility || "public"
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nổi bật
                      </label>
                      <select
                        defaultValue={
                          selectedCollection?.featured ? "true" : "false"
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="false">Không</option>
                        <option value="true">Có</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedCollection?.tags?.join(", ") || ""}
                      disabled={modalMode === "view"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="vd: xuân, tươi sáng, năng động"
                    />
                  </div>

                  {modalMode !== "view" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh đại diện
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {modalMode === "view" ? "Đóng" : "Hủy"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {modalMode === "create" ? "Tạo" : "Cập nhật"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManagement;
