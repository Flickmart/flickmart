"use client";
import ConversationTab from "@/components/chats/ConversationTab";
import ProfileTab from "@/components/chats/ProfileTab";
import Image from "next/image";
import React, { useState } from "react";
import { demoProfiles } from "./layout";
import { useChat } from "@/hooks/useChat";

export default function page() {
  const [currentProfile, setCurrentProfile] = useState<string | null>(null);
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
    <>
      {currentProfile ? (
        <ProfileTab
          currentProfile={demoProfiles.find(
            (item) => item.userId === currentProfile
          )}
          setCurrentProfile={setCurrentProfile}
        />
      ) : (
        <section
          className={`bg-[#D9D9D926] ${context?.currentConversation ? "" : ""} relative md:h-screen overflow-y-auto`}
        >
          {context?.currentConversation ? null : (
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
    </>
  );
}
