// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../ui/Loading";
import {
  hasRole,
  hasPermission,
  hasAnyPermission,
} from "../../utils/permissions";

/**
 * Component bảo vệ routes cần authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string[]} props.requiredRoles - Required roles để access route
 * @param {string[]} props.requiredPermissions - Required permissions để access route
 * @param {string[]} props.anyPermissions - User cần có ít nhất 1 trong các permissions này
 * @param {boolean} props.adminOnly - Chỉ admin mới access được
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  anyPermissions = [],
  adminOnly = false,
}) => {
  const location = useLocation();
  const { user, isAuthenticated, loading, authChecked } = useSelector(
    (state) => state.auth
  );

  // Hiển thị loading trong khi check auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loading size="large" />
          <p className="mt-4 text-gray-600 font-utm-avo">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (adminOnly && !hasRole(user, "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <p>Bạn cần quyền Admin để truy cập trang này.</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Check specific roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(user, role));

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <h2 className="text-xl font-bold mb-2">Không đủ quyền</h2>
              <p>
                Bạn cần một trong các quyền: {requiredRoles.join(", ")} để truy
                cập trang này.
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  // Check specific permissions (all required)
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(user, permission)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <h2 className="text-xl font-bold mb-2">Không đủ quyền</h2>
              <p>
                Bạn cần có tất cả các quyền: {requiredPermissions.join(", ")} để
                truy cập trang này.
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  // Check any permissions (at least one required)
  if (anyPermissions.length > 0) {
    const hasAnyRequiredPermission = hasAnyPermission(user, anyPermissions);

    if (!hasAnyRequiredPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <h2 className="text-xl font-bold mb-2">Không đủ quyền</h2>
              <p>
                Bạn cần có ít nhất một trong các quyền:{" "}
                {anyPermissions.join(", ")} để truy cập trang này.
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  // Đã authenticated và có quyền
  return children;
};

export default ProtectedRoute;
