// src/components/ui/molecules/forms/AttachmentField.tsx
import React from "react";
import { Input, Container } from "@/components/atoms";

export type AttachmentProps = Input.AttachmentProps & {
  label?: string;
  errorMessage?: string;
  id?: string;
};

export const Attachment: React.FC<AttachmentProps> = ({ label, errorMessage, id, ...rest }) => {
  return (
    <Container.Field label={label} errorMessage={errorMessage} htmlFor={id}>
      <Input.Attachment id={id} {...rest} />
    </Container.Field>
  );
};
