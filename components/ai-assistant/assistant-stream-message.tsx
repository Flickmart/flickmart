'use client';

import type { StreamId } from '@convex-dev/persistent-text-streaming';
import { useStream } from '@convex-dev/persistent-text-streaming/react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from 'react-spinners';
import { chatMarkdownImageComponents } from '@/components/chat-markdown-image';
import { api } from '@/convex/_generated/api';
import type { AssistantHistoryTurn } from './assistant-widget';

export function AssistantStreamMessage({
  prompt,
  streamId,
  history,
  onComplete,
}: {
  prompt: string;
  streamId: string;
  history: AssistantHistoryTurn[];
  onComplete: (streamId: string, text: string) => void;
}) {
  const streamUrl = new URL(
    `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/site-assistant-stream`
  );
  streamUrl.searchParams.set('prompt', prompt);
  streamUrl.searchParams.set('streamId', streamId);
  streamUrl.searchParams.set('history', JSON.stringify(history));

  const { text, status } = useStream(
    api.siteAssistant.getAssistantStreamBody,
    streamUrl.href as unknown as URL,
    true,
    streamId as StreamId
  );

  useEffect(() => {
    if (status === 'done' && text) {
      onComplete(streamId, text);
    }
  }, [status, text, streamId, onComplete]);

  const finishedWithNoAnswer = (status === 'done' || status === 'error') && !text;

  return (
    <div className="max-w-[85%] rounded-xl rounded-bl-none bg-gray-100 px-3 py-2 text-black text-sm">
      {finishedWithNoAnswer ? (
        <p className="text-muted-foreground">
          I couldn't come up with an answer just now. Please try asking
          again.
        </p>
      ) : text ? (
        <ReactMarkdown components={chatMarkdownImageComponents}>{text}</ReactMarkdown>
      ) : (
        <div className="flex h-6 items-center">
          <BeatLoader color="#6b7280" size={6} />
        </div>
      )}
    </div>
  );
}
