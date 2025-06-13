// src/redux/middleware/raceConditionMiddleware.js
import { toast } from "react-toastify";
import {
  operationLockManager,
  createOperationKey,
} from "../../utils/raceConditionUtils";

/**
 * Redux middleware để detect và prevent race conditions trong Redux actions
 */
const raceConditionMiddleware = (store) => (next) => (action) => {
  // List of actions cần protect
  const protectedActions = [
    "customization/setVersion",
    "customization/setFullCombo",
    "customization/removeFullCombo",
    "customization/setAccessoryCombo",
    "customization/removeAccessoryCombo",
    "customization/addAdditionalAccessory",
    "customization/removeAdditionalAccessory",
    "customization/setAdditionalPet",
    "customization/recalculatePrice",
  ];

  // Chỉ protect các actions quan trọng
  if (protectedActions.includes(action.type)) {
    const userId = "redux_user"; // In real app, get from auth state
    const operationKey = createOperationKey(userId, action.type);

    // Check if operation is already in progress
    if (operationLockManager.isLocked(operationKey)) {
      console.warn(`Redux action ${action.type} blocked due to race condition`);

      // Show warning toast (với debounce để không spam)
      const toastId = `redux_race_${action.type}`;
      if (!toast.isActive(toastId)) {
        toast.warn("Thao tác đang được xử lý, vui lòng đợi...", {
          toastId,
          autoClose: 2000,
        });
      }

      return; // Block the action
    }

    // Lock the operation
    operationLockManager.lock(operationKey, 1000); // Lock for 1 second

    // Execute action
    const result = next(action);

    // Auto unlock after a short delay
    setTimeout(() => {
      operationLockManager.unlock(operationKey);
    }, 100);

    return result;
  }

  // For non-protected actions, pass through normally
  return next(action);
};

export default raceConditionMiddleware;
