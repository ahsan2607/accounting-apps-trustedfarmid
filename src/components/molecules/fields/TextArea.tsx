import React from "react";
import { Input, Container } from "@/components/atoms";

export type TextAreaProps = Input.TextAreaProps & {
  label?: string;
  errorMessage?: string;
  id: string;
};

export const TextArea: React.FC<TextAreaProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.TextArea id={id} {...rest} />
    </Container.Field>
  );
};
