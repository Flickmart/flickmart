'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onOpenSidebar: () => void;
}

export default function WelcomeScreen({ onOpenSidebar }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-4">
      <Image
        alt="logo"
        height={400}
        src="/chat-avatars/Character.svg"
        width={400}
      />
      <Button
        className="bg-flickmart text-white hover:bg-flickmart-chat-orange md:hidden"
        onClick={onOpenSidebar}
      >
        Start a conversation
      </Button>
    </div>
  );
}
