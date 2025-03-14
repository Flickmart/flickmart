"use client";
import ConversationTab from "@/components/chats/ConversationTab";
import ProfileTab from "@/components/chats/ProfileTab";
import Image from "next/image";
import React, { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatItem from "@/components/chats/ChatItem";
import SearchBar from "@/components/chats/SearchBar";
import MobileNav from "@/components/MobileNav";
import { ChevronLeft, EllipsisVertical, Link, Menu } from "lucide-react";
import { Chat, Profile } from "./layout";

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

export default function page() {
  const [currentProfile, setCurrentProfile] = useState<string | null>(null);
  const tabs: string[] = ["all", "unread", "archived"];
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );

  const context = useChat();

  // useEffect(function () {
  //   const user = JSON.parse(localStorage.getItem("user")!); //temporary

  //   // Connect to socket server on page load
  //   context?.socket.on("connect", () => {
  //     console.log(`${context?.socket.id} socket connected`);
  //   });
  //   const name = (user?.user_metadata.name as string)?.split(" ").join("");

  //   // Join room
  //   context?.socket.emit("join", { name });

  //   // Create event to listen for messages from server
  //   context?.socket.on(
  //     "privateMessage",
  //     (data: { message: string; type: string; time: string }) => {
  //       context.setChat((prev) => [...prev, data]);
  //     }
  //   );

  //   return () => {
  //     context?.socket.disconnect();
  //   };
  // }, []);

  return (
    <main>
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

      {currentProfile ? (
        <ProfileTab
          currentProfile={demoProfiles.find(
            (item) => item.userId === currentProfile
          )}
          setCurrentProfile={setCurrentProfile}
        />
      ) : (
        <section
          className={`bg-[#D9D9D926] ${currentConversation ? "" : ""} relative md:h-screen overflow-y-auto`}
        >
          {currentConversation ? null : (
            // <ConversationTab
            // currentConversation={demoChats.find(
            //   (item) => item.chatId === context.currentConversation
            // )}
            // setCurrentConversation={context.setCurrentConversation}
            // setCurrentProfile={setCurrentProfile}
            // />
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
      )}
    </main>
  );
}
