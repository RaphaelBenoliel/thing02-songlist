import React from "react";
import "./UploadButton.css"; // import the CSS

interface UploadButtonProps {
  onFileSelect: (file: File) => void;
}

export default function UploadButton({ onFileSelect }: UploadButtonProps) {
  return (
    <div className="upload-wrapper">
      <label className="upload-btn">
        📂 Upload CSV
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
      <small className="upload-hint">Only .csv files are supported</small>
    </div>
  );
}
