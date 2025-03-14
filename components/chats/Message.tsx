import { useChat } from "@/app/chats/layout";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const Message = ({ message, type }: { message: string; type: string }) => {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const context = useChat();
  useEffect(
    function () {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [context?.chat]
  );
  return (
    <div
      ref={messageRef}
      className={`${type === "sent" ? "bg-[#F7BD54] self-end rounded-br-none" : "bg-[#F0F0F0] rounded-bl-none"} shadow-[0_4px_4px_#00000040] px-3 pt-3 pb-[6px] rounded-xl text-black/70 w-max max-w-[75%]`}
    >
      <p className="text-sm mb-2">{message}</p>
      <div className="flex items-center gap-1 justify-end">
        <span className="text-xs">8:28pm</span>
        <CheckCheck color="#6461FC" size={15} />
      </div>
    </div>
  );
};
export default Message;
