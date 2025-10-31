"use client";

import { useState } from "react";
import { useFileUpload } from "@/hooks";

interface FileUploadProps {
  onUploadSuccess: (fileName: string) => void;
  onUploadError: (error: string) => void;
}

export const FileUpload = ({
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { uploadFile, isLoading } = useFileUpload();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ["application/pdf", "text/plain"];

    if (!allowedTypes.includes(file.type)) {
      onUploadError("Please upload a PDF or TXT file");
      return;
    }

    const result = await uploadFile(file);

    if (result.success) {
      setUploadedFile(file.name);
      onUploadSuccess(file.name);
    } else {
      onUploadError(result.message);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.txt"
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="pointer-events-none">
          {uploadedFile ? (
            <div className="space-y-2">
              <div className="text-green-600 text-5xl">✓</div>
              <p className="text-sm text-gray-700 font-medium">
                {uploadedFile}
              </p>
              <p className="text-xs text-gray-500">Ready for questions</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400 text-5xl">📄</div>
              <p className="text-sm text-gray-700 font-medium">
                {isLoading ? "Uploading..." : "Drag and drop your file here"}
              </p>
              <p className="text-xs text-gray-500">or click to select</p>
              <p className="text-xs text-gray-400 mt-2">
                PDF or TXT files only
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
