import axios from "axios";
import { toast } from "react-toastify";
import {
  getSessionToken,
  getRefreshToken,
  setSessionToken,
  setRefreshToken,
  removeTokens,
} from "../utils/auth";

// Tạo instance axios
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 giây
});

// Interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          // Gọi API để lấy token mới
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:3000/api"
            }/auth/refresh-token`,
            { refreshToken }
          );

          const { tokens } = response.data;
          setSessionToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);

          // Cập nhật Authorization header và thực hiện lại request
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Nếu không refresh được token, logout user
        removeTokens();

        // Redirect đến trang đăng nhập nếu không đang ở trang đăng nhập
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }

    // Xử lý các lỗi chung
    const message = error.response?.data?.message || "Đã có lỗi xảy ra";

    // Chỉ hiển thị toast error nếu không phải lỗi auth và không bị disable
    if (!originalRequest?.disableToast && error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
