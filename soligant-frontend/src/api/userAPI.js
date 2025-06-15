import axiosClient from "./axiosClient";

const userAPI = {
  // Lấy danh sách users
  getUsers: async (params = {}) => {
    const response = await axiosClient.get("/users", { params });
    return response.data;
  },

  // Lấy user theo ID
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData) => {
    const response = await axiosClient.post("/users", userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data;
  },
  // Đổi mật khẩu (admin đổi cho user khác)
  changePassword: async (id, passwordData) => {
    const response = await axiosClient.put(
      `/users/${id}/change-password`,
      passwordData
    );
    return response.data;
  },

  // Đổi mật khẩu cá nhân (user đổi mật khẩu của chính mình)
  changeMyPassword: async (passwordData) => {
    const response = await axiosClient.put(
      `/users/change-my-password`,
      passwordData
    );
    return response.data;
  },

  // Xóa user
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },

  // Gán role cho user
  assignRole: async (userId, roleId) => {
    const response = await axiosClient.post(`/users/${userId}/roles`, {
      roleId,
    });
    return response.data;
  },

  // Xóa role khỏi user
  removeRole: async (userId, roleId) => {
    const response = await axiosClient.delete(
      `/users/${userId}/roles/${roleId}`
    );
    return response.data;
  },
};

export default userAPI;
