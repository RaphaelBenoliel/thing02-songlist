import React from "react";

interface UploadButtonProps {
  onFileSelect: (file: File) => void;
}

export default function UploadButton({ onFileSelect }: UploadButtonProps) {
  return (
    <label className="upload-btn">
      Upload CSV
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />
    </label>
  );
}
