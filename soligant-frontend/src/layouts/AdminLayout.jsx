import React from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotificationCenter from "../components/admin/NotificationCenter";
import useRealtimeNotifications from "../hooks/useRealtimeNotifications";

const AdminLayout = () => {
  // Initialize realtime notifications
  useRealtimeNotifications();

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow flex flex-col">
          {/* Admin Header with Notifications */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-end">
              <NotificationCenter />
            </div>
          </div>

          <main className="flex-grow p-6 overflow-auto scrollbar-custom">
            <Outlet />
          </main>
        </div>
        <ScrollToTopButton />
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
