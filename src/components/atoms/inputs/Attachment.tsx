// src/components/ui/atoms/forms/Attachment.tsx
import React, { useState } from "react";

export type AttachmentProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "outlined";
};

export const Attachment: React.FC<AttachmentProps> = ({
  variant = "default",
  className,
  onChange,
  ...rest
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileNames(files ? Array.from(files).map((f) => f.name) : []);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <input
        type="file"
        {...rest}
        onChange={handleChange}
        className={`cursor-pointer rounded border outline-none focus:ring-2 focus:ring-blue-400 ${
          variant === "outlined"
            ? "border-gray-400 bg-white"
            : "border-transparent bg-gray-100"
        } ${className ?? ""}`}
      />

      {fileNames.length > 0 && (
        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
          {fileNames.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
