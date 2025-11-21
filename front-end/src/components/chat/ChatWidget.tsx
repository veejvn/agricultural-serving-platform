"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Message, Sender } from "@/types/chat";
import { getChatResponse } from "@/services/chatbot.service";
import ReactMarkdown from "react-markdown";
import { Bot, MessageSquare, SendHorizontal, Shrink, X } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "So sánh phân bón",
  "Các loại sâu bệnh trên cây lúa",
  "Phương pháp tưới tiêu hiệu quả",
  "Lịch thời vụ",
];


const allowedPaths = ["/", "/product", "/weather", "/price"];

const ChatWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: Sender.Bot,
      text: "Chào mừng bạn đến với AgriBot! Tôi có thể giúp gì cho bạn về nông nghiệp hôm nay?",
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Sender.User,
      text: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(text, messages);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Sender.Bot,
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
      // Optional: Add error message to chat
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!allowedPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4 z-50">
      {/* Chat Dialog */}
      <div
        className={`
          w-[calc(100vw-2rem)] sm:w-96 h-[60vh] sm:h-[70vh] max-h-[700px] 
          bg-white dark:bg-[#1C2C19] rounded-xl shadow-2xl flex flex-col overflow-hidden 
          border border-gray-200 dark:border-gray-700 transition-all duration-300 origin-bottom-right
          ${
            isOpen
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0 pointer-events-none hidden"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">
                {" "}
                <Bot />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                AgriBot Assistant
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">
              <X />
            </span>
          </button>
        </div>

        {/* Message Display Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white dark:bg-[#1C2C19]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === Sender.User ? "justify-end" : ""
              }`}
            >
              {msg.role === Sender.Bot && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-lg">
                    <Bot />
                  </span>
                </div>
              )}

              <div
                className={`
                  p-3 rounded-lg max-w-[80%] text-sm leading-relaxed
                  ${
                    msg.role === Sender.Bot
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                      : "bg-primary text-[#121811] rounded-br-none font-medium shadow-sm"
                  }
                `}
              >
                {msg.role === Sender.Bot ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-lg">
                  <Bot />
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-tl-none">
                <div className="flex gap-1 h-4 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C2C19]">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs px-3 py-1 rounded-full border border-primary/50 text-primary/80 dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              className="flex-1 h-10 px-3 text-sm bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all outline-none"
              placeholder="Ask about produce, fertilizers..."
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className={`
                flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg 
                bg-primary text-black transition-all
                ${
                  !inputText.trim() || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 hover:shadow-md active:scale-95"
                }
              `}
            >
              <span className="material-symbols-outlined text-xl">
                <SendHorizontal />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div title={isOpen ? "Close chat" : "Need help? Chat with us!"}>
        <button
          onClick={toggleChat}
          className={`
            flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full 
            bg-white text-primary border border-primary shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300
            ${isOpen ? "rotate-90" : "rotate-0"}
          `}
        >
          {isOpen ? (
            <span className="material-symbols-outlined text-3xl">
              <Shrink />
            </span>
          ) : (
            <span className="material-symbols-outlined text-3xl">
              <MessageSquare />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
