import React from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: "default" | "outlined";
  options: SelectOption[];
};

export const Dropdown: React.FC<DropdownProps> = ({ variant = "default", options, className, ...rest }) => {
  return (
    <div className="relative w-full">
      <select
        {...rest}
        className={`px-3 py-2 pr-8 w-full rounded border outline-none appearance-none focus:ring-2 focus:ring-blue-400 ${
          variant === "outlined" ? "border-gray-400 bg-white" : "border-transparent bg-gray-100"
        } ${className ?? ""}`}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-2xl"
        dangerouslySetInnerHTML={{ __html: "&#9662;" }}
      />
    </div>
  );
};
