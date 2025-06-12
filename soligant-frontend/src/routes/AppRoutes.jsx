// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import CollectionsPage from "../pages/CollectionsPage";
import ProductCustomizePage from "../pages/ProductCustomizePage";
import BackgroundCustomizePage from "../pages/BackgroundCustomizePage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import NotFoundPage from "../pages/NotFoundPage";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OrderManagement from "../pages/admin/OrderManagement";
import OrderDetail from "../pages/admin/OrderDetail";
import ProductManagement from "../pages/admin/ProductManagement";
import ProductDetail from "../pages/admin/ProductDetail";

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
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
      </Route>{" "}
      {/* Admin Routes - Không dùng PublicLayout */}{" "}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<OrderManagement />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/admin/products/:productId" element={<ProductDetail />} />
      {/* Route không tìm thấy */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
