'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AssistantInput } from './assistant-input';
import { AssistantLauncher } from './assistant-launcher';
import { AssistantMessageList } from './assistant-message-list';

export type AssistantMessage =
  | { id: string; role: 'user'; content: string }
  | {
      id: string;
      role: 'assistant';
      streamId: string;
      prompt: string;
      history: AssistantHistoryTurn[];
    };

export type AssistantHistoryTurn = { role: 'user' | 'assistant'; content: string };

const MAX_QUESTIONS_PER_SESSION = 30;
// Prior turns sent as context on each new question, capped to keep the
// request URL (the only place persistent-text-streaming lets us pass
// extra data) a reasonable size and token usage bounded on long sessions.
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_TURN_LENGTH = 500;

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [completedAnswers, setCompletedAnswers] = useState<
    Record<string, string>
  >({});

  function handleSend(prompt: string, streamId: string) {
    const history: AssistantHistoryTurn[] = messages
      .map((m) =>
        m.role === 'user'
          ? { role: 'user' as const, content: m.content }
          : completedAnswers[m.streamId]
            ? { role: 'assistant' as const, content: completedAnswers[m.streamId] }
            : null
      )
      .filter((turn): turn is AssistantHistoryTurn => turn !== null)
      .slice(-MAX_HISTORY_TURNS)
      .map((turn) => ({
        ...turn,
        content: turn.content.slice(0, MAX_HISTORY_TURN_LENGTH),
      }));

    setMessages((prev) => [
      ...prev,
      { id: `${streamId}-user`, role: 'user', content: prompt },
      { id: streamId, role: 'assistant', streamId, prompt, history },
    ]);
  }

  function handleComplete(streamId: string, text: string) {
    setCompletedAnswers((prev) =>
      prev[streamId] === text ? prev : { ...prev, [streamId]: text }
    );
  }

  const questionCount = messages.filter((m) => m.role === 'user').length;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <AssistantLauncher />
      <DialogContent className="flex h-[80vh] max-h-[640px] flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>Flickmart Assistant</DialogTitle>
        </DialogHeader>
        <AssistantMessageList messages={messages} onComplete={handleComplete} />
        <AssistantInput
          disabled={questionCount >= MAX_QUESTIONS_PER_SESSION}
          onSend={handleSend}
        />
      </DialogContent>
    </Dialog>
  );
}
