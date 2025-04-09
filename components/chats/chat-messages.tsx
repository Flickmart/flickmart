import { useRef, useEffect } from "react";
import MessageBubble from "./message-bubble";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          id={message.id}
          message={message.content}
          isUser={message.role === "user"}
          timestamp={message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          status={message.role === "user" ? "sent" : undefined}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 