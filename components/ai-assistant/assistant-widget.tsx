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
  | { id: string; role: 'assistant'; streamId: string; prompt: string };

const MAX_QUESTIONS_PER_SESSION = 30;

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);

  function handleSend(prompt: string, streamId: string) {
    setMessages((prev) => [
      ...prev,
      { id: `${streamId}-user`, role: 'user', content: prompt },
      { id: streamId, role: 'assistant', streamId, prompt },
    ]);
  }

  const questionCount = messages.filter((m) => m.role === 'user').length;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <AssistantLauncher />
      <DialogContent className="flex h-[80vh] max-h-[640px] flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>Flickmart Assistant</DialogTitle>
        </DialogHeader>
        <AssistantMessageList messages={messages} />
        <AssistantInput
          disabled={questionCount >= MAX_QUESTIONS_PER_SESSION}
          onSend={handleSend}
        />
      </DialogContent>
    </Dialog>
  );
}
