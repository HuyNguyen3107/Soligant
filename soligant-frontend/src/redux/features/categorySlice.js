// src/redux/features/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryAPI from "../../api/categoryAPI";

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("Fetching categories with params:", params);
      const response = await categoryAPI.getCategories(params);
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải danh mục"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.createCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo danh mục"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.updateCategory(id, categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật danh mục"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await categoryAPI.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa danh mục"
      );
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    is_active: "all",
  },
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    forceStopLoading: (state) => {
      state.loading = false;
      state.error = "Timeout - có thể không có danh mục nào hoặc lỗi kết nối";
    },
    setMockData: (state) => {
      state.loading = false;
      state.error = null;
      state.categories = []; // Mock empty data để test UI
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Bây giờ action.payload là response.data
        console.log("Full action.payload:", action.payload);
        state.categories = action.payload.categories || [];
        console.log("Categories loaded:", state.categories.length);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.category.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setSelectedCategory,
  clearError,
  clearSelectedCategory,
  forceStopLoading,
  setMockData,
} = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesFilters = (state) => state.categories.filters;
export const selectSelectedCategory = (state) =>
  state.categories.selectedCategory;

export default categorySlice.reducer;
