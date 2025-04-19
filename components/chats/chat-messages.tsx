import { useRef, useEffect } from "react";
import MessageBubble from "./message-bubble";
import { TriangleAlert } from "lucide-react";

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
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full min-w-max border-2 border-gray-300 p-2 px-3 opacity-80 text-xs md:text-md text-gray-600">
          <TriangleAlert className="w-5 h-5" /> Do not send money to vendors
          outside of the platform.
        </div>
      </div>
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
