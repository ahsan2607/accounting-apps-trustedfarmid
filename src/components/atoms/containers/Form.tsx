import React from "react";

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fullWidth?: boolean;
};

export const Form: React.FC<FormProps> = ({ children, className, fullWidth = false, ...rest }) => {
  return (
    <form {...rest} className={`${fullWidth ? "w-full" : "max-w-md"} space-y-4 ${className ?? ""}`}>
      {children}
    </form>
  );
};
