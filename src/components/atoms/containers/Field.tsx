import React from "react";

type FieldProps = {
  label?: React.ReactNode;
  errorMessage?: string;
  htmlFor?: string;
  children: React.ReactNode;
};

export const Field: React.FC<FieldProps> = ({ label, errorMessage, htmlFor, children }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label id={htmlFor} htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {children}

      {errorMessage && <span className="text-xs text-red-500">{errorMessage}</span>}
    </div>
  );
};
