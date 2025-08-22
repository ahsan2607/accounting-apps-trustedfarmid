import React from "react";
import { Input, Container } from "@/components/atoms";

export type NumberProps = Omit<Input.InputProps, "type" | "onChange" | "value"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
  prefix?: string; // e.g. Rp
  suffix?: string; // e.g. ,-, kg, %
  value: string | number; // raw (no dots)
  onChange: (value: string) => void; // always raw (no dots)
};

export const Number: React.FC<NumberProps> = ({
  label,
  errorMessage,
  id,
  prefix,
  suffix,
  value,
  onChange,
  ...rest
}) => {
  const formatDisplay = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ""); // only digits
    onChange(raw);
  };

  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <div
        className={`flex items-center rounded bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 ${rest.className || ""} ${prefix ? "pl-3" : ""} ${suffix ? "pr-3" : ""}`}
      >
        {prefix && <span className="text-gray-600 w-1/12 text-left">{prefix}</span>}
        <Input.Input
          id={id}
          type="text" // must be text, not number
          className="flex-1 border-0 bg-transparent !px-2 focus-within:!ring-0 w-9/12"
          value={formatDisplay(value)}
          onChange={handleChange}
          {...rest}
        />
        {suffix && <span className="text-gray-600 w-2/12 text-right">{suffix}</span>}
      </div>
    </Container.Field>
  );
};
