"use client";

import { useState } from "react";
import { FileUpload, ChatMessages, ChatInput } from "@/components";
import { useChat } from "@/hooks";

export default function Home() {
  const { messages, sendMessage, isLoading, conversationId } = useChat();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFileName(fileName);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Chat Container */}
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Document Assistant
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {uploadedFileName
              ? `Chatting about: ${uploadedFileName}`
              : "No document uploaded yet"}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6 p-6 overflow-hidden">
          {/* Upload Section */}
          {!uploadedFileName && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Upload Document
                </h2>
                <FileUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && uploadedFileName && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg animate-pulse">
              ✓ {uploadedFileName} uploaded successfully!
            </div>
          )}

          {/* Chat Section */}
          {uploadedFileName && (
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <div className="border-t border-gray-200 p-4">
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>
            </div>
          )}

          {/* Initial State - No Upload */}
          {!uploadedFileName && (
            <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center text-gray-400">
                <p className="text-lg">
                  Upload a document to start asking questions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
