import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../../components/admin/AdminHeader";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  setFilters,
  clearError,
  forceStopLoading,
  setMockData,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoriesFilters,
} from "../../redux/features/categorySlice";
import { selectCurrentUser } from "../../redux/features/authSlice";
import {
  canAccessCategories,
  canCreateCategories,
  canUpdateCategories,
  canDeleteCategories,
  hasPermission,
  PERMISSIONS,
} from "../../utils/permissions";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  TagIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const filters = useSelector(selectCategoriesFilters);
  const currentUser = useSelector(selectCurrentUser);

  // Check permissions
  const canView = canAccessCategories(currentUser);
  const canCreate = canCreateCategories(currentUser);
  const canEdit = canUpdateCategories(currentUser);
  const canDelete = canDeleteCategories(currentUser);

  // If user doesn't have permission to view categories, show error
  if (!canView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <p>Bạn không có quyền truy cập trang quản lý danh mục.</p>
          </div>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.is_active);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    is_active: true,
    sort_order: 0,
  }); // Load categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debug log to see what we get from API
  useEffect(() => {
    if (categories && categories.length > 0) {
      console.log("Categories loaded:", categories);
    }
  }, [categories]);

  // Handle loading timeout
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn("Loading timeout - forcing stop");
        dispatch(forceStopLoading());
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timeoutId);
    }
  }, [loading, dispatch]);
  // Update filters in Redux when local state changes (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm, is_active: statusFilter }));
    }, 300); // 300ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, dispatch]);

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.is_active) ||
      (statusFilter === "inactive" && !category.is_active);

    return matchesSearch && matchesStatus;
  });

  // Handle modal
  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    if (category) {
      setFormData({
        name: category.name,
        display_name: category.display_name,
        is_active: category.is_active,
        sort_order: category.sort_order,
      });
    } else {
      setFormData({
        name: "",
        display_name: "",
        is_active: true,
        sort_order: categories.length,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setModalMode("create");
    setFormData({
      name: "",
      display_name: "",
      is_active: true,
      sort_order: 0,
    });
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        await dispatch(createCategory(formData)).unwrap();
      } else if (modalMode === "edit") {
        await dispatch(
          updateCategory({
            id: selectedCategory.id,
            categoryData: formData,
          })
        ).unwrap();
      }

      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      // Error is handled by Redux state
    }
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
      } catch (error) {
        console.error("Error deleting category:", error);
        // Error is handled by Redux state
      }
    }
  };

  // Handle toggle status
  const toggleStatus = async (categoryId, currentStatus) => {
    try {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        await dispatch(
          updateCategory({
            id: categoryId,
            categoryData: { ...category, is_active: !currentStatus },
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };
  // Handle sort order change
  const handleSortOrderChange = (categoryId, direction) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const currentOrder = category.sort_order;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    if (newOrder < 0 || newOrder >= categories.length) return;

    // Update sort order via API
    dispatch(
      updateCategory({
        id: categoryId,
        categoryData: { ...category, sort_order: newOrder },
      })
    );
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formatStatus = (isActive) => {
    return isActive
      ? { text: "Đang hoạt động", color: "bg-green-100 text-green-800" }
      : { text: "Tạm dừng", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="p-6">
      <AdminHeader title="Quản lý Danh mục" showLogo={false}>
        {canCreate && (
          <button
            onClick={() => openModal("create")}
            className="bg-soligant-primary hover:bg-soligant-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm danh mục
          </button>
        )}{" "}
      </AdminHeader>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-400 hover:text-red-600"
              >
                <svg
                  className="h-5 w-5"
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
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên danh mục..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
        </div>
      </div>{" "}
      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-soligant-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Đang tải danh mục...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <TagIcon className="mx-auto h-16 w-16 text-red-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">
              Có lỗi xảy ra
            </p>
            <p className="mt-2 text-gray-500 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={() => dispatch(fetchCategories())}
                className="px-4 py-2 bg-soligant-primary text-white rounded-lg hover:bg-soligant-primary-dark transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={() => dispatch(setMockData())}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Test với dữ liệu trống
              </button>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <TagIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">
              Chưa có danh mục nào
            </p>
            <p className="mt-2 text-gray-500 mb-4">
              Bắt đầu bằng cách tạo danh mục đầu tiên của bạn.
            </p>
            <button
              onClick={() => openModal("create")}
              className="px-4 py-2 bg-soligant-primary text-white rounded-lg hover:bg-soligant-primary-dark transition-colors inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tạo danh mục đầu tiên
            </button>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số bộ sưu tập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật cuối
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((category) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-soligant-primary-light flex items-center justify-center">
                              <TagIcon className="h-5 w-5 text-soligant-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {category.display_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {category.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            formatStatus(category.is_active).color
                          }`}
                        >
                          {formatStatus(category.is_active).text}
                        </span>
                      </td>{" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.collections?.length || 0} bộ sưu tập
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-900">
                            {category.sort_order + 1}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() =>
                                handleSortOrderChange(category.id, "up")
                              }
                              disabled={category.sort_order === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronUpIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleSortOrderChange(category.id, "down")
                              }
                              disabled={
                                category.sort_order === categories.length - 1
                              }
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronDownIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.updated_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              toggleStatus(category.id, category.is_active)
                            }
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              category.is_active
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {category.is_active ? "Tạm dừng" : "Kích hoạt"}
                          </button>{" "}
                          <button
                            onClick={() => openModal("view", category)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Xem
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => openModal("edit", category)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>{" "}
          </div>
        ) : (
          <div className="p-8 text-center">
            <TagIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">
              Không tìm thấy danh mục
            </p>
            <p className="mt-2 text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-md"
            >
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === "create" && "Thêm danh mục mới"}
                    {modalMode === "edit" && "Chỉnh sửa danh mục"}
                    {modalMode === "view" && "Chi tiết danh mục"}
                  </h3>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên danh mục (key) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "view"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:border-transparent disabled:bg-gray-50"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="graduation, birthday, wedding..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tên không dấu, viết thường, không chứa khoảng trắng
                    </p>
                  </div>
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên hiển thị *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "view"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:border-transparent disabled:bg-gray-50"
                      value={formData.display_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_name: e.target.value,
                        })
                      }
                      placeholder="Tốt nghiệp, Sinh nhật, Đám cưới..."
                    />
                  </div>
                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thứ tự sắp xếp
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={modalMode === "view"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:border-transparent disabled:bg-gray-50"
                      value={formData.sort_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sort_order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  {/* Status */}
                  {modalMode !== "view" && (
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_active: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-soligant-primary focus:ring-soligant-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Kích hoạt danh mục
                        </span>
                      </label>
                    </div>
                  )}{" "}
                  {/* View mode info */}
                  {modalMode === "view" && selectedCategory && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Trạng thái:
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              formatStatus(selectedCategory.is_active).color
                            }`}
                          >
                            {formatStatus(selectedCategory.is_active).text}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Số bộ sưu tập:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCategory.collections?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {modalMode === "view" ? "Đóng" : "Hủy"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-soligant-primary text-white rounded-lg hover:bg-soligant-primary-dark transition-colors"
                    >
                      {modalMode === "create" ? "Tạo" : "Cập nhật"}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
