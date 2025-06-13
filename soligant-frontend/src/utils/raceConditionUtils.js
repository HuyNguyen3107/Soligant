// src/utils/raceConditionUtils.js
/**
 * Utility functions để xử lý race conditions và prevent duplicate operations
 */

/**
 * Tạo debounced version của một function
 * @param {Function} func - Function cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Tạo throttled version của một function
 * @param {Function} func - Function cần throttle
 * @param {number} limit - Thời gian limit (ms)
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Class để quản lý operation locks
 * Ngăn chặn cùng một operation chạy đồng thời
 */
class OperationLockManager {
  constructor() {
    this.locks = new Map();
  }

  /**
   * Kiểm tra xem operation có đang bị lock không
   * @param {string} key - Unique key cho operation
   * @returns {boolean}
   */
  isLocked(key) {
    return this.locks.has(key);
  }

  /**
   * Lock một operation
   * @param {string} key - Unique key cho operation
   * @param {number} timeout - Timeout sau bao lâu sẽ tự unlock (ms)
   */
  lock(key, timeout = 5000) {
    this.locks.set(key, true);

    // Auto unlock sau timeout
    setTimeout(() => {
      this.unlock(key);
    }, timeout);
  }

  /**
   * Unlock một operation
   * @param {string} key - Unique key cho operation
   */
  unlock(key) {
    this.locks.delete(key);
  }

  /**
   * Execute function với lock protection
   * @param {string} key - Unique key cho operation
   * @param {Function} fn - Function cần execute
   * @param {number} timeout - Lock timeout
   * @returns {Promise}
   */
  async executeWithLock(key, fn, timeout = 5000) {
    if (this.isLocked(key)) {
      console.warn(`Operation "${key}" is already in progress`);
      return Promise.resolve();
    }

    this.lock(key, timeout);

    try {
      return await fn();
    } catch (error) {
      console.error(`Error in locked operation "${key}":`, error);
      throw error;
    } finally {
      this.unlock(key);
    }
  }
}

// Global instance
export const operationLockManager = new OperationLockManager();

/**
 * Tạo unique key cho user operations
 * @param {string} userId - User ID (có thể là session ID)
 * @param {string} operation - Operation name
 * @param {string} resourceId - Resource ID (optional)
 * @returns {string}
 */
export const createOperationKey = (userId, operation, resourceId = "") => {
  return `${userId}_${operation}${resourceId ? `_${resourceId}` : ""}`;
};

/**
 * Generate unique ID cho mỗi thao tác
 * @returns {string}
 */
export const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Session storage utility để track user operations
 */
export const sessionTracker = {
  // Lưu operation state vào session storage
  setOperationState(key, state) {
    try {
      sessionStorage.setItem(
        `op_${key}`,
        JSON.stringify({
          ...state,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Cannot save operation state to session storage:", error);
    }
  },

  // Lấy operation state từ session storage
  getOperationState(key) {
    try {
      const data = sessionStorage.getItem(`op_${key}`);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Kiểm tra expire time (30 phút)
      if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
        this.removeOperationState(key);
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn("Cannot get operation state from session storage:", error);
      return null;
    }
  },

  // Xóa operation state
  removeOperationState(key) {
    try {
      sessionStorage.removeItem(`op_${key}`);
    } catch (error) {
      console.warn(
        "Cannot remove operation state from session storage:",
        error
      );
    }
  },

  // Clear all expired operations
  clearExpiredOperations() {
    try {
      const keys = Object.keys(sessionStorage);
      const now = Date.now();

      keys.forEach((key) => {
        if (key.startsWith("op_")) {
          try {
            const data = JSON.parse(sessionStorage.getItem(key));
            if (now - data.timestamp > 30 * 60 * 1000) {
              sessionStorage.removeItem(key);
            }
          } catch (error) {
            // Remove invalid entries
            sessionStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn("Cannot clear expired operations:", error);
    }
  },
};

/**
 * Request ID manager để track API requests
 */
export const requestIdManager = {
  pendingRequests: new Map(),

  /**
   * Tạo hoặc lấy request ID cho một operation
   * @param {string} operationKey - Key của operation
   * @returns {string} Request ID
   */
  getOrCreateRequestId(operationKey) {
    if (this.pendingRequests.has(operationKey)) {
      return this.pendingRequests.get(operationKey);
    }

    const requestId = generateUniqueId();
    this.pendingRequests.set(operationKey, requestId);
    return requestId;
  },

  /**
   * Complete một request
   * @param {string} operationKey - Key của operation
   * @param {string} requestId - Request ID
   */
  completeRequest(operationKey, requestId) {
    const currentRequestId = this.pendingRequests.get(operationKey);
    if (currentRequestId === requestId) {
      this.pendingRequests.delete(operationKey);
    }
  },

  /**
   * Kiểm tra xem request có phải là latest không
   * @param {string} operationKey - Key của operation
   * @param {string} requestId - Request ID
   * @returns {boolean}
   */
  isLatestRequest(operationKey, requestId) {
    return this.pendingRequests.get(operationKey) === requestId;
  },
};

/**
 * Helper function để wrap async operations với race condition protection
 * @param {string} operationKey - Unique key cho operation
 * @param {Function} asyncFn - Async function cần protect
 * @param {Object} options - Options
 * @returns {Function} Protected function
 */
export const withRaceConditionProtection = (
  operationKey,
  asyncFn,
  options = {}
) => {
  const {
    debounceDelay = 300,
    lockTimeout = 5000,
    enableDebounce = true,
    enableLock = true,
    enableRequestTracking = true,
  } = options;

  let protectedFn = asyncFn;

  // Apply request tracking
  if (enableRequestTracking) {
    protectedFn = async (...args) => {
      const requestId = requestIdManager.getOrCreateRequestId(operationKey);

      try {
        const result = await asyncFn(...args);

        // Chỉ process result nếu đây là latest request
        if (requestIdManager.isLatestRequest(operationKey, requestId)) {
          requestIdManager.completeRequest(operationKey, requestId);
          return result;
        } else {
          console.log(
            `Discarding stale request for operation "${operationKey}"`
          );
          return null;
        }
      } catch (error) {
        requestIdManager.completeRequest(operationKey, requestId);
        throw error;
      }
    };
  }

  // Apply lock protection
  if (enableLock) {
    const originalFn = protectedFn;
    protectedFn = (...args) => {
      return operationLockManager.executeWithLock(
        operationKey,
        () => originalFn(...args),
        lockTimeout
      );
    };
  }

  // Apply debounce
  if (enableDebounce) {
    protectedFn = debounce(protectedFn, debounceDelay);
  }

  return protectedFn;
};
