import React from "react";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "default" | "outlined";
};

export const TextArea: React.FC<TextAreaProps> = ({
  variant = "default",
  className,
  ...rest
}) => {
  return (
    <textarea
      {...rest}
      className={`px-3 py-2 rounded border outline-none focus:ring-2 focus:ring-blue-400 resize-y ${
        variant === "outlined" ? "border-gray-400 bg-white" : "border-transparent bg-gray-100"
      } ${className ?? ""}`}
    />
  );
};
