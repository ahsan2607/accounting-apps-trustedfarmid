import React from "react";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "checked"
> & {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "default" | "outlined";
  disabled?: boolean;
  className?: string;
};

export const Radio: React.FC<RadioProps> = ({
  options,
  name,
  value,
  onChange,
  variant = "default",
  disabled,
  className,
  ...rest
}) => {
  return (
    <fieldset className="flex flex-col gap-2" disabled={disabled}>
      {options.map(({ value: optionValue, label: optionLabel, disabled: optionDisabled }) => (
        <label
          key={optionValue}
          className={`inline-flex items-center gap-2 cursor-pointer ${
            disabled || optionDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="radio"
            name={name}
            value={optionValue}
            checked={value === optionValue}
            onChange={onChange}
            disabled={disabled || optionDisabled}
            {...rest}
            className={`form-radio focus:ring-2 focus:ring-blue-400 ${
              variant === "outlined" ? "border-gray-400 bg-white" : ""
            } ${className ?? ""}`}
          />
          <span>{optionLabel}</span>
        </label>
      ))}
    </fieldset>
  );
};
