import { Menu, Search, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: "all" | "unread" | "archived";
  setActiveFilter: (filter: "all" | "unread" | "archived") => void;
  activeChat: Id<"conversations"> | null;
  setActiveChat: (chatId: Id<"conversations">) => void;
  setSidebarOpen: (open: boolean) => void;
  conversations: Array<{
    id: Id<"conversations">;
    name: string;
    lastMessage: string;
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
  const archivedCount = conversations.filter(chat => chat.archived).length;

  return (
    <div
      className={cn(
        "fixed md:relative z-30 h-full bg-white transition-transform duration-300 ease-in-out border-r border-gray-200",
        "w-full md:w-[320px]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-flickmart font-bold text-xl">Chats</h2>
        </div>
        <Menu />
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search or start new chat"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium",
            activeFilter === "all"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium relative",
            activeFilter === "unread"
              ? "text-orange-500 border-b-2 border-orange-500"
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
            "flex-1 py-2 text-sm font-medium relative",
            activeFilter === "archived"
              ? "text-orange-500 border-b-2 border-orange-500"
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
      <div className="overflow-y-auto h-[calc(100%-150px)]">
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
                "flex items-center p-3 cursor-pointer hover:bg-gray-100",
                activeChat === chat.id && "bg-orange-50"
              )}
              onClick={() => {
                setActiveChat(chat.id);
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold",
                  chat.unread > 0 ? "bg-orange-500" : "bg-orange-300"
                )}
              >
                {chat.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
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
                    <p className={cn(
                      "text-sm truncate",
                      chat.unread > 0 ? "text-gray-800 font-medium" : "text-gray-600"
                    )}>
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
    </div>
  );
} 