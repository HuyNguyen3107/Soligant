// src/components/ui/ProtectedButton.jsx
import React from "react";
import { usePreventDoubleClick } from "../../hooks/useRaceConditionProtection";
import Button from "./Button";

/**
 * Button component với race condition protection
 * @param {Object} props - Button props
 * @param {Function} props.onClick - Click handler
 * @param {number} props.clickDelay - Delay giữa các clicks (ms)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {any} props.children - Button content
 * @param {Object} props.rest - Other button props
 * @returns {JSX.Element}
 */
const ProtectedButton = ({
  onClick,
  clickDelay = 500,
  disabled = false,
  loading = false,
  children,
  ...rest
}) => {
  const preventDoubleClick = usePreventDoubleClick(clickDelay);

  const handleClick = preventDoubleClick(onClick);

  return (
    <Button {...rest} onClick={handleClick} disabled={disabled || loading}>
      {loading ? "Đang xử lý..." : children}
    </Button>
  );
};

export default ProtectedButton;
