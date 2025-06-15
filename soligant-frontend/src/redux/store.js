import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import customizationReducer from "./features/customizationSlice";
import notificationReducer from "./features/notificationSlice";
import orderManagementReducer from "./features/orderManagementSlice";
import shippingReducer from "./features/shippingSlice";
import categoryReducer from "./features/categorySlice";
import roleReducer from "./features/roleSlice";
import permissionReducer from "./features/permissionSlice";
import userReducer from "./features/userSlice";
import raceConditionMiddleware from "./middleware/raceConditionMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customization: customizationReducer,
    notifications: notificationReducer,
    orderManagement: orderManagementReducer,
    shipping: shippingReducer,
    categories: categoryReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(raceConditionMiddleware),
});

export default store;
