"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function ConversationPage({
  params,
}: {
  params: { conversationId: Id<"conversations"> };
}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main chat page with the conversation loaded
    router.push("/chats");
  }, [router]);

  return <div className="h-screen w-full flex items-center justify-center">Loading conversation...</div>;
} 