'use client';

import { MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

export function AssistantLauncher() {
  return (
    <DialogTrigger asChild>
      <Button
        aria-label="Open Flickmart Assistant"
        className="fixed right-4 bottom-24 z-50 h-12 w-12 rounded-full shadow-lg lg:bottom-6"
        size="icon"
      >
        <MessageCircleQuestion className="h-5 w-5" />
      </Button>
    </DialogTrigger>
  );
}
