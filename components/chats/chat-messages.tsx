import { TriangleAlert } from 'lucide-react';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { PhotoProvider } from 'react-photo-view';
import MessageBubble from './message-bubble';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Message = {
  id: string;
  chatId: string;
  content: string;
  images?: string[];
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'product' | 'image' | 'escrow' | 'transfer' | "ai";
  title?: string;
  price?: number;
  productImage?: string;
  productId?: string;
  // Transfer-specific fields
  orderId?: string;
  transferAmount?: number;
  currency?: string;
  isPending?: boolean;
  status?: 'sent' | 'delivered' | 'read';
};

type ChatMessagesProps = {
  messages: Message[];
  selectionMode: boolean;
  setSelectionMode: Dispatch<SetStateAction<boolean>>;
  selectedMessages: string[];
  setSelectedMessages: Dispatch<SetStateAction<string[]>>;
};

export default function ChatMessages({
  messages,
  selectionMode,
  setSelectionMode,
  setSelectedMessages,
  selectedMessages,
}: ChatMessagesProps) {
  const _messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamId, useStreamId] = useState<string>("")

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);


  const chatBody = useQuery(api.chat.getChatBody, {
    streamId: streamId
  })

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
    if (!message || message.role !== 'user') {
      return;
    }

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
    if (!message || message.role !== 'user') {
      return;
    }

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
        dateLabel = 'Today';
      } else if (msgDate.toDateString() === yesterday.toDateString()) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = msgDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
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
    <div className="flex-1 space-y-4 overflow-y-auto p-2 pb-16 sm:p-4 sm:pr-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex max-w-[95%] items-center gap-1 rounded-full border-2 border-gray-300 p-1 px-2 text-center text-gray-600 text-xs opacity-80 sm:gap-2 sm:p-2 sm:px-3">
          <TriangleAlert className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
          <span className="truncate">
            Do not send money to vendors outside the platform.
          </span>
        </div>
      </div>
      <PhotoProvider>
        {groupedMessages.map((group, index) => (
          <div className="space-y-3" key={index}>
            <div className="mx-auto w-fit rounded-full bg-gray-200 px-3 py-1 text-center text-gray-600 text-xs">
              {group.date}
            </div>
            {group.messages.map((message) => ( message.content &&
              <MessageBubble
                currency={message.currency}
                handleLongPress={handleLongPress}
                id={message.id}
                image={message.productImage}
                images={message.images}
                isPending={message.isPending}
                isUser={message.role === 'user'}
                key={message.id}
                message={message.content}
                orderId={message.orderId}
                price={message.price}
                productId={message.productId}
                selectedMessages={selectedMessages}
                selectionMode={selectionMode}
                status={message.role === 'user' ? message.status : undefined}
                timestamp={message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                title={message.title}
                toggleMessageSelection={toggleMessageSelection}
                // Transfer-specific props
                toggleSelectionMode={toggleSelectionMode}
                transferAmount={message.transferAmount}
                type={message.type}
              />
            ))}
          </div>
        ))}
      </PhotoProvider>
      <div className='h-96 border border-flickmart'>
        {chatBody?.text}
      </div>
      {/* <div ref={messagesEndRef} /> */}
      {/* Extra spacing at bottom for better scrolling */}
      <div className="h-16" />
    </div>
  );
}
