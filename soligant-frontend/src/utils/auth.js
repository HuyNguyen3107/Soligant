import Cookies from "js-cookie";

// Thiết lập domain và options cho cookies
const cookieOptions = {
  secure: import.meta.env.PROD, // Chỉ sử dụng HTTPS trong production
  sameSite: "strict", // Ngăn chặn CSRF attacks
  path: "/", // Có thể truy cập từ mọi đường dẫn
  expires: 7, // Hết hạn sau 7 ngày
};

// Lưu token vào cookies (frontend cookie cho session token)
export const setSessionToken = (token) => {
  Cookies.set("session_token", token, cookieOptions);
};

// Lưu refresh token vào cookies
export const setRefreshToken = (token) => {
  Cookies.set("refresh_token", token, {
    ...cookieOptions,
    expires: 30, // Refresh token có thời hạn dài hơn
  });
};

// Lấy token
export const getSessionToken = () => {
  return Cookies.get("session_token");
};

// Lấy refresh token
export const getRefreshToken = () => {
  return Cookies.get("refresh_token");
};

// Xóa tokens khi logout
export const removeTokens = () => {
  Cookies.remove("session_token", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!getSessionToken();
};
