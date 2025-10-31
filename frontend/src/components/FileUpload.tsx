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
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragActive
            ? "border-blue-400 bg-blue-950/30 shadow-lg shadow-blue-500/20"
            : "border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50"
        } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
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
            <div className="space-y-3 animate-in fade-in">
              <div className="text-emerald-400 text-6xl animate-bounce">✓</div>
              <p className="text-base text-slate-100 font-semibold">
                {uploadedFile}
              </p>
              <p className="text-sm text-slate-400">Ready for your questions</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-5xl">{isLoading ? "⏳" : "📄"}</div>
              <p className="text-base text-slate-100 font-semibold">
                {isLoading
                  ? "Uploading document..."
                  : "Drag and drop your file"}
              </p>
              <p className="text-sm text-slate-400">or click to browse</p>
              <p className="text-xs text-slate-500 mt-3 font-medium">
                💾 PDF or TXT files only
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
