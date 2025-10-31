"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/hooks";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-800/50 rounded-t-2xl p-6 space-y-4 scroll-smooth">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-slate-400 font-medium">
              Upload a file to start the conversation
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-blue-600 text-slate-50 rounded-br-none shadow-lg shadow-blue-600/20"
                  : "bg-slate-700 text-slate-100 rounded-bl-none shadow-lg shadow-slate-900/20 border border-slate-600"
              }`}
            >
              <p className="text-sm break-all leading-relaxed font-medium">
                {message.text}
              </p>
              <span
                className={`text-xs mt-2 block font-medium ${
                  message.sender === "user"
                    ? "text-blue-100/70"
                    : "text-slate-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))
      )}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in duration-300">
          <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-600 shadow-lg shadow-slate-900/20">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
