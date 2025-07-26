"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo, useCallback } from "react"; // Added useCallback
import { Button } from "@/components/ui/button";
import WelcomeScreen from "@/components/chats/welcome-screen";
import ChatSidebar from "@/components/chats/chat-sidebar";
import ChatHeader from "@/components/chats/chat-header";
import ChatMessages from "@/components/chats/chat-messages";
import ChatInput from "@/components/chats/chat-input";
import { Wallet } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import UserProfile from "@/components/chats/user-profile";
import { useUploadThing } from "@/utils/uploadthing";
import Loader from "@/components/multipage/Loader";
import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";

// This interface must match what's expected in components/chats/chat-messages.tsx
interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Message {
  _id: Id<"message">;
  senderId: Id<"users">;
  content: string;
  conversationId: Id<"conversations">;
  _creationTime: number;
  readByUsers?: Id<"users">[];
  images?: string[]; // Add images to the Message interface
  type?: "text" | "product" | "image";
  product?: {
    title: string;
    price: number;
    image: string;
  };
}

interface ConversationUser {
  _id: Id<"users">;
  name: string;
  imageUrl?: string;
}

type FilterType = "all" | "unread" | "archived";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState<Id<"conversations"> | null>(
    null
  );
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("imageUploader");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showProfile, setShowProfile] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [processedProductId, setProcessedProductId] =
    useState<Id<"product"> | null>(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(true);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Get conversation ID from URL path or query params
  const conversationId = params?.conversationId as
    | Id<"conversations">
    | undefined;
  const vendorId = searchParams?.get("vendorId") as Id<"users"> | null;
  const productId = searchParams?.get("productId") as Id<"product"> | null;
  const activeConversationParam = searchParams?.get(
    "active"
  ) as Id<"conversations"> | null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user with improved authentication handling
  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();

  // Presence-related mutations
  const updatePresence = useMutation(api.presence.updatePresence);
  const updateTypingStatus = useMutation(api.presence.updateTypingStatus);
  const heartbeat = useMutation(api.presence.heartbeat);

  // Start conversation mutation
  const startConversation = useMutation(api.chat.startConversation);

  // Mark messages as read mutation
  const markMessagesAsRead = useMutation(api.chat.markMessagesAsRead);

  // Archive and unarchive conversation mutations
  const archiveConversation = useMutation(api.chat.archiveConversation);
  const unarchiveConversation = useMutation(api.chat.unarchiveConversation);

  // Fetch user's conversations
  const conversations = useQuery(
    api.chat.getConversations,
    user?._id ? { userId: user._id } : "skip"
  );

  // Fetch messages for active conversation
  const messages = useQuery(
    api.chat.getMessages,
    activeChat ? { conversationId: activeChat } : "skip"
  );

  // Fetch all users we need information about
  const allUserIds = useMemo(() => {
    const ids = new Set<Id<"users">>();

    // Add other users from conversations
    conversations?.forEach((conversation) => {
      if (conversation.user1 !== user?._id) ids.add(conversation.user1);
      if (conversation.user2 !== user?._id) ids.add(conversation.user2);
    });

    // Add vendor ID if present
    if (vendorId) ids.add(vendorId);

    return Array.from(ids);
  }, [conversations, user?._id, vendorId]);

  // Get all users' data in a single query
  const allUsers = useQuery(
    api.users.getMultipleUsers,
    allUserIds.length > 0 ? { userIds: allUserIds } : "skip"
  );

  // Get all conversations' last messages
  const conversationIds = useMemo(
    () => conversations?.map((conv) => conv._id) || [],
    [conversations]
  );

  // Get messages for all conversations
  const allConversationMessages = useQuery(
    api.chat.getAllConversationsMessages,
    conversationIds.length > 0 ? { conversationIds } : "skip"
  );

  // Mutation to send a message
  const sendMessage = useMutation(api.chat.sendMessage);

  // Get presence information for the active conversation
  const conversationPresence = useQuery(
    api.presence.getConversationPresence,
    activeChat ? { conversationId: activeChat } : "skip"
  );

  // Fetch product data if productId is present
  const product = useQuery(
    api.product.getById,
    productId ? { productId } : "skip"
  );

  // Function to send initial product message - Use useCallback to memoize
  const sendInitialProductMessage = useCallback(
    async (
      conversationId: Id<"conversations">,
      currentProductId: Id<"product">
    ) => {
      if (!user?._id || processedProductId === currentProductId || !product)
        return;

      try {
        await sendMessage({
          senderId: user._id,
          conversationId: conversationId,
          type: "product",
          productId: currentProductId,
          price: product?.price,
          title: product?.title,
          productImage: product?.images[0],
          content: `Hey i'm interested in this product, ${product?.title} is it still available?`,
        });
        setProcessedProductId(currentProductId);
      } catch (error) {
        console.error("Failed to send initial product message:", error);
        toast.error("Failed to send message");
      }
    },
    [user?._id, processedProductId, sendMessage, product]
  );

  // Handle archiving/unarchiving a conversation
  const handleArchiveToggle = async () => {
    if (!user?._id || !activeChat) return;

    try {
      const activeConversationData = conversations?.find(
        (c) => c._id === activeChat
      );
      if (!activeConversationData) return;

      const isArchived = activeConversationData.archivedByUsers?.includes(
        user._id
      );

      if (isArchived) {
        // Unarchive
        await unarchiveConversation({
          userId: user._id,
          conversationId: activeChat,
        });
        toast.success("Conversation unarchived");
      } else {
        // Archive
        await archiveConversation({
          userId: user._id,
          conversationId: activeChat,
        });
        toast.success("Conversation archived");
      }
    } catch (error) {
      console.error("Failed to toggle archive status:", error);
      toast.error("Failed to update conversation");
    }
  };

  // Mark messages as read when the conversation is viewed
  useEffect(() => {
    const markAsRead = async () => {
      if (activeChat && user?._id) {
        try {
          await markMessagesAsRead({
            userId: user._id,
            conversationId: activeChat,
          });
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      }
    };

    markAsRead();
  }, [activeChat, user?._id, markMessagesAsRead, messages]);

  // Handle initiating chat with vendor
  useEffect(() => {
    const initVendorChat = async () => {
      // Only proceed if we have a vendorId, user, and productId,
      // and this specific productId hasn't been processed yet.
      if (
        vendorId &&
        user?._id &&
        productId &&
        product &&
        processedProductId !== productId
      ) {
        try {
          // Check if the conversation already exists
          const existingConv = conversations?.find(
            (conv) =>
              (conv.user1 === vendorId && conv.user2 === user._id) ||
              (conv.user1 === user._id && conv.user2 === vendorId)
          );

          let targetConversationId: Id<"conversations">;

          if (existingConv) {
            targetConversationId = existingConv._id;
            setActiveChat(targetConversationId);
          } else {
            // Create new conversation
            targetConversationId = await startConversation({
              user1Id: user._id,
              user2Id: vendorId,
            });
            setActiveChat(targetConversationId);
          }

          // Send initial product message, passing the determined conversation ID and product ID
          await sendInitialProductMessage(targetConversationId, productId);

          // Update URL to remove query params if successful
          router.replace(`/chats`);
        } catch (error) {
          console.error("Failed to start conversation with vendor:", error);
          toast.error("Failed to start conversation with vendor");
        }
      }
    };

    // Ensure conversations and user are loaded before attempting to initialize vendor chat
    if (
      conversations !== undefined &&
      user !== undefined &&
      product !== undefined
    ) {
      initVendorChat();
    }
  }, [
    vendorId,
    user,
    conversations,
    startConversation,
    router,
    productId,
    processedProductId, // Keep this here to re-run only when product id changes
    sendInitialProductMessage, // Add sendInitialProductMessage to dependencies
    product,
  ]);

  // Set active chat based on URL params
  useEffect(() => {
    if (conversationId) {
      setActiveChat(conversationId);
    } else if (activeConversationParam) {
      setActiveChat(activeConversationParam);
      // Clean URL
      router.replace("/chats");
    }
  }, [conversationId, activeConversationParam, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [messages, activeChat]);

  // Determine if the other user is typing
  const otherUserIsTyping = useMemo(() => {
    if (!user?._id || !conversationPresence || !activeChat) return false;

    const otherUser =
      conversationPresence.user1.userId === user._id
        ? conversationPresence.user2
        : conversationPresence.user1;

    return otherUser.isTyping;
  }, [user?._id, conversationPresence, activeChat]);

  // Determine if the other user is online
  const otherUserIsOnline = useMemo(() => {
    if (!user?._id || !conversationPresence || !activeChat) return false;

    const otherUser =
      conversationPresence.user1.userId === user._id
        ? conversationPresence.user2
        : conversationPresence.user1;

    return otherUser.status === "online";
  }, [user?._id, conversationPresence, activeChat]);

  // Update online presence with heartbeat
  useEffect(() => {
    if (!user?._id) return;

    // Initial presence update
    updatePresence({
      userId: user._id,
      status: "online",
      isTyping: false,
      typingInConversation: undefined,
    });

    // Set up regular heartbeat interval
    const intervalId = setInterval(() => {
      heartbeat({ userId: user._id });
    }, 5000); // Send heartbeat every 5 seconds

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      // Update to offline when leaving
      updatePresence({
        userId: user._id,
        status: "offline",
        isTyping: false,
        typingInConversation: undefined,
      });
    };
  }, [user?._id, updatePresence, heartbeat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    // Update typing status when input changes
    if (user?._id && activeChat) {
      // If input is not empty, set typing to true
      if (newInput.trim().length > 0 && !isTyping) {
        setIsTyping(true);
        updateTypingStatus({
          userId: user._id,
          isTyping: true,
          conversationId: activeChat,
        });
      }

      // If input is empty, set typing to false
      if (newInput.trim().length === 0 && isTyping) {
        setIsTyping(false);
        updateTypingStatus({
          userId: user._id,
          isTyping: false,
          conversationId: undefined,
        });
      }
    }
  };

  // Add debounce effect for typing status
  useEffect(() => {
    if (!user?._id || !activeChat) return;

    // When user stops typing for 2 seconds, reset typing status
    if (isTyping) {
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        updateTypingStatus({
          userId: user._id,
          isTyping: false,
          conversationId: undefined,
        });
      }, 2000);

      return () => clearTimeout(typingTimer);
    }
  }, [input, isTyping, user?._id, activeChat, updateTypingStatus]);

  // Handle chat selection from sidebar
  const handleChatSelect = (chatId: Id<"conversations">) => {
    setActiveChat(chatId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Transform conversations data to match UI requirements
  const formattedConversations = useMemo(() => {
    if (!conversations || !allUsers || !allConversationMessages || !user?._id)
      return [];

    return conversations.map((conversation) => {
      // Determine the other participant (not the current user)
      const otherUserId =
        conversation.user1 === user._id
          ? conversation.user2
          : conversation.user1;

      // Find user in our pre-fetched users
      const otherUser = allUsers.find((u) => u._id === otherUserId);

      // Get last messages for this conversation
      const conversationMessages = allConversationMessages
        .filter((msg) => msg.conversationId === conversation._id)
        .sort((a, b) => b._creationTime - a._creationTime);

      // Get the last message
      const lastMessage =
        conversationMessages.length > 0 ? conversationMessages[0] : null;
      const containsImage: boolean =
        conversationMessages[0]?.images?.length &&
        conversationMessages[0].images?.length > 0
          ? true
          : false;

      // Format timestamp from the last message
      const lastMessageTime = lastMessage
        ? new Date(lastMessage._creationTime).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : "";

      // Check if conversation is archived by this user
      const isArchived =
        conversation.archivedByUsers?.includes(user._id) || false;

      // Get unread count for current user
      const userUnreadCount =
        conversation.unreadCount && user._id in conversation.unreadCount
          ? conversation.unreadCount[user._id as string]
          : 0;

      const name =
        otherUser?._id === user?._id ? "Me" : otherUser?.name || "Unknown user";

      return {
        id: conversation._id,
        name: name,
        imageUrl: otherUser?.imageUrl || "",
        lastMessage: lastMessage?.content ?? "No messages yet",
        containsImage: containsImage,
        time: lastMessageTime,
        unread: userUnreadCount,
        archived: isArchived,
      };
    });
  }, [conversations, allUsers, allConversationMessages, user?._id]);

  // Filter conversations based on the active filter
  const filteredConversations = useMemo(() => {
    return formattedConversations.filter((chat) => {
      // Apply search filter
      const matchesSearch =
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply tab filter
      if (activeFilter === "unread") {
        return matchesSearch && chat.unread > 0;
      } else if (activeFilter === "archived") {
        return matchesSearch && chat.archived;
      }

      return matchesSearch;
    });
  }, [formattedConversations, searchQuery, activeFilter]);

  // Format messages for the UI ensuring they have the correct role type
  const formattedMessages = useMemo(() => {
    return (messages || []).map((message) => {
      const role: "user" | "assistant" =
        message.senderId === user?._id ? "user" : "assistant";

      // Determine message status (sent, delivered, read)
      let status: "sent" | "delivered" | "read" = "sent";

      if (message.readByUsers && message.readByUsers.length > 0) {
        const otherUserRead = message.readByUsers.some(
          (id) => id !== user?._id
        );
        status = otherUserRead ? "read" : "delivered";
      }

      return {
        id: message._id,
        chatId: message.conversationId,
        content: message.content ?? "", // Ensure content is always a string
        images: message.images || [],
        role,
        timestamp: new Date(message._creationTime),
        status: message.senderId === user?._id ? status : undefined,
        type: message.type,
        title: message.title || "",
        price: message.price || 0,
        productImage: message.productImage || "",
      };
    });
  }, [messages, user?._id]);

  // Get conversation data for the active chat
  const activeConversation = useMemo(
    () => conversations?.find((conv) => conv._id === activeChat),
    [conversations, activeChat]
  );

  const otherUserId = useMemo(() => {
    if (!activeConversation || !user?._id) return null;
    return activeConversation.user1 === user._id
      ? activeConversation.user2
      : activeConversation.user1;
  }, [activeConversation, user?._id]);

  // Find the other user in our pre-fetched users
  const otherUser = useMemo(
    () => (otherUserId ? allUsers?.find((u) => u._id === otherUserId) : null),
    [allUsers, otherUserId]
  );

  // Check if the active conversation is archived
  const isActiveConversationArchived = useMemo(() => {
    if (!activeConversation || !user?._id) return false;
    return activeConversation.archivedByUsers?.includes(user._id) || false;
  }, [activeConversation, user?._id]);

  const activeChatData = useMemo(
    () =>
      activeChat && otherUser
        ? {
            name: otherUser.name || "Unknown User",
            image: otherUser.imageUrl || "",
          }
        : null,
    [activeChat, otherUser]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (!input.trim() && selectedImages.length === 0) ||
      !user?._id ||
      !activeChat
    )
      return;

    try {
      // Reset typing status
      setIsTyping(false);
      updateTypingStatus({
        userId: user._id,
        isTyping: false,
        conversationId: undefined,
      });

      let imageUrls: string[] | undefined = [];
      if (selectedImages.length > 0) {
        try {
          const res = await startUpload(selectedImages);
          imageUrls = res?.map((file) => file.ufsUrl);
        } catch (error) {
          console.error("Failed to upload images:", error);
          toast.error("Failed to upload images");
          return;
        }
      }

      // Send message with text and/or images
      await sendMessage({
        senderId: user._id,
        content: input,
        conversationId: activeChat,
        images: imageUrls,
        type: "text",
      });

      setInput("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleInputWrapper = (value: string) => {
    // Call your existing function with a simulated event
    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  if (authLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }
  return (
    <div className="flex h-[calc(100vh-74px)] w-full overflow-hidden bg-gray-100 !leading-normal">
      {/* Sidebar */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeChat={activeChat}
        setActiveChat={handleChatSelect}
        setSidebarOpen={setSidebarOpen}
        conversations={filteredConversations}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden !leading-normal">
        {activeChat ? (
          <div className="flex flex-col h-full">
            <ChatHeader
              toggleSidebar={toggleSidebar}
              activeChatData={activeChatData}
              isTyping={otherUserIsTyping!}
              isOnline={otherUserIsOnline}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              selectedMessages={selectedMessages}
              setSelectedMessages={setSelectedMessages}
            />
            <div className="flex-1 overflow-y-auto">
              <ChatMessages
                messages={formattedMessages}
                selectionMode={selectionMode}
                setSelectionMode={setSelectionMode}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
              />
              <div ref={messagesEndRef} />
            </div>
            <div className="fixed bottom-[120px] right-6 z-20 flex flex-col gap-2">
              <Link href={`/wallet/transfer?vendorId=${otherUserId}`}>
                <Button
                  size="icon"
                  className="rounded-full shadow-md bg-green-600 hover:bg-green-700"
                >
                  <Wallet className="w-4 h-4 " />
                </Button>
              </Link>
            </div>
            <div className={`w-full ${sidebarOpen ? "md:pl-64" : ""}`}>
              <ChatInput
                input={input}
                setInput={handleInputWrapper}
                handleSubmit={handleSubmit}
                selectedImages={selectedImages}
                isUploading={isUploading}
                setSelectedImages={setSelectedImages}
              />
            </div>
            <UserProfile
              open={showProfile}
              onClose={() => setShowProfile(false)}
              userId={otherUserId!}
            />
          </div>
        ) : (
          <WelcomeScreen onOpenSidebar={toggleSidebar} />
        )}
      </div>
    </div>
  );
}
