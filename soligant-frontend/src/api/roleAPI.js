// src/api/roleAPI.js
import axiosClient from "./axiosClient";

const roleAPI = {
  // Lấy danh sách roles
  getRoles: async (params = {}) => {
    const response = await axiosClient.get("/roles", { params });
    return response.data;
  },

  // Lấy role theo ID
  getRoleById: async (id) => {
    const response = await axiosClient.get(`/roles/${id}`);
    return response.data;
  },

  // Tạo role mới
  createRole: async (roleData) => {
    const response = await axiosClient.post("/roles", roleData);
    return response.data;
  },

  // Cập nhật role
  updateRole: async (id, roleData) => {
    const response = await axiosClient.put(`/roles/${id}`, roleData);
    return response.data;
  },

  // Xóa role
  deleteRole: async (id) => {
    const response = await axiosClient.delete(`/roles/${id}`);
    return response.data;
  },
};

export default roleAPI;
