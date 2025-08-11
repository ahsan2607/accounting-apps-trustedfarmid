import React from "react";
import { Input, Container } from "@/components/atoms";

export type RadioProps = Omit<Input.RadioProps, "id"> & {
  label?: string;
  errorMessage?: string;
};

export const Radio: React.FC<RadioProps> = ({ label, errorMessage, ...rest }) => {
  return (
    <Container.Field
      label={
        label ? (
          <legend className="text-sm font-medium text-gray-700">{label}</legend>
        ) : undefined
      }
      errorMessage={errorMessage}
      htmlFor={undefined}
    >
      <Input.Radio {...rest} />
    </Container.Field>
  );
};
