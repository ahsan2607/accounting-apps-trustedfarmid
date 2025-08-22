import React from "react";
import { Input, Container } from "@/components/atoms";

export type TextProps = Omit<Input.InputProps, "type"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Text: React.FC<TextProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Input id={id} type="text" {...rest} />
    </Container.Field>
  );
};
