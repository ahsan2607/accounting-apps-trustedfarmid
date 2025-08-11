import React from "react";
import { Input, Container } from "@/components/atoms";

export type EmailProps = Omit<Input.InputProps, "type"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Email: React.FC<EmailProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Input id={id} type="email" {...rest} />
    </Container.Field>
  );
};
