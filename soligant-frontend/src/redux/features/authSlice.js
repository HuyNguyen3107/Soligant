import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../../api/authAPI";
import {
  setSessionToken,
  setRefreshToken,
  removeTokens,
  getSessionToken,
  getRefreshToken,
  isAuthenticated as checkTokenExists,
} from "../../utils/auth";
import { toast } from "react-toastify";

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("🔄 Login attempt:", { username: credentials.username });

      // Gọi API đăng nhập thật
      const response = await authAPI.login({
        email: credentials.username, // Frontend dùng username, backend nhận email
        password: credentials.password,
      });

      console.log("✅ Login success:", {
        user: response.user?.email,
        hasTokens: !!(
          response.tokens?.accessToken && response.tokens?.refreshToken
        ),
      });

      // Lưu tokens
      setSessionToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);

      // Verify tokens were saved
      const savedSession = getSessionToken();
      const savedRefresh = getRefreshToken();
      console.log("💾 Tokens saved:", {
        sessionSaved: !!savedSession,
        refreshSaved: !!savedRefresh,
        cookies: document.cookie,
      });

      toast.success("Đăng nhập thành công!");
      return { user: response.user };
    } catch (error) {
      console.error("❌ Login failed:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
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

// Thunk để refresh token
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return rejectWithValue("No refresh token found");
      }

      const response = await authAPI.refreshToken(refreshToken);

      // Lưu tokens mới
      setSessionToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);

      return response.tokens;
    } catch (error) {
      // Refresh failed, logout user
      removeTokens();
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
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

      // Gọi API để verify token và lấy user info
      const response = await authAPI.getCurrentUser();
      return response; // response.user sẽ được xử lý ở fulfilled case
    } catch (error) {
      // Token không hợp lệ, xóa tokens
      removeTokens();
      return rejectWithValue("Token invalid");
    }
  }
);

// Thunk để khởi tạo auth state từ Cookies
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      // Đợi một chút để đảm bảo cookies đã được load
      await new Promise((resolve) => setTimeout(resolve, 100));

      const token = getSessionToken();
      const refreshToken = getRefreshToken();

      console.log("🔍 initializeAuth - Debug tokens:", {
        token: token ? `${token.substring(0, 20)}...` : null,
        refreshToken: refreshToken
          ? `${refreshToken.substring(0, 20)}...`
          : null,
        allCookies: document.cookie,
      });

      if (!token || !refreshToken) {
        console.log("❌ initializeAuth - No tokens found");
        return rejectWithValue("No tokens found");
      }

      // Thử lấy thông tin user hiện tại
      console.log("🔄 initializeAuth - Calling getCurrentUser...");
      const response = await authAPI.getCurrentUser();
      console.log("✅ initializeAuth - Success:", response);
      return { user: response.user };
    } catch (error) {
      console.error("❌ initializeAuth - Error:", error);
      // Token không hợp lệ, xóa bỏ
      removeTokens();
      return rejectWithValue("Invalid tokens");
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
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })

      // Refresh token cases
      .addCase(refreshAuthToken.pending, (state) => {
        // Don't show loading for background refresh
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        // Token refreshed successfully, user remains authenticated
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })

      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.authChecked = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
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
