// src/redux/features/roleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roleAPI from "../../api/roleAPI";
import { toast } from "react-toastify";

// Thunks
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await roleAPI.getRoles(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Lỗi khi tải roles"
      );
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  "roles/fetchRoleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleAPI.getRoleById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Lỗi khi tải role"
      );
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await roleAPI.createRole(roleData);
      toast.success("Tạo role thành công!");
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Lỗi khi tạo role";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const response = await roleAPI.updateRole(id, roleData);
      toast.success("Cập nhật role thành công!");
      return { id, ...response };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi cập nhật role";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      await roleAPI.deleteRole(id);
      toast.success("Xóa role thành công!");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Lỗi khi xóa role";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
  filters: {
    include_permissions: false,
    include_users: false,
  },
};

// Slice
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch role by ID
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload.role;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload.role);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.roles[index] = {
            ...state.roles[index],
            ...action.payload.role,
          };
        }
        if (state.selectedRole && state.selectedRole.id === action.payload.id) {
          state.selectedRole = {
            ...state.selectedRole,
            ...action.payload.role,
          };
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        if (state.selectedRole && state.selectedRole.id === action.payload) {
          state.selectedRole = null;
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearSelectedRole } = roleSlice.actions;

// Selectors
export const selectRoles = (state) => state.roles.roles;
export const selectSelectedRole = (state) => state.roles.selectedRole;
export const selectRolesLoading = (state) => state.roles.loading;
export const selectRolesError = (state) => state.roles.error;
export const selectRolesFilters = (state) => state.roles.filters;

export default roleSlice.reducer;
