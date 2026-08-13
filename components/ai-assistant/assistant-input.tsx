'use client';

import { useMutation } from 'convex/react';
import { SendHorizontal } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';

export function AssistantInput({
  disabled,
  onSend,
}: {
  disabled?: boolean;
  onSend: (prompt: string, streamId: string) => void;
}) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const createAssistantStream = useMutation(
    api.siteAssistant.createAssistantStream
  );

  async function submit() {
    const prompt = value.trim();
    if (!prompt || submitting || disabled) {
      return;
    }

    setSubmitting(true);
    setValue('');
    try {
      const streamId = await createAssistantStream({});
      onSend(prompt, streamId);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <form className="flex items-end gap-2 border-t p-3" onSubmit={handleSubmit}>
      <Textarea
        className="min-h-[40px] resize-none"
        disabled={disabled || submitting}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled
            ? "You've reached the limit for this session."
            : 'Ask about Flickmart...'
        }
        rows={1}
        value={value}
      />
      <Button
        aria-label="Send"
        disabled={disabled || submitting || !value.trim()}
        size="icon"
        type="submit"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
