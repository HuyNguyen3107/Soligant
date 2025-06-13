// src/components/ui/ScrollToTopButton.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

const ScrollToTopButton = ({
  showAfter = 300, // Hiển thị sau khi cuộn 300px
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={`
            fixed bottom-6 right-6 z-50
            bg-soligant-primary hover:bg-soligant-primary-dark
            text-white rounded-full p-3 shadow-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-soligant-primary focus:ring-offset-2
            ${className}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          {...props}
        >
          <ChevronUpIcon className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
