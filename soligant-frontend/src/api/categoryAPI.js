// src/api/categoryAPI.js
import axiosClient from "./axiosClient";

const categoryAPI = {
  // Lấy danh sách categories
  getCategories: async (params = {}) => {
    // Luôn bao gồm collections để đếm số lượng
    const queryParams = { ...params, include_collections: "true" };
    const response = await axiosClient.get("/categories", {
      params: queryParams,
    });
    return response.data;
  },

  // Lấy category theo ID
  getCategoryById: async (id) => {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data;
  },

  // Tạo category mới
  createCategory: async (categoryData) => {
    const response = await axiosClient.post("/categories", categoryData);
    return response.data;
  },

  // Cập nhật category
  updateCategory: async (id, categoryData) => {
    const response = await axiosClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Xóa category
  deleteCategory: async (id) => {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryAPI;
