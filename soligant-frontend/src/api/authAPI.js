// src/api/authAPI.js
import axiosClient from "./axiosClient";

const authAPI = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axiosClient.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  // Đăng xuất
  logout: async (refreshToken) => {
    const response = await axiosClient.post("/auth/logout", {
      refreshToken,
    });
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },

  // Verify token (kiểm tra token có hợp lệ không)
  verifyToken: async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },

  // Debug: Lấy refresh tokens (chỉ development)
  getRefreshTokens: async () => {
    const response = await axiosClient.get("/auth/debug/tokens");
    return response.data;
  },

  // Logout tất cả devices
  logoutAll: async () => {
    const response = await axiosClient.post("/auth/logout-all");
    return response.data;
  },
};

export default authAPI;
