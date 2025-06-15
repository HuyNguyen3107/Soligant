// src/pages/admin/BackgroundManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Mock backgrounds data - Đơn giản chỉ các thông tin cơ bản
const mockBackgroundsData = [
  {
    id: "BG001",
    name: "Gradient Sunset",
    description: "Gradient màu hoàng hôn tuyệt đẹp",
    imageUrl: "/images/backgrounds/gradient-sunset.jpg",
    createdAt: "2025-01-15T10:30:00",
  },
  {
    id: "BG002",
    name: "Ocean Waves",
    description: "Hình nền sóng biển xanh mát",
    imageUrl: "/images/backgrounds/ocean-waves.jpg",
    createdAt: "2025-02-01T09:15:00",
  },
  {
    id: "BG003",
    name: "Abstract Geometry",
    description: "Hình học trừu tượng hiện đại",
    imageUrl: "/images/backgrounds/abstract-geometry.jpg",
    createdAt: "2025-03-10T16:45:00",
  },
  {
    id: "BG004",
    name: "Vintage Floral",
    description: "Hoa văn vintage cổ điển",
    imageUrl: "/images/backgrounds/vintage-floral.jpg",
    createdAt: "2025-03-20T12:00:00",
  },
  {
    id: "BG005",
    name: "Minimalist White",
    description: "Nền trắng tối giản, sạch sẽ",
    imageUrl: "/images/backgrounds/minimalist-white.jpg",
    createdAt: "2025-04-01T08:30:00",
  },
  {
    id: "BG006",
    name: "Forest Green",
    description: "Nền xanh lá cây tự nhiên",
    imageUrl: "/images/backgrounds/forest-green.jpg",
    createdAt: "2025-04-15T14:20:00",
  },
];

const BackgroundManagement = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedBackground, setSelectedBackground] = useState(null);

  // Load backgrounds
  useEffect(() => {
    const loadBackgrounds = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setBackgrounds(mockBackgroundsData);
      } catch (error) {
        console.error("Error loading backgrounds:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBackgrounds();
  }, []);

  // Filter backgrounds
  const filteredBackgrounds = backgrounds.filter((bg) => {
    const matchesSearch =
      bg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bg.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle modal
  const openModal = (mode, background = null) => {
    setModalMode(mode);
    setSelectedBackground(background);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBackground(null);
    setModalMode("create");
  };

  // Handle delete
  const handleDelete = (backgroundId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa background này?")) {
      setBackgrounds((prev) => prev.filter((bg) => bg.id !== backgroundId));
    }
  };

  // Handle save background
  const handleSaveBackground = (backgroundData) => {
    if (modalMode === "create") {
      const newBackground = {
        ...backgroundData,
        id: "BG" + Date.now().toString().slice(-3),
        createdAt: new Date().toISOString(),
      };
      setBackgrounds((prev) => [newBackground, ...prev]);
    } else if (modalMode === "edit") {
      setBackgrounds((prev) =>
        prev.map((bg) =>
          bg.id === selectedBackground.id ? { ...bg, ...backgroundData } : bg
        )
      );
    }
    closeModal();
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
            Quản lý Background
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý hình nền và background cho sản phẩm
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm background
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Tổng backgrounds
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {backgrounds.length}
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
              <CloudArrowUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Mới thêm tuần này
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  backgrounds.filter((bg) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(bg.createdAt) > weekAgo;
                  }).length
                }
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
              <EyeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Đang hiển thị</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredBackgrounds.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm background..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Backgrounds Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBackgrounds.map((background) => (
              <motion.div
                key={background.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={background.imageUrl}
                    alt={background.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTMwIDExMEwxNDAgMTAwTDE2MCAxMjBIMTMwVjExMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                    }}
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal("view", background)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => openModal("edit", background)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(background.id)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Xóa"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {background.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {background.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {background.id}</span>
                    <span>
                      {new Date(background.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredBackgrounds.length === 0 && (
            <div className="text-center py-12">
              <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Không tìm thấy background nào"
                  : "Chưa có background nào"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <BackgroundModal
          mode={modalMode}
          background={selectedBackground}
          onSave={handleSaveBackground}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Background Modal Component
const BackgroundModal = ({ mode, background, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: background?.name || "",
    description: background?.description || "",
    imageUrl: background?.imageUrl || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onSave(formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isViewMode = mode === "view";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "create" && "Thêm Background"}
              {mode === "edit" && "Chỉnh sửa Background"}
              {mode === "view" && "Chi tiết Background"}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Image */}
            {formData.imageUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xem trước:
                </label>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTMwIDExMEwxNDAgMTAwTDE2MCAxMjBIMTMwVjExMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên background <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên background..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả background..."
                disabled={isViewMode}
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL hình ảnh
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                disabled={isViewMode}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isViewMode ? "Đóng" : "Hủy"}
              </button>
              {!isViewMode && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {mode === "create" ? "Thêm" : "Cập nhật"}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BackgroundManagement;
