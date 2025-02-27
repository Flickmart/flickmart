import { Dispatch } from "react";
import { Chat } from "@/app/chats/page";
import { ChevronLeft, EllipsisVertical, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import CallNow from "./CallNow";
import Warning from "./Warning";
import Message from "./Message";
import SendMessage from "./SendMessage";

const ConversationTab = ({
  currentConversation,
  setCurrentConversation,
  setCurrentProfile,
}: {
  currentConversation: Chat | undefined;
  setCurrentConversation: Dispatch<string | null>;
  setCurrentProfile: Dispatch<string | null>;
}) => {
  if (!currentConversation) {
    return notFound();
  }
  return (
    <section className="min-h-screen md:min-h-0 md:h-full relative md:pt-[150px]">
      <header className="shadow-md py-4 z-20 px-2 flex items-center justify-between bg-white sticky top-0 md:absolute md:w-full">
        <div className="flex">
          <button
            onClick={() => {
              setCurrentConversation(null);
            }}
            type="button"
            className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 mr-2"
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-full outline outline-2 outline-white transition-all duration-300 hover:outline-flickmart"
              onClick={() => {
                setCurrentProfile(currentConversation.userId);
              }}
            >
              <Image
                src={currentConversation?.avatar}
                width={40}
                height={40}
                alt={currentConversation?.name}
              />
            </button>
            <div className="flex flex-col ">
              <button
                type="button"
                className=" transition-all duration-300 hover:text-flickmart"
                onClick={() => {
                  setCurrentProfile(currentConversation.userId);
                }}
              >
                {currentConversation?.name}
              </button>
              <span className="text-flickmart text-[13px]">Online</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="transition-colors text-flickmart-gray hover:text-flickmart duration-300"
        >
          <EllipsisVertical strokeWidth={1.5} />
        </button>
      </header>
      <CallNow />
      <section className="relative md:h-full md:overflow-scroll">
        <Warning />
        <p className="text-center text-sm mt-8 text-black/65 font-light mb-6">
          August, 28 2024
        </p>
        <div className="w-max bg-white shadow-md px-2 py-1 text-sm font-light rounded mx-auto">
          Monday
        </div>
        <section className="py-20 px-5 flex flex-col gap-7">
          <Message message="Good evening." type="sent" />
          <Message message="Good evening" type="received" />
          <Message
            message="I sell great shoes of good quality sir. How many would you like to purchase?"
            type="received"
          />
          <Message
            message="I sell great shoes of good quality sir. How many would you like to purchase?"
            type="sent"
          />
          <Message
            message="I sell great shoes of good quality sir. How many would you like to purchase?"
            type="received"
          />
          <Message
            message="I sell great shoes of good quality sir. How many would you like to purchase?"
            type="sent"
          />
        </section>
      </section>
      <button className="fixed bottom-[100px] right-[25px] bg-flickmart-chat-orange p-3 rounded-full shadow-[0_0_5px_4px_#00000025] md:absolute">
        <Wallet color="white" />
      </button>
      <SendMessage />
    </section>
  );
};
export default ConversationTab;
