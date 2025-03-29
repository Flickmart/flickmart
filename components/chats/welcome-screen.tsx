"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
interface WelcomeScreenProps {
  onOpenSidebar: () => void;
}

export default function WelcomeScreen({ onOpenSidebar }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
      <Image
        src="/chat-avatars/Character.svg"
        alt="logo"
        width={400}
        height={400}
      />
      <Button
        onClick={onOpenSidebar}
        className="bg-flickmart hover:bg-flickmart-chat-orange text-white md:hidden"
      >
        Start a conversation
      </Button>
    </div>
  );
}
