'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AssistantMessage } from './assistant-widget';
import { AssistantStreamMessage } from './assistant-stream-message';

export function AssistantMessageList({
  messages,
}: {
  messages: AssistantMessage[];
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      {messages.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Ask me anything about how Flickmart works — buying, selling, wallet
          &amp; escrow, and more.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {messages.map((message) =>
          message.role === 'user' ? (
            <div
              className="ml-auto max-w-[85%] rounded-xl rounded-br-none bg-flickmart px-3 py-2 text-sm text-white"
              key={message.id}
            >
              {message.content}
            </div>
          ) : (
            <AssistantStreamMessage
              key={message.id}
              prompt={message.prompt}
              streamId={message.streamId}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
