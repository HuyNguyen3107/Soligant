// src/services/canvaService.js
import axios from "axios";
import { createMockCanvaDesign } from "./mockCanvaService";

// Tạo các biến môi trường mặc định hoặc sử dụng giá trị từ import.meta.env nếu dùng Vite
// hoặc dùng window.env nếu bạn cấu hình biến môi trường ở client side
const API_URL =
  import.meta?.env?.VITE_API_URL ||
  window?.env?.API_URL ||
  "http://localhost:3000/api";

const USE_MOCK_API = true; // Trong trường hợp này luôn sử dụng mock API

/**
 * Tạo design mới trên Canva dựa trên template và dữ liệu người dùng
 */
export const createCanvaDesign = async (designData) => {
  // Luôn sử dụng mock API trong môi trường hiện tại
  if (USE_MOCK_API) {
    return createMockCanvaDesign(designData);
  }

  try {
    const response = await axios.post(
      `${API_URL}/canva/create-design`,
      designData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Canva design:", error);
    throw error;
  }
};

/**
 * Lấy URL preview của design
 */
export const getCanvaDesignPreview = async (designId) => {
  // Luôn sử dụng mock data trong môi trường hiện tại
  if (USE_MOCK_API) {
    return {
      success: true,
      previewUrl: `https://via.placeholder.com/800x600?text=Canva+Design+Preview+${designId}`,
    };
  }

  try {
    const response = await axios.get(
      `${API_URL}/canva/design-preview/${designId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting Canva design preview:", error);
    throw error;
  }
};

export default {
  createCanvaDesign,
  getCanvaDesignPreview,
};
