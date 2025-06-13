// src/pages/admin/UserManagement.jsx
import React, { useState } from "react";
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Mock data cho users
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn Admin",
      email: "admin@soligant.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "2024-01-15 10:30:00",
      createdAt: "2024-01-01",
      avatar: null,
      permissions: ["all"],
    },
    {
      id: 2,
      name: "Trần Thị Manager",
      email: "manager@soligant.com",
      role: "Manager",
      status: "active",
      lastLogin: "2024-01-15 09:15:00",
      createdAt: "2024-01-02",
      avatar: null,
      permissions: [
        "order_management",
        "product_management",
        "inventory_management",
      ],
    },
    {
      id: 3,
      name: "Lê Văn Staff",
      email: "staff@soligant.com",
      role: "Staff",
      status: "active",
      lastLogin: "2024-01-14 16:45:00",
      createdAt: "2024-01-05",
      avatar: null,
      permissions: ["order_view", "product_view"],
    },
    {
      id: 4,
      name: "Phạm Thị Inactive",
      email: "inactive@soligant.com",
      role: "Staff",
      status: "inactive",
      lastLogin: "2024-01-10 14:20:00",
      createdAt: "2024-01-03",
      avatar: null,
      permissions: ["order_view"],
    },
    {
      id: 5,
      name: "Lê Văn Suspended",
      email: "suspended@soligant.com",
      role: "Staff",
      status: "suspended",
      lastLogin: "2024-01-08 11:30:00",
      createdAt: "2024-01-04",
      avatar: null,
      permissions: ["order_view"],
    },
    {
      id: 6,
      name: "Hoàng Thị Pending",
      email: "pending@soligant.com",
      role: "Manager",
      status: "pending",
      lastLogin: null,
      createdAt: "2024-01-15",
      avatar: null,
      permissions: [],
    },
  ];

  // Mock data cho roles
  const roles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["all"],
      userCount: 1,
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Manager",
      description: "Management level access to most features",
      permissions: [
        "dashboard_view",
        "order_management",
        "product_management",
        "inventory_management",
        "reports_view",
        "user_view",
      ],
      userCount: 1,
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "Staff",
      description: "Basic staff access for daily operations",
      permissions: [
        "dashboard_view",
        "order_view",
        "product_view",
        "inventory_view",
      ],
      userCount: 2,
      createdAt: "2024-01-01",
    },
  ];

  // Available permissions
  const availablePermissions = [
    { id: "dashboard_view", name: "Dashboard View", category: "General" },
    { id: "order_view", name: "View Orders", category: "Orders" },
    { id: "order_management", name: "Manage Orders", category: "Orders" },
    { id: "product_view", name: "View Products", category: "Products" },
    { id: "product_management", name: "Manage Products", category: "Products" },
    { id: "inventory_view", name: "View Inventory", category: "Inventory" },
    {
      id: "inventory_management",
      name: "Manage Inventory",
      category: "Inventory",
    },
    { id: "reports_view", name: "View Reports", category: "Reports" },
    { id: "user_view", name: "View Users", category: "Users" },
    { id: "user_management", name: "Manage Users", category: "Users" },
    { id: "system_settings", name: "System Settings", category: "System" },
  ];

  // Function để get status styling và text
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return {
          className: "bg-green-100 text-green-800",
          icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
          text: "Hoạt động",
        };
      case "inactive":
        return {
          className: "bg-gray-100 text-gray-800",
          icon: <XCircleIcon className="h-3 w-3 mr-1" />,
          text: "Không hoạt động",
        };
      case "suspended":
        return {
          className: "bg-red-100 text-red-800",
          icon: <ExclamationTriangleIcon className="h-3 w-3 mr-1" />,
          text: "Tạm khóa",
        };
      case "pending":
        return {
          className: "bg-yellow-100 text-yellow-800",
          icon: <ExclamationTriangleIcon className="h-3 w-3 mr-1" />,
          text: "Chờ xác nhận",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          icon: <XCircleIcon className="h-3 w-3 mr-1" />,
          text: status,
        };
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  const handleDeleteUser = (userId) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      console.log("Deleting user:", userId);
      // Implement delete logic
    }
  };

  const handleToggleUserStatus = (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    const action = newStatus === "active" ? "kích hoạt" : "tạm khóa";

    if (confirm(`Bạn có chắc chắn muốn ${action} người dùng ${user.name}?`)) {
      console.log(
        `Changing user ${user.id} status from ${user.status} to ${newStatus}`
      );
      // Implement status toggle logic
      // Có thể dispatch action để update user status
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const handleDeleteRole = (roleId) => {
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
      console.log("Deleting role:", roleId);
      // Implement delete logic
    }
  };

  const tabs = [
    { id: "users", name: "Users", icon: UserGroupIcon },
    { id: "roles", name: "Roles & Permissions", icon: ShieldCheckIcon },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowUserModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
          <button
            onClick={() => {
              setSelectedRole(null);
              setShowRoleModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Add Role
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>{" "}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                  <option value="pending">Chờ xác nhận</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>{" "}
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-900">
                        Hoạt động
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {users.filter((u) => u.status === "active").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircleIcon className="h-8 w-8 text-gray-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Không hoạt động
                      </p>
                      <p className="text-2xl font-bold text-gray-600">
                        {users.filter((u) => u.status === "inactive").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-900">
                        Tạm khóa
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {users.filter((u) => u.status === "suspended").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-900">
                        Chờ xác nhận
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {users.filter((u) => u.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>{" "}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const statusStyle = getStatusStyle(user.status);
                              return (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.className}`}
                                >
                                  {statusStyle.icon}
                                  {statusStyle.text}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.lastLogin).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>{" "}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user)}
                                className={`p-1 rounded ${
                                  user.status === "active"
                                    ? "text-yellow-600 hover:text-yellow-900"
                                    : "text-green-600 hover:text-green-900"
                                }`}
                                title={
                                  user.status === "active"
                                    ? "Tạm khóa người dùng"
                                    : "Kích hoạt người dùng"
                                }
                              >
                                {user.status === "active" ? (
                                  <ExclamationTriangleIcon className="h-4 w-4" />
                                ) : (
                                  <CheckCircleIcon className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Chỉnh sửa người dùng"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Xóa người dùng"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              {/* Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {role.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit role"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete role"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-medium">{role.userCount}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Permissions:</span>
                        <span className="font-medium">
                          {role.permissions.includes("all")
                            ? "All"
                            : role.permissions.length}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Key Permissions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission === "all"
                                ? "All Permissions"
                                : permission.replace("_", " ")}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Permissions Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(
                    availablePermissions.reduce((acc, permission) => {
                      if (!acc[permission.category])
                        acc[permission.category] = [];
                      acc[permission.category].push(permission);
                      return acc;
                    }, {})
                  ).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="text-sm text-gray-600"
                          >
                            • {permission.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal (simplified) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedUser ? "Edit User" : "Add New User"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedUser?.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedUser?.email || ""}
                />
              </div>{" "}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Super Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái hoạt động
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedUser?.status || "active"}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                  <option value="pending">Chờ xác nhận</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal (simplified) */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedRole ? "Edit Role" : "Add New Role"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedRole?.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  defaultValue={selectedRole?.description || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        defaultChecked={selectedRole?.permissions.includes(
                          permission.id
                        )}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {permission.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
