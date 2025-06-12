import React from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
