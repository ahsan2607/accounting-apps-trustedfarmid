import React from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "outlined";
};

export const Checkbox: React.FC<CheckboxProps> = ({
  variant = "default",
  className,
  ...rest
}) => {
  return (
    <input
      type="checkbox"
      {...rest}
      className={`form-checkbox rounded focus:ring-2 focus:ring-blue-400 ${
        variant === "outlined" ? "border-gray-400 bg-white" : ""
      } ${className ?? ""}`}
    />
  );
};
