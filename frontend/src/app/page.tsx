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
    <div className="flex h-screen bg-slate-950">
      {/* Main Chat Container */}
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
              Document Assistant
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-2 ml-5">
            {uploadedFileName
              ? `📄 ${uploadedFileName}`
              : "Ready for documents"}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6 p-6 overflow-hidden">
          {/* Upload Section */}
          {!uploadedFileName && (
            <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-slate-50 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📤</span> Upload Your Document
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
            <div className="bg-emerald-950 border border-emerald-700 text-emerald-100 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2">
              <span className="text-xl">✨</span>
              {uploadedFileName} uploaded successfully!
            </div>
          )}

          {/* Chat Section */}
          {uploadedFileName && (
            <div className="flex-1 flex flex-col bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <div className="border-t border-slate-700 p-4 bg-slate-850">
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>
            </div>
          )}

          {/* Initial State - No Upload */}
          {!uploadedFileName && (
            <div className="flex-1 flex items-center justify-center bg-slate-800 rounded-2xl shadow-xl border border-slate-700 border-dashed hover:border-slate-600 transition-all duration-300">
              <div className="text-center">
                <p className="text-5xl mb-3">📚</p>
                <p className="text-lg text-slate-300 font-medium">
                  Upload a document to start
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Get answers powered by AI
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
