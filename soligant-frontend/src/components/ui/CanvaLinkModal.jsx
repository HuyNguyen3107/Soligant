// src/components/ui/CanvaLinkModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const CanvaLinkModal = ({ isOpen, onClose, canvaUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canvaUrl);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-soligant-primary mb-4 font-utm-avo">
              Thiết kế của bạn đã được tạo!
            </h3>

            <p className="mb-4 font-utm-avo">
              Bạn có thể xem và chỉnh sửa thêm thiết kế của mình trên Canva bằng
              liên kết dưới đây:
            </p>

            <div className="flex items-center mb-6">
              <input
                type="text"
                value={canvaUrl}
                readOnly
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none font-utm-avo text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-soligant-primary text-white px-3 py-2 rounded-r-md hover:bg-opacity-90"
              >
                {copied ? "Đã sao chép!" : "Sao chép"}
              </button>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => window.open(canvaUrl, "_blank")}
              >
                Mở trong Canva
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CanvaLinkModal;
