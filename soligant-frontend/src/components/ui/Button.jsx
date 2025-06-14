import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  to,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  // Base classes for button styling
  const baseClasses =
    "rounded font-utm-avo font-bold transition-all duration-300";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-soligant-primary text-white hover:bg-opacity-90",
    secondary:
      "bg-soligant-secondary text-soligant-primary hover:bg-opacity-90",
    outline:
      "border-2 border-soligant-primary text-soligant-primary hover:bg-soligant-primary hover:text-white",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  // Disabled style
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Combine classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  // If "to" prop is provided, render as Link
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
