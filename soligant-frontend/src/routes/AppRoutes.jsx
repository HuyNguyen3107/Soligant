// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import CollectionsPage from "../pages/CollectionsPage";
import ProductCustomizePage from "../pages/ProductCustomizePage";
import BackgroundCustomizePage from "../pages/BackgroundCustomizePage";
import NotFoundPage from "../pages/NotFoundPage";

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
        {/* Thêm routes khác sau */}
      </Route>

      {/* Route không tìm thấy */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
