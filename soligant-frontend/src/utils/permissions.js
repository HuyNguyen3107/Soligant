// src/utils/permissions.js

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasRole = (user, roleName) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName);
};

/**
 * Kiểm tra user có permission cụ thể không
 */
export const hasPermission = (user, permissionName) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permissionName);
};

/**
 * Kiểm tra user có bất kỳ permission nào trong danh sách không
 */
export const hasAnyPermission = (user, permissionNames) => {
  if (!user || !user.permissions) return false;
  return permissionNames.some((permission) =>
    user.permissions.includes(permission)
  );
};

/**
 * Kiểm tra user có tất cả permissions trong danh sách không
 */
export const hasAllPermissions = (user, permissionNames) => {
  if (!user || !user.permissions) return false;
  return permissionNames.every((permission) =>
    user.permissions.includes(permission)
  );
};

/**
 * Kiểm tra user có quyền admin không
 */
export const isAdmin = (user) => {
  return hasRole(user, "admin");
};

/**
 * Kiểm tra user có quyền manager không
 */
export const isManager = (user) => {
  return hasRole(user, "manager") || isAdmin(user);
};

/**
 * Kiểm tra user có quyền truy cập categories không
 */
export const canAccessCategories = (user) => {
  return hasAnyPermission(user, [
    "categories.view",
    "categories.create",
    "categories.update",
    "categories.delete",
  ]);
};

/**
 * Kiểm tra user có quyền tạo categories không
 */
export const canCreateCategories = (user) => {
  return hasPermission(user, "categories.create");
};

/**
 * Kiểm tra user có quyền cập nhật categories không
 */
export const canUpdateCategories = (user) => {
  return hasPermission(user, "categories.update");
};

/**
 * Kiểm tra user có quyền xóa categories không
 */
export const canDeleteCategories = (user) => {
  return hasPermission(user, "categories.delete");
};

// Export permissions constants
export const PERMISSIONS = {
  USERS: {
    VIEW: "users.view",
    CREATE: "users.create",
    UPDATE: "users.update",
    DELETE: "users.delete",
  },
  CATEGORIES: {
    VIEW: "categories.view",
    CREATE: "categories.create",
    UPDATE: "categories.update",
    DELETE: "categories.delete",
  },
  COLLECTIONS: {
    VIEW: "collections.view",
    CREATE: "collections.create",
    UPDATE: "collections.update",
    DELETE: "collections.delete",
  },
  PRODUCTS: {
    VIEW: "products.view",
    CREATE: "products.create",
    UPDATE: "products.update",
    DELETE: "products.delete",
  },
  ORDERS: {
    VIEW: "orders.view",
    CREATE: "orders.create",
    UPDATE: "orders.update",
    DELETE: "orders.delete",
    ASSIGN: "orders.assign",
  },
  INVENTORY: {
    VIEW: "inventory.view",
    UPDATE: "inventory.update",
  },
  STATISTICS: {
    VIEW: "statistics.view",
  },
};

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};
