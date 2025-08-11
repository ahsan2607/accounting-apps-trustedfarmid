import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "outlined";
};

export const Input: React.FC<InputProps> = ({ variant = "default", className, ...rest }) => {
  return (
    <input
      {...rest}
      className={`px-3 py-2 rounded border outline-none focus:ring-2 focus:ring-blue-400 ${
        variant === "outlined" ? "border-gray-400 bg-white" : "border-transparent bg-gray-100"
      } ${className ?? ""}`}
    />
  );
};
