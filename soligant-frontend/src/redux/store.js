import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import customizationReducer from "./features/customizationSlice";
import notificationReducer from "./features/notificationSlice";
import orderManagementReducer from "./features/orderManagementSlice";
import raceConditionMiddleware from "./middleware/raceConditionMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customization: customizationReducer,
    notifications: notificationReducer,
    orderManagement: orderManagementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(raceConditionMiddleware),
});

export default store;
