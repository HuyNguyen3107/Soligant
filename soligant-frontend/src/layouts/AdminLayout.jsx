import React from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-6 overflow-auto scrollbar-custom">
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;
