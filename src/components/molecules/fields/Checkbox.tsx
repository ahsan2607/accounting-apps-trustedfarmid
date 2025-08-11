import React from "react";
import { Input, Container } from "@/components/atoms";

export type CheckboxProps = Input.CheckboxProps & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Checkbox id={id} {...rest} />
    </Container.Field>
  );
};
