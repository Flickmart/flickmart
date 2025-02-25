import { CheckCheck } from "lucide-react";

const Message = ({
  message,
  type,
}: {
  message: string;
  type: "sent" | "received";
}) => {
  return (
    <div
      className={`${type === "sent" ? "bg-[#F7BD54] self-end rounded-br-none" : "bg-[#F0F0F0] rounded-bl-none"} shadow-[0_4px_4px_#00000040] px-3 pt-3 pb-[6px] rounded-xl text-black/70 max-w-[50%]`}
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
