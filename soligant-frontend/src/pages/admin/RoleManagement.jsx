// src/pages/admin/RoleManagement.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../../components/admin/AdminHeader";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  clearError,
  selectRoles,
  selectRolesLoading,
  selectRolesError,
} from "../../redux/features/roleSlice";
import {
  fetchPermissions,
  selectPermissions,
} from "../../redux/features/permissionSlice";
import { selectCurrentUser } from "../../redux/features/authSlice";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const RoleManagement = () => {
  const dispatch = useDispatch();
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);
  const permissions = useSelector(selectPermissions);
  const currentUser = useSelector(selectCurrentUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  // Check permissions
  const canView = hasPermission(currentUser, PERMISSIONS.USERS.VIEW);
  const canCreate = hasPermission(currentUser, PERMISSIONS.USERS.CREATE);
  const canEdit = hasPermission(currentUser, PERMISSIONS.USERS.UPDATE);
  const canDelete = hasPermission(currentUser, PERMISSIONS.USERS.DELETE);

  // If user doesn't have permission to view roles, show error
  if (!canView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <p>Bạn không có quyền truy cập trang quản lý vai trò.</p>
          </div>
        </div>
      </div>
    );
  }

  // Load data
  useEffect(() => {
    dispatch(
      fetchRoles({ include_permissions: "true", include_users: "true" })
    );
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Filter roles
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle modal
  const openModal = (mode, role = null) => {
    setModalMode(mode);
    setSelectedRole(role);
    if (role) {
      setFormData({
        name: role.name,
        permissions: role.permissions ? role.permissions.map((p) => p.id) : [],
      });
    } else {
      setFormData({
        name: "",
        permissions: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setFormData({ name: "", permissions: [] });
    dispatch(clearError());
  };

  // Handle form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      if (modalMode === "create") {
        await dispatch(createRole(formData)).unwrap();
      } else if (modalMode === "edit") {
        await dispatch(
          updateRole({ id: selectedRole.id, roleData: formData })
        ).unwrap();
      }
      closeModal();
      // Reload data
      dispatch(
        fetchRoles({ include_permissions: "true", include_users: "true" })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (roleId, roleName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa role "${roleName}"?`)) {
      try {
        await dispatch(deleteRole(roleId)).unwrap();
        // Reload data
        dispatch(
          fetchRoles({ include_permissions: "true", include_users: "true" })
        );
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module || permission.name.split(".")[0];
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  const getSystemRoleColor = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isSystemRole = (roleName) => {
    return ["admin", "manager", "employee"].includes(roleName);
  };

  return (
    <div className="p-6">
      <AdminHeader title="Quản lý Vai trò" showLogo={false}>
        {canCreate && (
          <button
            onClick={() => openModal("create")}
            className="bg-soligant-primary hover:bg-soligant-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm vai trò
          </button>
        )}
      </AdminHeader>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soligant-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách vai trò ({filteredRoles.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soligant-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        ) : filteredRoles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quyền hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
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
                {filteredRoles.map((role) => (
                  <motion.tr
                    key={role.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">
                              {role.name}
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getSystemRoleColor(
                                role.name
                              )}`}
                            >
                              {isSystemRole(role.name)
                                ? "Hệ thống"
                                : "Tùy chỉnh"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {role.permissions ? role.permissions.length : 0} quyền
                      </div>
                      <div className="text-sm text-gray-500">
                        {role.permissions && role.permissions.length > 0 ? (
                          <span className="truncate">
                            {role.permissions
                              .slice(0, 3)
                              .map((p) => p.name)
                              .join(", ")}
                            {role.permissions.length > 3 && "..."}
                          </span>
                        ) : (
                          "Chưa có quyền"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {role.users ? role.users.length : 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(role.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal("view", role)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Xem
                        </button>
                        {canEdit && !isSystemRole(role.name) && (
                          <button
                            onClick={() => openModal("edit", role)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Sửa
                          </button>
                        )}
                        {canDelete && !isSystemRole(role.name) && (
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
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
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">
              Không tìm thấy vai trò
            </p>
            <p className="mt-2 text-gray-500">Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create" && "Thêm vai trò mới"}
                  {modalMode === "edit" && "Chỉnh sửa vai trò"}
                  {modalMode === "view" && "Chi tiết vai trò"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalMode === "view" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên vai trò
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRole?.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quyền hạn ({selectedRole?.permissions?.length || 0})
                      </label>
                      <div className="space-y-2">
                        {selectedRole?.permissions?.map((permission) => (
                          <span
                            key={permission.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                          >
                            {permission.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Người dùng ({selectedRole?.users?.length || 0})
                      </label>
                      <div className="space-y-1">
                        {selectedRole?.users?.map((user) => (
                          <div key={user.id} className="text-sm text-gray-600">
                            {user.full_name} ({user.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên vai trò *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-soligant-primary focus:border-transparent"
                        placeholder="Nhập tên vai trò"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quyền hạn
                      </label>
                      <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {Object.entries(groupedPermissions).map(
                          ([module, modulePermissions]) => (
                            <div key={module} className="space-y-2">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {module}
                              </h4>
                              <div className="pl-4 space-y-1">
                                {modulePermissions.map((permission) => (
                                  <label
                                    key={permission.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions.includes(
                                        permission.id
                                      )}
                                      onChange={() =>
                                        handlePermissionChange(permission.id)
                                      }
                                      className="rounded border-gray-300 text-soligant-primary focus:ring-soligant-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                      {permission.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-soligant-primary border border-transparent rounded-md hover:bg-soligant-primary-dark disabled:opacity-50"
                      >
                        {loading
                          ? "Đang xử lý..."
                          : modalMode === "create"
                          ? "Tạo"
                          : "Cập nhật"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleManagement;
