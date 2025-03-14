import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export interface Chat {
  userId: string;
  chatId: string;
  avatar: string;
  name: string;
  preview: string;
  timestamp: string;
  unread: number;
}
export interface Profile {
  userId: string;
  avatar: string;
  name: string;
  desc: string;
  products: undefined[];
}

export const ChatContext = createContext<{
  setChat: Dispatch<SetStateAction<Array<{ message: string; type: string }>>>;
  chat: Array<{
    message: string;
    type: string;
  }>;
} | null>(null);

export default function layout({ children }: { children: React.ReactNode }) {
  const [chat, setChat] = useState<Array<{ message: string; type: string }>>(
    []
  );

  const value = {
    chat,
    setChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
