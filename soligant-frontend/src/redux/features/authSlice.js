import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import {
  setSessionToken,
  setRefreshToken,
  removeTokens,
  getSessionToken,
  isAuthenticated as checkTokenExists,
} from "../../utils/auth";
import { toast } from "react-toastify";

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // TODO: Thay thế bằng API call thật
      // Mock login process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (
        credentials.username === "admin" &&
        credentials.password === "Soligant@2023"
      ) {
        const mockTokens = {
          accessToken: "mock-access-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now(),
        };

        const mockUser = {
          id: 1,
          username: credentials.username,
          email: "admin@soligant.com",
          role: "admin",
          permissions: ["read", "write", "delete"],
        };

        // Lưu tokens
        setSessionToken(mockTokens.accessToken);
        setRefreshToken(mockTokens.refreshToken);

        toast.success("Đăng nhập thành công!");
        return { user: mockUser };
      } else {
        throw new Error("Thông tin đăng nhập không chính xác");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/auth/logout");
      removeTokens();
      toast.success("Đăng xuất thành công!");
      return null;
    } catch (error) {
      // Dù API có lỗi, vẫn xóa tokens ở client
      removeTokens();
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại"
      );
    }
  }
);

// Thunk để check auth khi app khởi động
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Kiểm tra token có tồn tại không
      if (!checkTokenExists()) {
        return rejectWithValue("No token found");
      }

      // TODO: Gọi API để verify token và lấy user info
      // Tạm thời mock response
      const mockUser = {
        id: 1,
        username: "admin",
        email: "admin@soligant.com",
        role: "admin",
        permissions: ["read", "write", "delete"],
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return { user: mockUser };
    } catch (error) {
      // Token không hợp lệ, xóa tokens
      removeTokens();
      return rejectWithValue("Token invalid");
    }
  }
);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Bắt đầu với loading = true để check auth
  error: null,
  authChecked: false, // Flag để biết đã check auth chưa
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.authChecked = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setAuthChecked } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;

export default authSlice.reducer;
