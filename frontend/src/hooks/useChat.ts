import { useState, useCallback } from "react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your document assistant. Upload a PDF or text file and ask me questions about it.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(`conv_${Date.now()}`);

  const sendMessage = useCallback(
    async (userMessage: string): Promise<void> => {
      if (!userMessage.trim()) return;

      // Add user message
      const userMsg: Message = {
        id: `msg_${Date.now()}_user`,
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // const response = await fetch("http://localhost:8000/chat", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     conversation_id: conversationId,
        //     message: userMessage,
        //   }),
        // });
        // if (!response.ok) {
        //   throw new Error(`Chat failed with status ${response.status}`);
        // }
        // const data = await response.json();
        // Simulate response for dummy API
        // const assistantMsg: Message = {
        //   id: `msg_${Date.now()}_assistant`,
        //   text: data.response || generateDummyResponse(userMessage),
        //   sender: "assistant",
        //   timestamp: new Date(),
        // };
        // setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        // Simulate successful response
        const assistantMsg: Message = {
          id: `msg_${Date.now()}_assistant`,
          text: generateDummyResponse(userMessage),
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } finally {
        setIsLoading(false);
        // Simulate successful response
        const assistantMsg: Message = {
          id: `msg_${Date.now()}_assistant`,
          text: generateDummyResponse(userMessage),
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    },
    [conversationId]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    conversationId,
  };
};

// Generate dummy responses for demo purposes
function generateDummyResponse(userMessage: string): string {
  const responses = [
    `I understand you're asking about "${userMessage}". Based on the uploaded document, here's what I found...`,
    `Great question! Regarding "${userMessage}", the document mentions...`,
    `Let me search through the document for information about "${userMessage}"...`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
