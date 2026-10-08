"use client";

import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function Chat({ isOpen, onClose }: ChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "You",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-20 right-20 w-[800px] h-[600px] bg-white rounded-lg shadow-2xl z-[10000] overflow-hidden flex flex-col"
      drag
      dragElastic={0.1}
    >
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <h3 className="text-sm font-semibold">Chat</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col items-start space-y-1"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-600">
                  {message.sender}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
