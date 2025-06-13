// src/components/ui/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Logo component that can be used throughout the application
 * @param {Object} props
 * @param {string} props.variant - Logo variant: 'text', 'image', 'combined'
 * @param {string} props.size - Logo size: 'sm', 'md', 'lg'
 * @param {string} props.color - Logo color: 'primary', 'white', 'dark'
 * @param {string} props.to - Link destination (default: '/')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.clickable - Whether logo is clickable (default: true)
 * @returns {JSX.Element}
 */
const Logo = ({
  variant = "text",
  size = "md",
  color = "primary",
  to = "/",
  className = "",
  clickable = true,
}) => {
  // Size classes
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl xl:text-3xl",
  };

  // Color classes
  const colorClasses = {
    primary: "text-soligant-primary",
    white: "text-white",
    dark: "text-gray-900",
  };

  // Base logo styles
  const baseClasses = `font-utm-avo font-bold ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  // Hover effects for clickable logos
  const hoverClasses = clickable
    ? "hover:opacity-80 transition-opacity duration-200"
    : "";

  const LogoContent = () => {
    switch (variant) {
      case "image":
        return (
          <img
            src="/logo.png"
            alt="Soligant Logo"
            className={`h-8 w-auto ${
              size === "lg" ? "h-12" : size === "sm" ? "h-6" : "h-8"
            }`}
          />
        );

      case "combined":
        return (
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Soligant Logo"
              className={`h-6 w-auto ${
                size === "lg" ? "h-8" : size === "sm" ? "h-4" : "h-6"
              }`}
            />
            <span className={baseClasses}>SOLIGANT</span>
          </div>
        );

      case "text":
      default:
        return <span className={baseClasses}>SOLIGANT</span>;
    }
  };

  if (!clickable) {
    return (
      <div className={hoverClasses}>
        <LogoContent />
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`inline-block ${hoverClasses}`}
      title="Về trang chủ"
    >
      <LogoContent />
    </Link>
  );
};

export default Logo;
