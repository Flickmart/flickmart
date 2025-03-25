import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { demoChats } from "@/lib/demo-data";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: "all" | "unread" | "archived";
  setActiveFilter: (filter: "all" | "unread" | "archived") => void;
  activeChat: string | null;
  setActiveChat: (chatId: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
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
}: ChatSidebarProps) {
  // Filter chats based on the active filter
  const filteredChats = demoChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "unread") {
      return matchesSearch && chat.unread > 0;
    } else if (activeFilter === "archived") {
      return matchesSearch && chat.archived;
    }

    return matchesSearch;
  });

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
            "flex-1 py-2 text-sm font-medium",
            activeFilter === "unread"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("unread")}
        >
          Unread
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium",
            activeFilter === "archived"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
          )}
          onClick={() => setActiveFilter("archived")}
        >
          Archived
        </button>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100%-150px)]">
        <div className="space-y-1">
          {filteredChats.map((chat) => (
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
                  </h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">
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
      </div>
    </div>
  );
} 