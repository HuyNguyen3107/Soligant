// src/hooks/useScrollToTop.js
import { useCallback } from "react";

/**
 * Custom hook để cuộn lên đầu trang
 * @param {Object} options - Tùy chọn cuộn
 * @returns {Function} scrollToTop function
 */
export const useScrollToTop = (options = {}) => {
  const { behavior = "smooth", top = 0, left = 0, delay = 0 } = options;

  const scrollToTop = useCallback(() => {
    const scroll = () => {
      window.scrollTo({
        top,
        left,
        behavior,
      });
    };

    if (delay > 0) {
      setTimeout(scroll, delay);
    } else {
      scroll();
    }
  }, [behavior, top, left, delay]);

  return scrollToTop;
};

export default useScrollToTop;
