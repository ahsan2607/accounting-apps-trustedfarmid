import React from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: "default" | "outlined";
  options: SelectOption[];
};

export const Dropdown: React.FC<DropdownProps> = ({
  variant = "default",
  options,
  className,
  ...rest
}) => {
  return (
    <select
      {...rest}
      className={`px-3 py-2 rounded border outline-none focus:ring-2 focus:ring-blue-400 ${
        variant === "outlined"
          ? "border-gray-400 bg-white"
          : "border-transparent bg-gray-100"
      } ${className ?? ""}`}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
