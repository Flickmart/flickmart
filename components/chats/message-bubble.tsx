import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
interface MessageBubbleProps {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  selectionMode: boolean;
  selectedMessages: string[];
  handleLongPress: (messageId: string) => void;
  toggleMessageSelection: (messageId: string) => void;
  toggleSelectionMode: () => void;
}

export default function MessageBubble({
  message,
  isUser,
  timestamp,
  status = "read",
  id,
  selectionMode,
  selectedMessages,
  toggleMessageSelection,
  toggleSelectionMode,
  handleLongPress,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        selectionMode && "cursor-pointer"
      )}
      onClick={() => selectionMode && toggleMessageSelection(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress(id);
      }}
      onTouchStart={() => {
        const timer = setTimeout(() => {
          handleLongPress(id);
        }, 500);
        return () => clearTimeout(timer);
      }}
    >
      <div
        className={cn(
          "max-w-[75%] sm:max-w-[70%] md:max-w-[65%] rounded-lg p-2 md:p-3 shadow-sm",
          isUser
            ? "bg-flickmart text-white rounded-br-none"
            : "bg-background text-foreground rounded-bl-none",
          selectedMessages.includes(id) &&
            "bg-green-100 border-2 border-green-500 max-w-full"
        )}
      >
        <p className="break-words text-sm md:text-base">{message}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-[10px] md:text-xs opacity-70">{timestamp}</span>
          {isUser && (
            <span className="text-[10px] md:text-xs">
              {status === "sent" && <Check className="h-4 w-4 inline" />}
              {status === "delivered" && (
                <CheckCheck className="h-4 w-4 inline" />
              )}
              {status === "read" && (
                <CheckCheck className="h-4 w-4 inline text-blue-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
