import React from "react";

/**
 * Component hiển thị badge thông báo với kích thước tự động điều chỉnh
 * @param {number} count - Số lượng thông báo
 * @param {string} className - Class tùy chỉnh thêm
 * @param {boolean} animate - Có animation pulse hay không
 * @param {string} position - Vị trí badge ('top-right', 'inline')
 * @param {string} variant - Kiểu badge ('danger', 'primary', 'success', 'warning')
 * @param {number} maxCount - Số lượng tối đa hiển thị (mặc định 999)
 */
const NotificationBadge = ({
  count,
  className = "",
  animate = true,
  position = "top-right",
  variant = "danger",
  maxCount = 999,
}) => {
  if (!count || count <= 0) return null;

  // Xác định kích thước badge dựa trên số lượng
  const getBadgeSize = (count) => {
    if (count > maxCount) return "h-6 w-8 px-1 text-xs";
    if (count > 99) return "h-6 w-7 px-1 text-xs";
    if (count > 9) return "h-5 w-6 text-xs";
    return "h-5 w-5 text-xs";
  };

  // Định dạng số hiển thị
  const getDisplayText = (count) => {
    if (count > maxCount) return `${maxCount}+`;
    if (count > 99) return "99+";
    return count.toString();
  };

  // Xác định position classes
  const getPositionClasses = (position) => {
    switch (position) {
      case "top-right":
        return "absolute -top-1 -right-1";
      case "top-left":
        return "absolute -top-1 -left-1";
      case "inline":
        return "";
      default:
        return "absolute -top-1 -right-1";
    }
  };

  // Xác định màu sắc theo variant
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "danger":
        return "bg-red-500 text-white";
      case "primary":
        return "bg-blue-500 text-white";
      case "success":
        return "bg-green-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-red-500 text-white";
    }
  };

  const baseClasses =
    "rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-200";
  const sizeClasses = getBadgeSize(count);
  const positionClasses = getPositionClasses(position);
  const variantClasses = getVariantClasses(variant);
  const animationClasses = animate ? "animate-pulse" : "";
  const hoverClasses = "hover:scale-110";

  return (
    <span
      className={`${baseClasses} ${sizeClasses} ${positionClasses} ${variantClasses} ${animationClasses} ${hoverClasses} ${className}`}
      title={`${count} thông báo chưa đọc`}
    >
      {getDisplayText(count)}
    </span>
  );
};

export default NotificationBadge;
