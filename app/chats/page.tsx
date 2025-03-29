"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { demoChats, demoMessages } from "@/lib/demo-data";
import WelcomeScreen from "@/components/chats/welcome-screen";
import ChatSidebar from "@/components/chats/chat-sidebar";
import ChatHeader from "@/components/chats/chat-header";
import ChatMessages from "@/components/chats/chat-messages";
import ChatInput from "@/components/chats/chat-input";
import { Wallet } from "lucide-react";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

type FilterType = "all" | "unread" | "archived";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(demoMessages);
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
    ? {
        name: demoChats.find((chat) => chat.id === activeChat)?.name || "",
      }
    : null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        {activeChat ? (
          <div className="flex flex-col h-full">
            <ChatHeader
              toggleSidebar={toggleSidebar}
              activeChatData={activeChatData}
              isTyping={isTyping}
            />
            <div className="flex-1 overflow-y-auto">
              <ChatMessages messages={activeMessages} />
            </div>
            <div className="fixed bottom-[88px] right-6 z-20">
              <Button size="icon" className="rounded-full">
                <Wallet className="w-h h-5" />
              </Button>
            </div>
            <div className={`w-full ${sidebarOpen ? "md:pl-64" : ""}`}>
              <ChatInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        ) : (
          <WelcomeScreen onOpenSidebar={toggleSidebar} />
        )}
      </div>
    </div>
  );
}
