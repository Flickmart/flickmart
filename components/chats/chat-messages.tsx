import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import MessageBubble from "./message-bubble";
import { TriangleAlert } from "lucide-react";
import { PhotoProvider } from "react-photo-view";

interface Message {
  id: string;
  chatId: string;
  content: string;
  images?: string[];
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "product" | "image" | "escrow" | "transfer";
  title?: string;
  price?: number;
  productImage?: string;
  productId?: string;
  // Transfer-specific fields
  orderId?: string;
  transferAmount?: number;
  currency?: string;
  order?: any;
}

interface ChatMessagesProps {
  messages: Message[];
  selectionMode: boolean;
  setSelectionMode: Dispatch<SetStateAction<boolean>>;
  selectedMessages: string[];
  setSelectedMessages: Dispatch<SetStateAction<string[]>>;
}

export default function ChatMessages({
  messages,
  selectionMode,
  setSelectionMode,
  setSelectedMessages,
  selectedMessages,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedMessages([]);
    }
  };

  // Toggle message selection
  const toggleMessageSelection = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || message.role !== "user") return;

    if (selectedMessages.includes(messageId)) {
      const newSelectedMessages = selectedMessages.filter(
        (id) => id !== messageId
      );
      setSelectedMessages(newSelectedMessages);
      if (newSelectedMessages.length === 0) {
        setSelectionMode(false);
      }
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  // Handle long press to enter selection mode
  const handleLongPress = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || message.role !== "user") return;

    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedMessages([messageId]);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    // Sort messages by timestamp (oldest first)
    const sortedMessages = [...messages].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groupedMessages: { date: string; messages: Message[] }[] = [];
    let currentGroup: { date: string; messages: Message[] } | null = null;

    sortedMessages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp);
      let dateLabel;

      // Determine date label
      if (msgDate.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (msgDate.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = msgDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Create new group if date changes
      if (!currentGroup || currentGroup.date !== dateLabel) {
        currentGroup = { date: dateLabel, messages: [] };
        groupedMessages.push(currentGroup);
      }

      currentGroup.messages.push(msg);
    });

    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 sm:pr-5 space-y-4 pb-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border-2 border-gray-300 p-1 px-2 sm:p-2 sm:px-3 opacity-80 text-xs text-gray-600 max-w-[95%] text-center">
          <TriangleAlert className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> 
          <span className="truncate">Do not send money to vendors outside the platform.</span>
        </div>
      </div>
      <PhotoProvider>
        {groupedMessages.map((group, index) => (
          <div key={index} className="space-y-2">
            <div className="text-center bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full mx-auto w-fit ">
              {group.date}
            </div>
            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                id={message.id}
                message={message.content}
                images={message.images}
                isUser={message.role === "user"}
                timestamp={message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={message.role === "user" ? "sent" : undefined}
                selectionMode={selectionMode}
                toggleMessageSelection={toggleMessageSelection}
                toggleSelectionMode={toggleSelectionMode}
                handleLongPress={handleLongPress}
                selectedMessages={selectedMessages}
                title={message.title}
                price={message.price}
                image={message.productImage}
                type={message.type}
                productId={message.productId}
                // Transfer-specific props
                orderId={message.orderId}
                transferAmount={message.transferAmount}
                currency={message.currency}
                order={message.order}
              />
            ))}
          </div>
        ))}
      </PhotoProvider>
      <div ref={messagesEndRef} />
      {/* Extra spacing at bottom for better scrolling */}
      <div className="h-16" />
    </div>
  );
}
