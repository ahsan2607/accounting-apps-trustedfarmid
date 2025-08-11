import React from "react";
import { Input, Container } from "@/components/atoms";

export type DateProps = Omit<Input.InputProps, "type"> & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Date: React.FC<DateProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Input id={id} type="date" {...rest} />
    </Container.Field>
  );
};
