import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  toggleSidebar: () => void;
  activeChatData: {
    name: string;
  } | null;
  isTyping: boolean;
  isOnline?: boolean;
}

export default function ChatHeader({
  toggleSidebar,
  activeChatData,
  isTyping,
  isOnline = false,
}: ChatHeaderProps) {
  return (
    <div className="p-2 flex items-center shadow-md z-10">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 text-white md:hidden"
        onClick={toggleSidebar}
      >
        <ChevronLeft className="h-16 w-16 text-black" />
      </Button>
      <Avatar>
        <AvatarImage src={activeChatData?.name} alt={activeChatData?.name} />
        <AvatarFallback className="bg-flickmart text-white">
          {activeChatData?.name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1 truncate">
        <h4 className="text-black text-md truncate">{activeChatData?.name}</h4>
        <div className="flex items-center">
          {isTyping ? (
            <p className="text-orange-500 text-sm truncate animate-pulse">
              typing...
            </p>
          ) : (
            <div className="flex items-center">
              {isOnline ? (
                <p className="text-flickmart-chat-orange text-sm truncate">
                  online
                </p>
              ) : (
                <p className="text-gray-500 text-sm truncate">offline</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
