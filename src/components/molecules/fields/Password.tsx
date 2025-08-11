import React from "react";
import { Input, Container } from "@/components/atoms";

export type PasswordProps = Omit<Input.InputProps, "type"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Password: React.FC<PasswordProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Input id={id} type="email" {...rest} />
    </Container.Field>
  );
};
