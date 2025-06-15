// src/redux/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../../api/userAPI";

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUsers(params);
      return response;
    } catch (error) {
      // Chỉ show error cho lỗi server thực sự, không phải auth
      if (error.response?.status >= 500) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Lỗi server khi tải danh sách người dùng"
        );
      }
      // Ignore auth errors và client errors
      return rejectWithValue(null);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải thông tin người dùng"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userAPI.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tạo người dùng"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUser(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật người dùng"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ id, password }, { rejectWithValue }) => {
    try {
      const response = await userAPI.changePassword(id, password);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi đổi mật khẩu"
      );
    }
  }
);

export const changeMyPassword = createAsyncThunk(
  "users/changeMyPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userAPI.changeMyPassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi đổi mật khẩu cá nhân"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userAPI.deleteUser(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa người dùng"
      );
    }
  }
);

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {
    search: "",
    role: "",
    is_active: null,
    page: 1,
    limit: 10,
  },
};

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle new API response format
        const payload = action.payload;
        state.users = payload.data || [];
        state.total = payload.meta?.total || 0;
        state.totalPages = payload.meta?.totalPages || 0;
        state.currentPage = payload.meta?.currentPage || 1;
        // Clear any previous errors on successful load
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        // Không hiển thị error cho auth hoặc client-side issues
        // Chỉ hiển thị lỗi cho server errors thực sự
        if (
          action.payload &&
          typeof action.payload === "string" &&
          action.payload.includes("server")
        ) {
          state.error = action.payload;
        }
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Handle new API response format
        const newUser = action.payload.data;
        state.users.unshift(newUser);
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.user.id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        if (
          state.currentUser &&
          state.currentUser.id === action.payload.user.id
        ) {
          state.currentUser = action.payload.user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change my password
      .addCase(changeMyPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeMyPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeMyPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
        state.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError, clearCurrentUser } = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersTotal = (state) => state.users.total;
export const selectUsersTotalPages = (state) => state.users.totalPages;
export const selectUsersCurrentPage = (state) => state.users.currentPage;
export const selectUsersFilters = (state) => state.users.filters;

export default userSlice.reducer;
