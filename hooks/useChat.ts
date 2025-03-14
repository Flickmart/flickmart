import { ChatContext } from "@/app/chats/layout";
import { useContext } from "react";

export function useChat() {
  const context = useContext(ChatContext);
  return context;
}
