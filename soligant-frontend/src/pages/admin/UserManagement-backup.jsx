// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectAuthChecked,
} from "../../redux/features/authSlice";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  setFilters,
  clearError,
  clearCurrentUser,
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

// Optimized UserModal component to prevent unnecessary re-renders
const UserModal = memo(
  ({
    show,
    modalMode,
    userForm,
    roles,
    loading,
    onClose,
    onSubmit,
    onEmailChange,
    onPasswordChange,
    onFullNameChange,
    onPhoneChange,
    onRolesChange,
    onIsActiveChange,
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalMode === "create"
                ? "Tạo người dùng mới"
                : modalMode === "edit"
                ? "Chỉnh sửa người dùng"
                : "Thông tin người dùng"}
            </h3>

            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={onEmailChange}
                    disabled={modalMode === "view" || modalMode === "edit"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                {modalMode === "create" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={onPasswordChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={userForm.full_name}
                    onChange={onFullNameChange}
                    disabled={modalMode === "view"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={onPhoneChange}
                    disabled={modalMode === "view"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <select
                    multiple
                    value={userForm.roles}
                    onChange={onRolesChange}
                    disabled={modalMode === "view"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
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
                    checked={userForm.is_active}
                    onChange={onIsActiveChange}
                    disabled={modalMode === "view"}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Kích hoạt
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : modalMode === "create"
                      ? "Tạo"
                      : "Cập nhật"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

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

  // Debug log to check data
  console.log("🔍 UserManagement state:", {
    usersCount: users?.length || 0,
    rolesCount: roles?.length || 0,
    loading,
    error,
    authChecked,
    currentUser: currentUser?.email,
  });

  // Local state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'

  // Form state
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    roles: [],
    is_active: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // Check permissions
  const canViewUsers = hasPermission(currentUser, PERMISSIONS.USERS.VIEW);
  const canCreateUsers = hasPermission(currentUser, PERMISSIONS.USERS.CREATE);
  const canUpdateUsers = hasPermission(currentUser, PERMISSIONS.USERS.UPDATE);
  const canDeleteUsers = hasPermission(currentUser, PERMISSIONS.USERS.DELETE); // Load data on mount
  useEffect(() => {
    // Clear any previous errors when component mounts successfully
    if (authChecked && canViewUsers && currentUser) {
      dispatch(clearError());
    }

    // Chỉ gọi API khi auth đã được check và có quyền
    if (authChecked && canViewUsers && currentUser) {
      console.log("🔄 Loading users and roles...");
      dispatch(fetchUsers(filters));
      dispatch(fetchRoles());
    }
  }, [dispatch, authChecked, canViewUsers, currentUser]); // Removed filters to prevent loop
  // Handle filter changes separately
  useEffect(() => {
    if (authChecked && canViewUsers && currentUser) {
      dispatch(fetchUsers(filters));
    }
  }, [dispatch, filters]); // Only depend on filters
  // Optimized form handlers with useCallback - individual handlers to prevent re-render
  const handleEmailChange = useCallback((e) => {
    setUserForm((prev) => ({ ...prev, email: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setUserForm((prev) => ({ ...prev, password: e.target.value }));
  }, []);

  const handleFullNameChange = useCallback((e) => {
    setUserForm((prev) => ({ ...prev, full_name: e.target.value }));
  }, []);

  const handlePhoneChange = useCallback((e) => {
    setUserForm((prev) => ({ ...prev, phone: e.target.value }));
  }, []);

  const handleRolesChange = useCallback((e) => {
    const selectedRoles = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUserForm((prev) => ({ ...prev, roles: selectedRoles }));
  }, []);

  const handleIsActiveChange = useCallback((e) => {
    setUserForm((prev) => ({ ...prev, is_active: e.target.checked }));
  }, []);

  // Password form handlers
  const handleNewPasswordChange = useCallback((e) => {
    setPasswordForm((prev) => ({ ...prev, password: e.target.value }));
  }, []);
  const handleConfirmPasswordChange = useCallback((e) => {
    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
  }, []);

  // Modal handlers
  const handleCloseUserModal = useCallback(() => {
    setShowUserModal(false);
  }, []);

  // Handle search
  const handleSearch = (value) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  }; // Handle user modal - optimized to prevent unnecessary re-renders
  const openUserModal = useCallback((mode, user = null) => {
    console.log("🔄 Opening user modal with mode:", mode, "user:", user);
    setModalMode(mode);
    setSelectedUser(user);

    // Only update form if user data is different or it's a new modal
    const newFormData = user
      ? {
          email: user.email || "",
          password: "",
          full_name: user.full_name || "",
          phone: user.phone || "",
          roles: user.roles || [],
          is_active: user.is_active !== undefined ? user.is_active : true,
        }
      : {
          email: "",
          password: "",
          full_name: "",
          phone: "",
          roles: [],
          is_active: true,
        };

    console.log("📝 Setting form data:", newFormData);
    setUserForm(newFormData);
    setShowUserModal(true);
    console.log("✅ Modal opened");
  }, []);

  // Handle password modal
  const openPasswordModal = useCallback((user) => {
    setSelectedUser(user);
    setPasswordForm({
      password: "",
      confirmPassword: "",
    });
    setShowPasswordModal(true);
  }, []);

  // Handle delete modal
  const openDeleteModal = useCallback((user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []); // Handle form submission
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "view") return;

    console.log("🚀 handleUserSubmit called with:", { modalMode, userForm });

    try {
      if (modalMode === "create") {
        console.log("📝 Dispatching createUser action...");
        const result = await dispatch(createUser(userForm)).unwrap();
        console.log("✅ createUser successful:", result);
      } else if (modalMode === "edit") {
        console.log("📝 Dispatching updateUser action...");
        const result = await dispatch(
          updateUser({ id: selectedUser.id, userData: userForm })
        ).unwrap();
        console.log("✅ updateUser successful:", result);
      }

      console.log("🎉 Closing modal and refreshing list...");
      setShowUserModal(false);
      dispatch(fetchUsers(filters)); // Refresh list
    } catch (error) {
      console.error("❌ Error submitting user form:", error);
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error message:", error?.message);
      console.error("❌ Full error object:", error);

      // Show detailed error to user
      let errorMessage = "Đã xảy ra lỗi";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(
        `Lỗi khi ${
          modalMode === "create" ? "tạo" : "cập nhật"
        } người dùng: ${errorMessage}`
      );
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      await dispatch(
        changePassword({
          id: selectedUser.id,
          password: passwordForm.password,
        })
      ).unwrap();
      setShowPasswordModal(false);
      alert("Đổi mật khẩu thành công");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setShowDeleteModal(false);
      alert("Xóa người dùng thành công");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

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
        </div>{" "}
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !filters.search ||
      user.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = !filters.role || user.roles?.includes(filters.role);

    const matchesStatus =
      filters.is_active === null || user.is_active === filters.is_active;

    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const PasswordModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Đổi mật khẩu cho {selectedUser?.full_name}
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            {" "}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={handleNewPasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{selectedUser?.full_name}</strong> không? Hành động này
            không thể hoàn tác.
          </p>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        {canCreateUsers && (
          <button
            onClick={() => openUserModal("create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Thêm người dùng
          </button>
        )}
      </div>
      {/* Error message */}{" "}
      {/* Error message - chỉ hiển thị lỗi thực sự, không phải auth errors */}
      {error &&
        authChecked &&
        error !== null &&
        error !== "No token found" &&
        error !== "Token invalid" && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Tên, email..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={
                filters.is_active === null ? "" : filters.is_active.toString()
              }
              onChange={(e) =>
                handleFilterChange(
                  "is_active",
                  e.target.value === "" ? null : e.target.value === "true"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>
      {/* Users table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openUserModal("view", user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {canUpdateUsers && (
                        <>
                          <button
                            onClick={() => openUserModal("edit", user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPasswordModal(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Đổi mật khẩu"
                          >
                            <KeyIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {canDeleteUsers && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Empty state */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy người dùng nào.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * filters.limit + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * filters.limit, total)}
                  </span>{" "}
                  trong <span className="font-medium">{total}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Modals */}{" "}
      <UserModal
        show={showUserModal}
        modalMode={modalMode}
        userForm={userForm}
        roles={roles}
        loading={loading}
        onClose={handleCloseUserModal}
        onSubmit={handleUserSubmit}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onFullNameChange={handleFullNameChange}
        onPhoneChange={handlePhoneChange}
        onRolesChange={handleRolesChange}
        onIsActiveChange={handleIsActiveChange}
      />
      {showPasswordModal && <PasswordModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default UserManagement;
