// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  selectCurrentUser,
  selectAuthChecked,
} from "../../redux/features/authSlice";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import {
  fetchUsers,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  setFilters,
  clearError,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersTotal,
  selectUsersTotalPages,
  selectUsersCurrentPage,
  selectUsersFilters,
} from "../../redux/features/userSlice";
import { fetchRoles, selectRoles } from "../../redux/features/roleSlice";
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const UserManagement = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const authChecked = useSelector(selectAuthChecked);

  // Redux selectors
  const users = useSelector(selectUsers);
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const total = useSelector(selectUsersTotal);
  const totalPages = useSelector(selectUsersTotalPages);
  const currentPage = useSelector(selectUsersCurrentPage);
  const filters = useSelector(selectUsersFilters);

  // Local state for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state for create user
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    roles: [],
    is_active: true,
  });

  // Form state for edit user
  const [editForm, setEditForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    roles: [],
    is_active: true,
  });

  // Form state for password change
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // Check permissions
  const canViewUsers = hasPermission(currentUser, PERMISSIONS.USERS.VIEW);
  const canCreateUsers = hasPermission(currentUser, PERMISSIONS.USERS.CREATE);
  const canUpdateUsers = hasPermission(currentUser, PERMISSIONS.USERS.UPDATE);
  const canDeleteUsers = hasPermission(currentUser, PERMISSIONS.USERS.DELETE);

  // Load data on mount
  useEffect(() => {
    if (authChecked && canViewUsers && currentUser) {
      console.log("🔄 Loading users and roles...");
      dispatch(clearError());
      dispatch(fetchUsers(filters));
      dispatch(fetchRoles());
    }
  }, [dispatch, authChecked, canViewUsers, currentUser, filters]);

  // Debug logs
  useEffect(() => {
    console.log("🔍 UserManagement state:", {
      usersCount: users?.length || 0,
      rolesCount: roles?.length || 0,
      loading,
      error,
      authChecked,
      currentUser: currentUser?.email,
      canCreateUsers,
    });
  }, [users, roles, loading, error, authChecked, currentUser, canCreateUsers]);

  // Handle create user
  const handleOpenCreateModal = useCallback(() => {
    console.log("🆕 Opening create user modal");
    setCreateForm({
      email: "",
      password: "",
      full_name: "",
      phone: "",
      roles: [],
      is_active: true,
    });
    setShowCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    console.log("❌ Closing create user modal");
    setShowCreateModal(false);
    setCreateForm({
      email: "",
      password: "",
      full_name: "",
      phone: "",
      roles: [],
      is_active: true,
    });
  }, []);

  const handleCreateFormChange = useCallback((field, value) => {
    console.log(`📝 Updating create form field: ${field} = ${value}`);
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  }, []);
  const handleCreateSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("🚀 Starting create user submission");
      console.log("📋 Create form data:", createForm);

      // Enhanced validation
      const errors = [];

      if (!createForm.email.trim()) {
        errors.push("Email là bắt buộc");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
        errors.push("Email không hợp lệ");
      }

      if (!createForm.password.trim()) {
        errors.push("Mật khẩu là bắt buộc");
      } else if (createForm.password.length < 6) {
        errors.push("Mật khẩu phải có ít nhất 6 ký tự");
      }

      if (!createForm.full_name.trim()) {
        errors.push("Họ tên là bắt buộc");
      }

      if (createForm.phone && !/^[0-9+\-\s()]+$/.test(createForm.phone)) {
        errors.push("Số điện thoại không hợp lệ");
      }
      if (errors.length > 0) {
        toast.error("Lỗi validation:\n" + errors.join("\n"));
        return;
      }

      try {
        console.log("📤 Dispatching createUser action...");
        const result = await dispatch(createUser(createForm)).unwrap();
        console.log("✅ Create user successful:", result);

        // Close modal and refresh list
        setShowCreateModal(false);
        setCreateForm({
          email: "",
          password: "",
          full_name: "",
          phone: "",
          roles: [],
          is_active: true,
        }); // Refresh users list
        dispatch(fetchUsers(filters));

        toast.success("Tạo người dùng thành công!");
      } catch (error) {
        console.error("❌ Create user failed:", error);
        const errorMessage =
          typeof error === "string"
            ? error
            : error.message || "Có lỗi xảy ra khi tạo người dùng";
        toast.error(`Lỗi: ${errorMessage}`);
      }
    },
    [createForm, dispatch, filters]
  );

  // Handle edit user
  const handleOpenEditModal = useCallback((user) => {
    console.log("✏️ Opening edit modal for user:", user.id);
    setSelectedUser(user);
    setEditForm({
      email: user.email || "",
      full_name: user.full_name || "",
      phone: user.phone || "",
      roles: user.roles || [],
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    console.log("❌ Closing edit user modal");
    setShowEditModal(false);
    setSelectedUser(null);
    setEditForm({
      email: "",
      full_name: "",
      phone: "",
      roles: [],
      is_active: true,
    });
  }, []);

  const handleEditFormChange = useCallback((field, value) => {
    console.log(`📝 Updating edit form field: ${field} = ${value}`);
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEditSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("🚀 Starting edit user submission");
      console.log("📋 Edit form data:", editForm);
      if (!selectedUser) {
        toast.error("Không tìm thấy người dùng để cập nhật");
        return;
      }

      try {
        console.log("📤 Dispatching updateUser action...");
        const result = await dispatch(
          updateUser({
            id: selectedUser.id,
            userData: editForm,
          })
        ).unwrap();
        console.log("✅ Update user successful:", result);

        // Close modal and refresh list
        setShowEditModal(false);
        setSelectedUser(null);
        setEditForm({
          email: "",
          full_name: "",
          phone: "",
          roles: [],
          is_active: true,
        }); // Refresh users list
        dispatch(fetchUsers(filters));

        toast.success("Cập nhật người dùng thành công!");
      } catch (error) {
        console.error("❌ Update user failed:", error);
        toast.error(`Lỗi khi cập nhật người dùng: ${error.message || error}`);
      }
    },
    [editForm, selectedUser, dispatch, filters]
  );

  // Handle view user
  const handleOpenViewModal = useCallback((user) => {
    console.log("👁️ Opening view modal for user:", user.id);
    setSelectedUser(user);
    setShowViewModal(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    console.log("❌ Closing view user modal");
    setShowViewModal(false);
    setSelectedUser(null);
  }, []);

  // Handle delete user
  const handleOpenDeleteModal = useCallback((user) => {
    console.log("🗑️ Opening delete modal for user:", user.id);
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    console.log("❌ Closing delete user modal");
    setShowDeleteModal(false);
    setSelectedUser(null);
  }, []);
  const handleDeleteSubmit = useCallback(async () => {
    if (!selectedUser) {
      toast.error("Không tìm thấy người dùng để xóa");
      return;
    }

    try {
      console.log("🗑️ Deleting user:", selectedUser.id);
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      console.log("✅ Delete user successful");

      // Close modal and refresh list
      setShowDeleteModal(false);
      setSelectedUser(null); // Refresh users list
      dispatch(fetchUsers(filters));

      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("❌ Delete user failed:", error);
      toast.error(`Lỗi khi xóa người dùng: ${error.message || error}`);
    }
  }, [selectedUser, dispatch, filters]);

  // Handle password change
  const handleOpenPasswordModal = useCallback((user) => {
    console.log("🔑 Opening password modal for user:", user.id);
    setSelectedUser(user);
    setPasswordForm({
      password: "",
      confirmPassword: "",
    });
    setShowPasswordModal(true);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    console.log("❌ Closing password modal");
    setShowPasswordModal(false);
    setSelectedUser(null);
    setPasswordForm({
      password: "",
      confirmPassword: "",
    });
  }, []);

  const handlePasswordFormChange = useCallback((field, value) => {
    console.log(`📝 Updating password form field: ${field}`);
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("🚀 Starting password change submission");
      if (!selectedUser) {
        toast.error("Không tìm thấy người dùng để đổi mật khẩu");
        return;
      }

      if (passwordForm.password !== passwordForm.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }

      if (passwordForm.password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      try {
        console.log("📤 Dispatching changePassword action...");
        await dispatch(
          changePassword({
            id: selectedUser.id,
            password: passwordForm.password,
          })
        ).unwrap();
        console.log("✅ Change password successful");

        // Close modal
        setShowPasswordModal(false);
        setSelectedUser(null);
        setPasswordForm({
          password: "",
          confirmPassword: "",
        });
        toast.success("Đổi mật khẩu thành công!");
      } catch (error) {
        console.error("❌ Change password failed:", error);
        toast.error(`Lỗi khi đổi mật khẩu: ${error.message || error}`);
      }
    },
    [passwordForm, selectedUser, dispatch]
  );

  // Handle search and filters
  const handleSearch = useCallback(
    (value) => {
      console.log("🔍 Searching for:", value);
      dispatch(setFilters({ search: value, page: 1 }));
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      console.log(`🔽 Filter changed: ${key} = ${value}`);
      dispatch(setFilters({ [key]: value, page: 1 }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page) => {
      console.log("📄 Page changed to:", page);
      dispatch(setFilters({ page }));
    },
    [dispatch]
  );

  // Show loading while auth is being checked
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have permission to view users, show error
  if (!canViewUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <p>Bạn không có quyền truy cập trang quản lý người dùng.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Hoạt động
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Không hoạt động
        </span>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        {canCreateUsers && (
          <button
            onClick={handleOpenCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Thêm người dùng
          </button>
        )}
      </div>
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <select
            value={filters.role || ""}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filters.is_active?.toString() || ""}
            onChange={(e) =>
              handleFilterChange(
                "is_active",
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa có vai trò
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenViewModal(user)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {canUpdateUsers && (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenPasswordModal(user)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Đổi mật khẩu"
                          >
                            <KeyIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {canDeleteUsers && user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * 10 + 1} đến{" "}
            {Math.min(currentPage * 10, total)} trong số {total} kết quả
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}{" "}
      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          data-testid="create-user-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tạo người dùng mới
              </h3>
              <form
                onSubmit={handleCreateSubmit}
                data-testid="create-user-form"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) =>
                        handleCreateFormChange("email", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) =>
                        handleCreateFormChange("password", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      value={createForm.full_name}
                      onChange={(e) =>
                        handleCreateFormChange("full_name", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={createForm.phone}
                      onChange={(e) =>
                        handleCreateFormChange("phone", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <select
                      multiple
                      value={createForm.roles}
                      onChange={(e) => {
                        const selectedRoles = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        handleCreateFormChange("roles", selectedRoles);
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Giữ Ctrl/Cmd để chọn nhiều vai trò
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.is_active}
                      onChange={(e) =>
                        handleCreateFormChange("is_active", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Kích hoạt tài khoản
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? "Đang tạo..." : "Tạo người dùng"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* EDIT USER MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chỉnh sửa người dùng
              </h3>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) =>
                        handleEditFormChange("full_name", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        handleEditFormChange("phone", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <select
                      multiple
                      value={editForm.roles}
                      onChange={(e) => {
                        const selectedRoles = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        handleEditFormChange("roles", selectedRoles);
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) =>
                        handleEditFormChange("is_active", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Kích hoạt tài khoản
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* VIEW USER MODAL */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin người dùng
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.phone || "Chưa có"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedUser.roles && selectedUser.roles.length > 0 ? (
                      selectedUser.roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        Chưa có vai trò
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.is_active)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tạo
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseViewModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PASSWORD CHANGE MODAL */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Đổi mật khẩu cho {selectedUser.full_name}
              </h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu mới *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) =>
                        handlePasswordFormChange("password", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        handlePasswordFormChange(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={handleClosePasswordModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận xóa
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <strong>{selectedUser.full_name}</strong> không? Hành động này
                không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
