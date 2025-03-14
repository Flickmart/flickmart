"use client";
import ChatItem from "@/components/chats/ChatItem";
import SearchBar from "@/components/chats/SearchBar";
import MobileNav from "@/components/MobileNav";
import { ChevronLeft, EllipsisVertical, Link, Menu } from "lucide-react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

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

export const demoChats: Chat[] = [
  {
    userId: "1",
    chatId: "1",
    avatar: "/chat-avatars/chat-avatar-1.png",
    name: "FlickMart",
    preview: "welcome to flickmart your one stop",
    timestamp: "7:45 PM",
    unread: 3,
  },
  {
    userId: "2",
    chatId: "2",
    avatar: "/chat-avatars/chat-avatar-2.png",
    name: "Fisayo",
    preview:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
    timestamp: "02 Dec",
    unread: 3,
  },
  {
    userId: "3",
    chatId: "3",
    avatar: "/chat-avatars/chat-avatar-3.png",
    name: "Felix",
    preview:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
    timestamp: "03 Apr",
    unread: 0,
  },
  {
    userId: "4",
    chatId: "4",
    avatar: "/chat-avatars/chat-avatar-4.png",
    name: "Fashola",
    preview:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
    timestamp: "8:32 PM",
    unread: 2,
  },
];
export const demoProfiles: Profile[] = [
  {
    userId: "1",
    avatar: "/chat-avatars/chat-avatar-1.png",
    name: "FlickMart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae molestias optio cumque molestiae aliquid minus?",
    products: [...Array(8)],
  },
  {
    userId: "2",
    avatar: "/chat-avatars/chat-avatar-2.png",
    name: "FlickMart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae molestias optio cumque molestiae aliquid minus?",
    products: [...Array(8)],
  },
  {
    userId: "3",
    avatar: "/chat-avatars/chat-avatar-3.png",
    name: "FlickMart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae molestias optio cumque molestiae aliquid minus?",
    products: [...Array(8)],
  },
  {
    userId: "4",
    avatar: "/chat-avatars/chat-avatar-4.png",
    name: "FlickMart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae molestias optio cumque molestiae aliquid minus?",
    products: [...Array(8)],
  },
];

const ChatContext = createContext<{
  currentConversation: string | null;
  setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>;
  setChat: Dispatch<SetStateAction<Array<{ message: string; type: string }>>>;
  socket: Socket;
  chat: Array<{
    message: string;
    type: string;
  }>;
} | null>(null);

export default function layout({ children }: { children: React.ReactNode }) {
  const tabs: string[] = ["all", "unread", "archived"];
  const [currentProfile, setCurrentProfile] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<{ message: string; type: string }>>(
    []
  );

  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const socket = io();
  const value = {
    currentConversation,
    setCurrentConversation,
    socket,
    chat,
    setChat,
  };

  return (
    <>
      {/* <MobileNav /> */}
      <main className=" md:grid md:grid-cols-2 md:min-h-screen  md:shadow-[0_4px_4px_#00000040] lg:grid-cols-[35%_65%]  relative">
        <section
          className={` ${currentConversation || currentProfile ? "hidden md:block" : ""} py-7 px-3`}
        >
          <header className="shadow-lg py-4 px-2 flex items-center justify-between sticky top-0 bg-white md:static md:bg-transparent md:px-4 md:shadow-none md:py-0">
            <Link
              href="/home"
              type="button"
              className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 md:hidden"
            >
              <ChevronLeft size={35} strokeWidth={1.5} />
              Chats
            </Link>
            <button
              type="button"
              className="transition-colors text-flickmart-gray hover:text-flickmart duration-300 md:hidden"
            >
              <EllipsisVertical strokeWidth={1.5} />
            </button>
            <h2 className="uppercase text-flickmart font-semibold text-xl hidden md:block">
              Chats
            </h2>
            <button
              type="button"
              className="hidden transition-colors text-flickmart-gray hover:text-flickmart duration-300 md:block"
            >
              <Menu />
            </button>
          </header>
          <SearchBar />
          <div className="px-4 mt-5 space-x-3">
            {tabs.map((tab, index) => (
              <button
                type="button"
                key={tab}
                className={`capitalize bg-flickmart-chat-gray px-4 py-2 rounded-full text-sm ${index === 0 ? "bg-[#ff810050] text-[#FF8100]" : "text-black/65"} hover:bg-[#FF810050] hover:text-[#FF8100] transition-colors duration-300 `}
              >
                {tab}
              </button>
            ))}
          </div>
          <ul className="mt-5">
            {demoChats.map((demoChat) => {
              return (
                <ChatItem
                  demoChat={demoChat}
                  key={demoChat.chatId}
                  setCurrentConversation={setCurrentConversation}
                  setCurrentProfile={setCurrentProfile}
                />
              );
            })}
          </ul>
        </section>
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      </main>
    </>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  return context;
}
