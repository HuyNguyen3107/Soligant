// src/redux/features/permissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import permissionAPI from "../../api/permissionAPI";
import { toast } from "react-toastify";

// Thunks
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.getPermissions(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải permissions"
      );
    }
  }
);

export const fetchPermissionById = createAsyncThunk(
  "permissions/fetchPermissionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.getPermissionById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải permission"
      );
    }
  }
);

export const createPermission = createAsyncThunk(
  "permissions/createPermission",
  async (permissionData, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.createPermission(permissionData);
      toast.success("Tạo permission thành công!");
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tạo permission";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/updatePermission",
  async ({ id, permissionData }, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.updatePermission(id, permissionData);
      toast.success("Cập nhật permission thành công!");
      return { id, ...response };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi cập nhật permission";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/deletePermission",
  async (id, { rejectWithValue }) => {
    try {
      await permissionAPI.deletePermission(id);
      toast.success("Xóa permission thành công!");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi xóa permission";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  error: null,
  filters: {
    include_roles: false,
    group_by_module: false,
  },
};

// Slice
const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch permission by ID
      .addCase(fetchPermissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPermission = action.payload.permission;
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create permission
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload.permission);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update permission
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.permissions.findIndex(
          (permission) => permission.id === action.payload.id
        );
        if (index !== -1) {
          state.permissions[index] = {
            ...state.permissions[index],
            ...action.payload.permission,
          };
        }
        if (
          state.selectedPermission &&
          state.selectedPermission.id === action.payload.id
        ) {
          state.selectedPermission = {
            ...state.selectedPermission,
            ...action.payload.permission,
          };
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete permission
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter(
          (permission) => permission.id !== action.payload
        );
        if (
          state.selectedPermission &&
          state.selectedPermission.id === action.payload
        ) {
          state.selectedPermission = null;
        }
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearSelectedPermission } =
  permissionSlice.actions;

// Selectors
export const selectPermissions = (state) => state.permissions.permissions;
export const selectSelectedPermission = (state) =>
  state.permissions.selectedPermission;
export const selectPermissionsLoading = (state) => state.permissions.loading;
export const selectPermissionsError = (state) => state.permissions.error;
export const selectPermissionsFilters = (state) => state.permissions.filters;

export default permissionSlice.reducer;
