import { useMutation } from 'convex/react';
import { ChevronLeft, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type ChatHeaderProps = {
  aiEnabled: boolean;
  toggleSidebar: () => void;
  AIStatus: string;
  activeChatData: {
    name: string;
    image: string;
  } | null;
  isTyping: boolean;
  isOnline?: boolean;
  showProfile: boolean;
  setShowProfile: (showProfile: boolean) => void;
  selectionMode: boolean;
  setSelectionMode: Dispatch<SetStateAction<boolean>>;
  selectedMessages: string[];
  setSelectedMessages: Dispatch<SetStateAction<string[]>>;
  vendorId: Id<'users'>;
  userId: Id<'users'>;
  sellerId: Id<'users'>;
};

export default function ChatHeader({
  aiEnabled,
  sellerId,
  userId,
  toggleSidebar,
  activeChatData,
  AIStatus,
  isTyping,
  isOnline = false,
  showProfile,
  setShowProfile,
  selectionMode,
  setSelectionMode,
  setSelectedMessages,
  selectedMessages,
  vendorId,
}: ChatHeaderProps) {
  const deleteMessages = useMutation(api.chat.deleteMessages);

  const _handleProfileToggle = () => {
    // setShowProfile(!showProfile);
  };
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedMessages([]);
    }
  };
  const handleDeleteMessages = async () => {
    const promise = deleteMessages({
      messageIds: selectedMessages as Id<'message'>[],
    });
    toast.promise(promise, {
      loading: 'Deleting messages...',
      success: 'Messages deleted successfully',
      error: 'Failed to delete messages',
    });
    setSelectedMessages([]);
    setSelectionMode(false);
  };
  if (selectionMode) {
    return (
      <div className="z-50 flex items-center justify-between bg-flickmart/70 p-3 text-white">
        <Button
          className="text-white hover:bg-flickmart/90"
          onClick={toggleSelectionMode}
          variant="ghost"
        >
          Cancel
        </Button>
        <span>{selectedMessages.length} selected</span>
        <Button
          className="text-white hover:bg-flickmart/90"
          disabled={selectedMessages.length === 0}
          onClick={handleDeleteMessages}
          variant="ghost"
        >
          <Trash2 size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="z-10 flex items-center p-2 shadow-md">
      <Button
        className="mr-2 text-white md:hidden"
        onClick={toggleSidebar}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </Button>

      <Link href={`/vendors/${vendorId}`}>
        <div
          className="flex flex-1 cursor-pointer items-center rounded-md p-2 transition-colors hover:bg-gray-100"
          // onClick={handleProfileToggle}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              alt={activeChatData?.name}
              src={activeChatData?.image}
            />
            <AvatarFallback className="bg-flickmart text-white">
              {activeChatData?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="ml-3 flex-1 flex flex-col gap-1 truncate">
            <h4 className="truncate font-medium text-black text-md">
              {activeChatData?.name}
            </h4>
            <div className="flex items-center">
              {isTyping ? (
                <p className="animate-pulse truncate text-orange-500 text-sm">
                  typing...
                </p>
              ) : (
                <div className="flex items-center">
                  {isOnline ? (
                    <p className="truncate text-flickmart-chat-orange text-sm">
                      online
                    </p>
                  ) : (
                    sellerId === userId || !aiEnabled? <p className="truncate text-gray-500 text-sm">offline</p> :
                    AIStatus === "thinking" ? <p className='text-purple-600 animate-pulse font-medium text-xs'>Thinking...</p> :
                    AIStatus === "generating" ? <p className='text-purple-600 animate-pulse font-medium text-xs'>Generating response...</p> :
                    AIStatus === "done" && <p className="truncate text-purple-600 text-sm flex items-center gap-1"><Sparkles className="size-4" />NKEM AI</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

                    // <p className="truncate text-gray-500 text-sm">offline</p>
