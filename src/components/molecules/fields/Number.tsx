import React from "react";
import { Input, Container } from "@/components/atoms";

export type NumberProps = Omit<Input.InputProps, "type"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Number: React.FC<NumberProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Input id={id} type="number" {...rest} />
    </Container.Field>
  );
};
