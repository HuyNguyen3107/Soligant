const Loading = ({ size = "medium", color = "primary", className = "" }) => {
  // Size classes
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  // Color classes
  const colorClasses = {
    primary: "border-soligant-primary",
    white: "border-white",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default Loading;
