import {
  Menu,
  Search,
  Archive,
  Image,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRef, useEffect } from "react";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  activeFilter: "all" | "unread" | "archived";
  setActiveFilter: (filter: "all" | "unread" | "archived") => void;
  activeChat: Id<"conversations"> | null;
  setActiveChat: (chatId: Id<"conversations">) => void;
  setSidebarOpen: (open: boolean) => void;
  conversations: Array<{
    id: Id<"conversations">;
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

  // Content of the sidebar
  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="px-3 py-2 flex items-center justify-between mt-4 md:mt-1 ">
        <div className="flex items-center">
          <h2 className="text-flickmart font-bold text-3xl md:text-xl  ">Chats</h2>
        </div>
        <Menu className="md:block hidden" />
      </div>

      {/* Search */}
      <div className="p-2 my-3 md:my-0 ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 py-2 bg-flickmart-chat-gray rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-3 px-2 mt-1">
        <button
          className={cn(
            "py-1 px-4 text-sm font-medium rounded-3xl bg-flickmart-chat-gray",
            activeFilter === "all"
              ? "border bg-[rgba(255,136,17,0.82)]"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={cn(
            "py-1 px-4 text-sm font-medium rounded-3xl bg-flickmart-chat-gray",
            activeFilter === "unread"
              ? "border bg-[rgba(255,136,17,0.82)]"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("unread")}
        >
          Unread
          {totalUnread > 0 && (
            <span className="absolute top-0 right-2 bg-orange-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
              {totalUnread}
            </span>
          )}
        </button>
        <button
          className={cn(
            "py-1 px-4 text-sm font-medium rounded-3xl bg-flickmart-chat-gray",
            activeFilter === "archived"
              ? "border bg-[rgba(255,136,17,0.82)]"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("archived")}
        >
          Archived
          {archivedCount > 0 && (
            <span className="absolute top-0 right-1 bg-gray-400 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
              {archivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100%-150px)] mt-4">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200 ",
                  activeChat === chat.id && "bg-orange-50"
                )}
                onClick={() => {
                  setActiveChat(chat.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.imageUrl} alt={chat.name} />
                  <AvatarFallback className="bg-flickmart text-white">
                    {chat?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center !leading-normal">
                    <h3
                      className={cn(
                        "font-medium truncate",
                        chat.unread > 0 && "font-semibold"
                      )}
                    >
                      {chat.name}
                      {chat.archived && (
                        <Archive className="h-3 w-3 inline ml-1 text-gray-400" />
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={cn(
                        "text-sm truncate flex items-center gap-x-1",
                        chat.unread > 0
                          ? "text-gray-800 font-medium"
                          : "text-gray-600"
                      )}
                    >
                      {chat.containsImage && <Image className="h-4 w-4" />}
                      {chat.lastMessage} 
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile sidebar as Sheet */}
      <div className="md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-full p-1" hideCloseButton>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar as permanent element */}
      <div className="hidden md:block w-[320px] border-r border-gray-200 bg-white mt-14 md:mt-0">
        <SidebarContent />
      </div>
    </>
  );
}
