// src/api/permissionAPI.js
import axiosClient from "./axiosClient";

const permissionAPI = {
  // Lấy danh sách permissions
  getPermissions: async (params = {}) => {
    const response = await axiosClient.get("/permissions", { params });
    return response.data;
  },

  // Lấy permission theo ID
  getPermissionById: async (id) => {
    const response = await axiosClient.get(`/permissions/${id}`);
    return response.data;
  },

  // Tạo permission mới
  createPermission: async (permissionData) => {
    const response = await axiosClient.post("/permissions", permissionData);
    return response.data;
  },

  // Cập nhật permission
  updatePermission: async (id, permissionData) => {
    const response = await axiosClient.put(
      `/permissions/${id}`,
      permissionData
    );
    return response.data;
  },

  // Xóa permission
  deletePermission: async (id) => {
    const response = await axiosClient.delete(`/permissions/${id}`);
    return response.data;
  },
};

export default permissionAPI;
