import { Dispatch, SetStateAction } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
interface ChatHeaderProps {
  toggleSidebar: () => void;
  activeChatData: {
    name: string;
  } | null;
  isTyping: boolean;
  isOnline?: boolean;
  showProfile: boolean;
  setShowProfile: (showProfile: boolean) => void;
  selectionMode: boolean;
  setSelectionMode: Dispatch<SetStateAction<boolean>>;
  selectedMessages: string[];
  setSelectedMessages: Dispatch<SetStateAction<string[]>>;
}

export default function ChatHeader({
  toggleSidebar,
  activeChatData,
  isTyping,
  isOnline = false,
  showProfile,
  setShowProfile,
  selectionMode,
  setSelectionMode,
  setSelectedMessages,
  selectedMessages,
}: ChatHeaderProps) {
  const deleteMessages = useMutation(api.chat.deleteMessages);

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedMessages([]);
    }
  };
  const handleDeleteMessages = async () => {
    const promise =  deleteMessages({
      messageIds: selectedMessages as Id<"message">[],
    });
    toast.promise(promise, {
      loading: "Deleting messages...",
      success: "Messages deleted succesully",
      error: "Failed to delete messages",
    });
    setSelectedMessages([]);
    setSelectionMode(false);
  };
  if (selectionMode) {
    return (
      <div className="bg-flickmart/70 z-50 text-white p-2 flex items-center justify-between">
        <>
          <Button
            variant="ghost"
            className="text-white hover:bg-flickmart/90"
            onClick={toggleSelectionMode}
          >
            Cancel
          </Button>
          <span>{selectedMessages.length} selected</span>
          <Button
            variant="ghost"
            className="text-white hover:bg-flickmart/90"
            onClick={handleDeleteMessages}
            disabled={selectedMessages.length === 0}
          >
            <Trash2 size={20} />
          </Button>
        </>
      </div>
    );
  }

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

      <div
        className="flex items-center flex-1 cursor-pointer hover:bg-gray-100 rounded-md p-2 transition-colors"
        onClick={handleProfileToggle}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={activeChatData?.name} alt={activeChatData?.name} />
          <AvatarFallback className="bg-flickmart text-white">
            {activeChatData?.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="ml-3 flex-1 truncate">
          <h4 className="text-black text-md truncate font-medium">
            {activeChatData?.name}
          </h4>
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
    </div>
  );
}
