"use client";

import SearchBar from "@/components/chats/SearchBar";
import ChatItem from "@/components/chats/ChatItem";
import { ChevronLeft, EllipsisVertical, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ConversationTab from "@/components/chats/ConversationTab";

export interface Chat {
  id: string;
  avatar: string;
  name: string;
  preview: string;
  timestamp: string;
  unread: number;
}

const page = () => {
  const tabs: string[] = ["all", "unread", "archived"];
  const demoChats: Chat[] = [
    {
      id: "1",
      avatar: "/chat-avatars/chat-avatar-1.png",
      name: "FlickMart",
      preview: "welcome to flickmart your one stop",
      timestamp: "7:45 PM",
      unread: 3,
    },
    {
      id: "2",
      avatar: "/chat-avatars/chat-avatar-2.png",
      name: "Fisayo",
      preview:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
      timestamp: "02 Dec",
      unread: 3,
    },
    {
      id: "3",
      avatar: "/chat-avatars/chat-avatar-3.png",
      name: "Felix",
      preview:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
      timestamp: "03 Apr",
      unread: 0,
    },
    {
      id: "4",
      avatar: "/chat-avatars/chat-avatar-4.png",
      name: "Fashola",
      preview:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore dolores voluptatum accusamus, itaque mollitia!",
      timestamp: "8:32 PM",
      unread: 2,
    },
  ];
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    "1"
  );
  return (
    <main className="max-w-[1440px] md:grid md:grid-cols-2 md:mt-20 md:mx-4 md:h-[711px] lg:mx-12 md:shadow-[0_4px_4px_#00000040] lg:grid-cols-[35%_65%] 2xl:mx-auto relative">
      <section
        className={`md:pt-4 ${currentConversation ? "hidden md:block" : ""}`}
      >
        <header className="shadow-lg py-4 px-2 flex items-center justify-between sticky top-0 bg-white md:static md:bg-transparent md:px-4 md:shadow-none md:py-0">
          <button
            type="button"
            className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 md:hidden"
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
            Chats
          </button>
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
                key={demoChat.id}
                setCurrentConversation={setCurrentConversation}
              />
            );
          })}
        </ul>
      </section>
      <section
        className={`bg-[#D9D9D926] ${currentConversation ? "" : ""} relative md:h-[711px]`}
      >
        {currentConversation ? (
          <ConversationTab
            currentConversation={demoChats.find(
              (item) => item.id === currentConversation
            )}
            setCurrentConversation={setCurrentConversation}
          />
        ) : (
          <div className="text-center hidden absolute w-full top-1/2 -translate-y-1/2 md:block">
            <Image
              src="/chat-avatars/Character.svg"
              alt="woman throwing a paper airplane"
              width={312}
              height={312}
              className="mx-auto w-1/2 max-w-[300px]"
            />
            <p className="font-light mt-2">
              Select a chat to view conversation.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};
export default page;
