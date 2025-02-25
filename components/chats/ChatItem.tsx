import { Chat } from "@/app/chats/page";
import Image from "next/image";
import { Dispatch } from "react";

const ChatItem = ({
  demoChat: { chatId ,userId, avatar, name, preview, timestamp, unread },
  setCurrentConversation,
  setCurrentProfile
}: {
  demoChat: Chat;
  setCurrentConversation: Dispatch<string>;
  setCurrentProfile: Dispatch<string | null>;
}) => {
  return (
    <li
      onClick={() => {
        // Temporary code to demo how the app would behave in production
        setCurrentConversation(chatId);
        setCurrentProfile(null)
      }}
      className="p-4 border-b border-black/15 first:border-t-0 flex items-center justify-between cursor-pointer transition-colors hover:bg-flickmart-chat-gray/60 conditional-no-hover-effect group"
    >
      <div className="flex items-center">
        <button
        onClick={(e)=>{
          e.stopPropagation()
          // Temporary code to demo how the app would behave in production
          setCurrentProfile(userId)
        }}
          type="button"
          className="rounded-full outline outline-2 outline-white transition-all duration-300 hover:!outline-flickmart group-hover:outline-flickmart-chat-gray/60"
        >
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={47}
            className="w-14 flex-none"
          />
        </button>
        <div className="ml-4">
          <h2 className="font-medium mb-2">{name}</h2>
          <p className="text-[13px] font-light">
            {preview.length > 33
              ? preview.slice(0, 34).trim() + "..."
              : preview}
          </p>
        </div>
      </div>
      <div className="text-[13px] flex flex-col items-end ml-1 gap-2">
        <span
          className={`inline-block whitespace-nowrap ${unread ? "text-flickmart" : "text-black/50"} `}
        >
          {timestamp}
        </span>
        {unread !== 0 && (
          <span className="bg-flickmart  size-5 text-center text-white rounded-full">
            {unread}
          </span>
        )}
      </div>
    </li>
  );
};
export default ChatItem;
