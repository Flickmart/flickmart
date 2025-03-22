"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "@/components/chats/message-bubble";
import { demoChats, demoMessages } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import WelcomeScreen from "@/components/chats/welcome-screen";

type FilterType = "all" | "unread" | "archived";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState(demoMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [chatMessages, activeChat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      chatId: activeChat,
      content: input,
      role: "user" as const,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInput("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        chatId: activeChat,
        content: `This is a response to "${input}"`,
        role: "assistant" as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Filter chats based on the active filter
  const filteredChats = demoChats.filter((chat) => {
    // Apply search filter
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply tab filter
    if (activeFilter === "unread") {
      return matchesSearch && chat.unread > 0;
    } else if (activeFilter === "archived") {
      return matchesSearch && chat.archived;
    }

    return matchesSearch;
  });

  const activeMessages = activeChat
    ? chatMessages.filter((msg) => msg.chatId === activeChat)
    : [];

  const activeChatData = activeChat
    ? demoChats.find((chat) => chat.id === activeChat)
    : null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar - fixed position on mobile, regular position on desktop */}
      <div
        className={cn(
          "fixed md:relative z-30 h-full bg-white transition-transform duration-300 ease-in-out border-r border-gray-200",
          "w-full md:w-[320px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="bg-orange-500 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-orange-700 flex items-center justify-center text-white font-bold">
              M
            </div>
            <h2 className="ml-3 text-white font-medium">My Chats</h2>
          </div>
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
                  // Close sidebar on mobile after selection
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-1 w-full h-full">
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className="bg-orange-500 p-4 flex items-center shadow-md z-10">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white md:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-orange-700 flex items-center justify-center text-white font-bold">
                {activeChatData?.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1 truncate">
                <h1 className="text-white font-medium truncate">
                  {activeChatData?.name}
                </h1>
                <p className="text-white/70 text-sm truncate">
                  {isTyping ? "typing..." : "online"}
                </p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message.content}
                  isUser={message.role === "user"}
                  timestamp={message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  status={message.role === "user" ? "read" : undefined}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-3 md:p-4 bg-background border-t sticky bottom-0 left-0 right-0">
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a message"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Welcome screen when no chat is selected
          <WelcomeScreen onOpenSidebar={toggleSidebar} />
        )}
      </div>
    </div>
  );
}
