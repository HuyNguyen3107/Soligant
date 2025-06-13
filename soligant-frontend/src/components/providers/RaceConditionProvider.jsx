// src/components/providers/RaceConditionProvider.jsx
import React, { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { sessionTracker } from "../../utils/raceConditionUtils";

const RaceConditionContext = createContext();

/**
 * Provider để handle race condition notifications
 */
export const RaceConditionProvider = ({ children }) => {
  useEffect(() => {
    // Clear expired operations on mount
    sessionTracker.clearExpiredOperations();

    // Setup interval để clear expired operations
    const interval = setInterval(() => {
      sessionTracker.clearExpiredOperations();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Listen for beforeunload để clean up pending operations
    const handleBeforeUnload = () => {
      sessionTracker.clearExpiredOperations();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Utility functions để show race condition warnings
  const showDuplicateActionWarning = (actionName) => {
    toast.warn(`Hành động "${actionName}" đang được xử lý. Vui lòng đợi...`, {
      toastId: `duplicate_${actionName}`,
      autoClose: 2000,
    });
  };

  const showRateLimitWarning = (actionName) => {
    toast.info(
      `Bạn đang thao tác quá nhanh với "${actionName}". Vui lòng thử lại sau.`,
      {
        toastId: `ratelimit_${actionName}`,
        autoClose: 3000,
      }
    );
  };

  const showConcurrentUserWarning = () => {
    toast.warning(
      "Có nhiều người đang cùng thao tác. Một số thao tác có thể bị chậm.",
      {
        toastId: "concurrent_users",
        autoClose: 5000,
      }
    );
  };

  const contextValue = {
    showDuplicateActionWarning,
    showRateLimitWarning,
    showConcurrentUserWarning,
  };

  return (
    <RaceConditionContext.Provider value={contextValue}>
      {children}
    </RaceConditionContext.Provider>
  );
};

/**
 * Hook để sử dụng race condition utilities
 */
export const useRaceConditionNotification = () => {
  const context = useContext(RaceConditionContext);
  if (!context) {
    throw new Error(
      "useRaceConditionNotification must be used within RaceConditionProvider"
    );
  }
  return context;
};

export default RaceConditionProvider;
