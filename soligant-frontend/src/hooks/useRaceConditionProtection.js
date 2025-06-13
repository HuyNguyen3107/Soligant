// src/hooks/useRaceConditionProtection.js
import { useCallback, useRef, useEffect } from "react";
import {
  operationLockManager,
  createOperationKey,
  generateUniqueId,
  sessionTracker,
  withRaceConditionProtection,
} from "../utils/raceConditionUtils";

/**
 * Hook để protect functions khỏi race conditions
 * @param {string} operationName - Tên của operation
 * @param {Object} options - Configuration options
 * @returns {Object} Protected functions và utilities
 */
export const useRaceConditionProtection = (operationName, options = {}) => {
  const {
    userId = "anonymous",
    debounceDelay = 300,
    lockTimeout = 5000,
    enableDebounce = true,
    enableLock = true,
    enableRequestTracking = true,
    enableSessionTracking = false,
  } = options;

  const userIdRef = useRef(userId);
  const mountedRef = useRef(true);

  useEffect(() => {
    userIdRef.current = userId;
    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  /**
   * Protect một async function
   * @param {Function} asyncFn - Function cần protect
   * @param {string} specificOperation - Specific operation name (optional)
   * @returns {Function} Protected function
   */
  const protectFunction = useCallback(
    (asyncFn, specificOperation = "") => {
      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );

      return withRaceConditionProtection(operationKey, asyncFn, {
        debounceDelay,
        lockTimeout,
        enableDebounce,
        enableLock,
        enableRequestTracking,
      });
    },
    [
      operationName,
      debounceDelay,
      lockTimeout,
      enableDebounce,
      enableLock,
      enableRequestTracking,
    ]
  );

  /**
   * Protect một function với immediate execution (không debounce)
   * @param {Function} asyncFn - Function cần protect
   * @param {string} specificOperation - Specific operation name (optional)
   * @returns {Function} Protected function
   */
  const protectImmediate = useCallback(
    (asyncFn, specificOperation = "") => {
      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );

      return withRaceConditionProtection(operationKey, asyncFn, {
        debounceDelay: 0,
        lockTimeout,
        enableDebounce: false,
        enableLock,
        enableRequestTracking,
      });
    },
    [operationName, lockTimeout, enableLock, enableRequestTracking]
  );

  /**
   * Check xem operation có đang bị lock không
   * @param {string} specificOperation - Specific operation name (optional)
   * @returns {boolean}
   */
  const isOperationLocked = useCallback(
    (specificOperation = "") => {
      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );
      return operationLockManager.isLocked(operationKey);
    },
    [operationName]
  );

  /**
   * Manually lock một operation
   * @param {string} specificOperation - Specific operation name (optional)
   * @param {number} timeout - Lock timeout
   */
  const lockOperation = useCallback(
    (specificOperation = "", timeout = lockTimeout) => {
      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );
      operationLockManager.lock(operationKey, timeout);
    },
    [operationName, lockTimeout]
  );

  /**
   * Manually unlock một operation
   * @param {string} specificOperation - Specific operation name (optional)
   */
  const unlockOperation = useCallback(
    (specificOperation = "") => {
      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );
      operationLockManager.unlock(operationKey);
    },
    [operationName]
  );

  /**
   * Save operation state to session (nếu enabled)
   * @param {string} specificOperation - Specific operation name (optional)
   * @param {Object} state - State to save
   */
  const saveOperationState = useCallback(
    (specificOperation = "", state) => {
      if (!enableSessionTracking) return;

      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );
      sessionTracker.setOperationState(operationKey, state);
    },
    [operationName, enableSessionTracking]
  );

  /**
   * Load operation state from session (nếu enabled)
   * @param {string} specificOperation - Specific operation name (optional)
   * @returns {Object|null} Saved state or null
   */
  const loadOperationState = useCallback(
    (specificOperation = "") => {
      if (!enableSessionTracking) return null;

      const operationKey = createOperationKey(
        userIdRef.current,
        operationName,
        specificOperation
      );
      return sessionTracker.getOperationState(operationKey);
    },
    [operationName, enableSessionTracking]
  );

  return {
    protectFunction,
    protectImmediate,
    isOperationLocked,
    lockOperation,
    unlockOperation,
    saveOperationState,
    loadOperationState,
    generateRequestId: generateUniqueId,
  };
};

/**
 * Hook chuyên dụng cho customization operations
 * @param {Object} options - Configuration options
 * @returns {Object} Protected customization functions
 */
export const useCustomizationProtection = (options = {}) => {
  const protection = useRaceConditionProtection("customization", {
    debounceDelay: 200, // Nhanh hơn cho UX tốt hơn
    lockTimeout: 3000, // Ngắn hơn cho customization
    enableDebounce: true,
    enableLock: true,
    enableRequestTracking: true,
    enableSessionTracking: true,
    ...options,
  });

  return {
    ...protection,

    // Specialized methods for customization
    protectColorChange: (asyncFn) =>
      protection.protectFunction(asyncFn, "color_change"),
    protectVersionSelect: (asyncFn) =>
      protection.protectImmediate(asyncFn, "version_select"),
    protectComboToggle: (asyncFn) =>
      protection.protectImmediate(asyncFn, "combo_toggle"),
    protectAccessoryToggle: (asyncFn) =>
      protection.protectFunction(asyncFn, "accessory_toggle"),
    protectPetSelect: (asyncFn) =>
      protection.protectImmediate(asyncFn, "pet_select"),
    protectHairSelect: (asyncFn) =>
      protection.protectFunction(asyncFn, "hair_select"),
    protectFaceSelect: (asyncFn) =>
      protection.protectFunction(asyncFn, "face_select"),
  };
};

/**
 * Hook chuyên dụng cho form submissions
 * @param {Object} options - Configuration options
 * @returns {Object} Protected form functions
 */
export const useFormSubmissionProtection = (options = {}) => {
  const protection = useRaceConditionProtection("form_submission", {
    debounceDelay: 0,
    lockTimeout: 10000, // Dài hơn cho form submission
    enableDebounce: false,
    enableLock: true,
    enableRequestTracking: true,
    enableSessionTracking: true,
    ...options,
  });

  return {
    ...protection,

    // Specialized methods for form submissions
    protectOrderSubmit: (asyncFn) =>
      protection.protectImmediate(asyncFn, "order_submit"),
    protectCheckout: (asyncFn) =>
      protection.protectImmediate(asyncFn, "checkout"),
    protectOrderFinalize: (asyncFn) =>
      protection.protectImmediate(asyncFn, "order_finalize"),
  };
};

/**
 * Hook để track và prevent double-click
 * @param {number} delay - Delay between clicks (ms)
 * @returns {Function} Click handler wrapper
 */
export const usePreventDoubleClick = (delay = 1000) => {
  const lastClickTime = useRef(0);

  return useCallback(
    (handler) => {
      return (...args) => {
        const now = Date.now();
        if (now - lastClickTime.current < delay) {
          console.log("Double click prevented");
          return;
        }

        lastClickTime.current = now;
        return handler(...args);
      };
    },
    [delay]
  );
};
