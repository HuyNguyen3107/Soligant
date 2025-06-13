// src/components/admin/AdminHeader.jsx
import React from "react";
import Logo from "../ui/Logo";

/**
 * Admin Header component for admin pages
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Additional content (breadcrumbs, actions, etc.)
 * @param {boolean} props.showLogo - Whether to show logo (default: false)
 * @returns {JSX.Element}
 */
const AdminHeader = ({ title, children, showLogo = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showLogo && (
            <Logo
              variant="text"
              size="lg"
              color="primary"
              to="/"
              className="hover:opacity-80 transition-opacity"
            />
          )}
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-utm-avo">
                {title}
              </h1>
            </div>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-4">{children}</div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
