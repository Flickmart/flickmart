import { Archive, Image, Menu, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import type { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import MobileNav from '../MobileNav';

interface ChatSidebarProps {
  sidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  activeFilter: 'all' | 'unread' | 'archived';
  setActiveFilter: (filter: 'all' | 'unread' | 'archived') => void;
  activeChat: Id<'conversations'> | null;
  setActiveChat: (chatId: Id<'conversations'>) => void;
  setSidebarOpen: (open: boolean) => void;
  conversations: Array<{
    id: Id<'conversations'>;
    name: string;
    imageUrl: string;
    lastMessage: string;
    containsImage: boolean;
    time: string;
    unread: number;
    archived: boolean;
  }>;
}

export default function ChatSidebar({
  sidebarOpen,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  activeChat,
  setActiveChat,
  setSidebarOpen,
  conversations,
}: ChatSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const currentConversationId = params?.conversationId as
    | Id<'conversations'>
    | undefined;

  // Count total unread messages
  const totalUnread = conversations.reduce((sum, chat) => sum + chat.unread, 0);

  // Count archived conversations
  const archivedCount = conversations.filter((chat) => chat.archived).length;

  // Create a ref for the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Effect to maintain focus on the search input after re-renders
  useEffect(() => {
    // Only focus if there's a search query and the input exists
    if (searchQuery && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery]);

  // Handle chat selection
  const handleChatSelect = (chatId: Id<'conversations'>) => {
    router.push(`/chat/${chatId}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Content of the sidebar
  const SidebarContent = () => (
    <>
      <MobileNav />
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-3 py-2 md:mt-1">
        <div className="flex items-center">
          <h2 className="font-bold text-3xl text-flickmart md:text-xl">
            Chats
          </h2>
        </div>
        <Menu className="hidden md:block" />
      </div>

      {/* Search */}
      <div className="my-3 p-2 md:my-0">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
          <Input
            className="rounded-lg bg-flickmart-chat-gray py-2 pl-9"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            ref={searchInputRef}
            value={searchQuery}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-1 flex items-center space-x-3 px-2">
        <button
          className={cn(
            'rounded-3xl bg-flickmart-chat-gray px-4 py-1 font-medium text-sm',
            activeFilter === 'all'
              ? 'border bg-[rgba(255,136,17,0.82)]'
              : 'text-gray-500 hover:text-orange-500'
          )}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={cn(
            'rounded-3xl bg-flickmart-chat-gray px-4 py-1 font-medium text-sm',
            activeFilter === 'unread'
              ? 'border bg-[rgba(255,136,17,0.82)]'
              : 'text-gray-500 hover:text-orange-500'
          )}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
          {totalUnread > 0 && (
            <span className="absolute top-0 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-white text-xs">
              {totalUnread}
            </span>
          )}
        </button>
        <button
          className={cn(
            'rounded-3xl bg-flickmart-chat-gray px-4 py-1 font-medium text-sm',
            activeFilter === 'archived'
              ? 'border bg-[rgba(255,136,17,0.82)]'
              : 'text-gray-500 hover:text-orange-500'
          )}
          onClick={() => setActiveFilter('archived')}
        >
          Archived
          {archivedCount > 0 && (
            <span className="absolute top-0 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-400 px-1 text-white text-xs">
              {archivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat List */}
      <div className="mt-4 h-[calc(100%-150px)] overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        ) : (
          <div>
            {conversations.map((chat) => (
              <div
                className={cn(
                  'flex cursor-pointer items-center border-gray-200 border-b p-3 pl-4 hover:bg-gray-100',
                  currentConversationId === chat.id && 'bg-orange-50'
                )}
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage alt={chat.name} src={chat.imageUrl} />
                  <AvatarFallback className="bg-flickmart text-white">
                    {chat?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="!leading-normal flex items-center justify-between">
                    <h3
                      className={cn(
                        'truncate font-medium',
                        chat.unread > 0 && 'font-semibold'
                      )}
                    >
                      {chat.name}
                      {chat.archived && (
                        <Archive className="ml-1 inline h-3 w-3 text-gray-400" />
                      )}
                    </h3>
                    <span className="text-gray-500 text-xs">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        'flex items-center gap-x-1 truncate text-sm',
                        chat.unread > 0
                          ? 'font-medium text-gray-800'
                          : 'text-gray-600'
                      )}
                    >
                      {chat.containsImage && <Image className="h-4 w-4" />}
                      {chat.lastMessage.length > 20
                        ? chat.lastMessage.substring(0, 40) + '...'
                        : chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-xs">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Extra spacing at bottom for better scrolling */}
            <div className="h-24" />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="h-full w-full bg-white">
      <SidebarContent />
    </div>
  );
}
