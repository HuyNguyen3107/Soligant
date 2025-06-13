// src/utils/scrollUtils.js

/**
 * Cuộn lên đầu trang
 * @param {Object} options - Tùy chọn cuộn
 */
export const scrollToTop = (options = {}) => {
  const { behavior = "smooth", top = 0, left = 0 } = options;

  window.scrollTo({
    top,
    left,
    behavior,
  });
};

/**
 * Cuộn đến một element cụ thể
 * @param {string|Element} element - Element hoặc selector
 * @param {Object} options - Tùy chọn cuộn
 */
export const scrollToElement = (element, options = {}) => {
  const {
    behavior = "smooth",
    block = "start",
    inline = "nearest",
    offset = 0,
  } = options;

  let targetElement;
  if (typeof element === "string") {
    targetElement = document.querySelector(element);
  } else {
    targetElement = element;
  }

  if (targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }
};

/**
 * Kiểm tra xem có đang ở đầu trang không
 * @returns {boolean}
 */
export const isAtTop = () => {
  return window.pageYOffset === 0;
};

/**
 * Kiểm tra xem có đang ở cuối trang không
 * @returns {boolean}
 */
export const isAtBottom = () => {
  return window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
};

/**
 * Lấy vị trí scroll hiện tại
 * @returns {Object} {x, y}
 */
export const getScrollPosition = () => {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  };
};
