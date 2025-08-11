import React from "react";
import { Input, Container } from "@/components/atoms";

export type DropdownProps = Input.DropdownProps & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Dropdown id={id} {...rest} />
    </Container.Field>
  );
};
