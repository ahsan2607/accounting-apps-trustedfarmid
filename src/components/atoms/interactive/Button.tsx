import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean; // optional loading state
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const baseClasses = "px-3 py-1.5 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ""} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
