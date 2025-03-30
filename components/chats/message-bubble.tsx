import { Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: string
  isUser: boolean
  timestamp: string
  status?: "sent" | "delivered" | "read"
}

export default function MessageBubble({ message, isUser, timestamp, status = "read" }: MessageBubbleProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] sm:max-w-[70%] md:max-w-[65%] rounded-lg p-2 md:p-3 shadow-sm",
          isUser ? "bg-flickmart text-white rounded-br-none" : "bg-background text-foreground rounded-bl-none",
        )}
      >
        <p className="break-words text-sm md:text-base">{message}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-[10px] md:text-xs opacity-70">{timestamp}</span>
          {isUser && (
            <span className="text-[10px] md:text-xs">
              {status === "sent" && <Check className="h-4 w-5 inline" />}
              {status === "delivered" && <CheckCheck className="h-4 w-5 inline te" />}
              {status === "read" && <CheckCheck className="h-4 w-5 inline text-blue-500" />}
            </span>
          )}
        </div>  
      </div>
    </div>
  );
}
