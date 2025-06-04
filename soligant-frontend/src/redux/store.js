import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import customizationReducer from "./features/customizationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customization: customizationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
