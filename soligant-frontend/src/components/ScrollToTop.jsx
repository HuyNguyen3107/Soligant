// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kiểm tra xem có phần tử nào đang focus không (để tránh làm gián đoạn form input)
    const activeElement = document.activeElement;
    const isInputFocused =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true");

    // Chỉ cuộn nếu không có input nào đang được focus
    if (!isInputFocused) {
      // Sử dụng setTimeout ngắn để đảm bảo DOM đã được render hoàn toàn
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth", // Cuộn mượt mà
        });
      }, 0);

      // Cleanup timeout nếu component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return null; // Component này không render gì
};

export default ScrollToTop;
