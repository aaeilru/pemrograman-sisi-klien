const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) => {
  const baseClass =
    "inline-flex items-center justify-center rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantClass = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-400 text-white hover:bg-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;