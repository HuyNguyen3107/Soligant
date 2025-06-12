// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import CollectionsPage from "../pages/CollectionsPage";
import ProductCustomizePage from "../pages/ProductCustomizePage";
import BackgroundCustomizePage from "../pages/BackgroundCustomizePage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrderSearchPage from "../pages/OrderSearchPage";
import CopyOrderPage from "../pages/CopyOrderPage";
import OrderFinalizePage from "../pages/OrderFinalizePage";
import OrderTracking from "../pages/OrderTracking";
import NotFoundPage from "../pages/NotFoundPage";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OrderManagement from "../pages/admin/OrderManagement";
import OrderDetail from "../pages/admin/OrderDetail";
import ProductManagement from "../pages/admin/ProductManagement";
import ProductDetail from "../pages/admin/ProductDetail";
import InventoryManagement from "../pages/admin/InventoryManagement";
import ReportsAnalytics from "../pages/admin/ReportsAnalytics";
import UserManagement from "../pages/admin/UserManagement";
import Settings from "../pages/admin/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Các route công khai */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route
          path="collections/:collectionId/customize"
          element={<ProductCustomizePage />}
        />
        <Route
          path="collections/:collectionId/background"
          element={<BackgroundCustomizePage />}
        />
        <Route path="checkout" element={<CheckoutPage />} />{" "}
        <Route path="order-search" element={<OrderSearchPage />} />
        <Route path="copy-order/:orderId" element={<CopyOrderPage />} />
        <Route path="finalize-order/:orderId" element={<OrderFinalizePage />} />
        <Route path="order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
      </Route>
      {/* Admin Routes - Không dùng PublicLayout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<OrderManagement />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/admin/products/:productId" element={<ProductDetail />} />
      <Route path="/admin/inventory" element={<InventoryManagement />} />
      <Route path="/admin/reports" element={<ReportsAnalytics />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/settings" element={<Settings />} />

      {/* Route không tìm thấy */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
