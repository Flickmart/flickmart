"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
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

interface Message {
  _id: Id<"message">;
  senderId: Id<"users">;
  content: string;
  conversationId: Id<"conversations">;
  _creationTime: number;
  readByUsers?: Id<"users">[];
  images?: string[];
  type?: "text" | "product" | "image" | "transfer";
  product?: {
    title: string;
    price: number;
    image: string;
  };
  // Transfer-specific fields
  orderId?: Id<"orders">;
  transferAmount?: number;
  currency?: string;
  order?: any;
}

export default function ConversationPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

  const conversationId = params?.conversationId as Id<"conversations">;
  const vendorId = searchParams?.get("vendorId") as Id<"users"> | null;
  const productId = searchParams?.get("productId") as Id<"product"> | null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user
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

  // Fetch messages for active conversation
  const messages = useQuery(
    api.chat.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  // Fetch conversation details
  const conversation = useQuery(
    api.chat.getConversation,
    conversationId ? { conversationId } : "skip"
  );

  // Get the other user's ID
  const otherUserId = useMemo(() => {
    if (!conversation || !user?._id) return null;
    return conversation.user1 === user._id
      ? conversation.user2
      : conversation.user1;
  }, [conversation, user?._id]);

  // Fetch other user's data
  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { userId: otherUserId } : "skip"
  );

  // Mutation to send a message
  const sendMessage = useMutation(api.chat.sendMessage);

  // Get presence information for the active conversation
  const conversationPresence = useQuery(
    api.presence.getConversationPresence,
    conversationId ? { conversationId } : "skip"
  );

  // Fetch product data if productId is present
  const product = useQuery(
    api.product.getById,
    productId ? { productId } : "skip"
  );

  // Function to send initial product message
  const sendInitialProductMessage = useCallback(
    async (currentProductId: Id<"product">) => {
      if (
        !user?._id ||
        processedProductId === currentProductId ||
        !product ||
        !conversationId
      ) {
        console.log("Skipping product message send:", {
          hasUser: !!user?._id,
          alreadyProcessed: processedProductId === currentProductId,
          hasProduct: !!product,
          hasConversation: !!conversationId,
        });
        return;
      }

      try {
        console.log("Sending product message:", {
          productId: currentProductId,
          productTitle: product.title,
          conversationId,
        });

        await sendMessage({
          senderId: user._id,
          conversationId: conversationId,
          type: "product",
          productId: currentProductId,
          price: product?.price,
          title: product?.title,
          productImage: product?.images?.[0],
          content: `Hey i'm interested in this product, ${product?.title} is it still available?`,
        });
        setProcessedProductId(currentProductId);
        console.log("Product message sent successfully");
      } catch (error) {
        console.error("Failed to send initial product message:", error);
        toast.error("Failed to send message");
      }
    },
    [user?._id, processedProductId, sendMessage, product, conversationId]
  );

  // Handle product message when productId is present
  useEffect(() => {
    if (productId && product && processedProductId !== productId) {
      console.log("Sending initial product message for product:", productId);
      sendInitialProductMessage(productId);
      // Clean URL
      router.replace(`/chat/${conversationId}`);
    }
  }, [
    productId,
    product,
    processedProductId,
    sendInitialProductMessage,
    router,
    conversationId,
  ]);

  // Mark messages as read when the conversation is viewed
  useEffect(() => {
    const markAsRead = async () => {
      if (conversationId && user?._id) {
        try {
          await markMessagesAsRead({
            userId: user._id,
            conversationId,
          });
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      }
    };

    markAsRead();
  }, [conversationId, user?._id, markMessagesAsRead, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Determine if the other user is typing
  const otherUserIsTyping = useMemo(() => {
    if (!user?._id || !conversationPresence || !conversationId) return false;

    const otherUser =
      conversationPresence.user1.userId === user._id
        ? conversationPresence.user2
        : conversationPresence.user1;

    return otherUser.isTyping;
  }, [user?._id, conversationPresence, conversationId]);

  // Determine if the other user is online
  const otherUserIsOnline = useMemo(() => {
    if (!user?._id || !conversationPresence || !conversationId) return false;

    const otherUser =
      conversationPresence.user1.userId === user._id
        ? conversationPresence.user2
        : conversationPresence.user1;

    return otherUser.status === "online";
  }, [user?._id, conversationPresence, conversationId]);

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
    }, 5000);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
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
    if (user?._id && conversationId) {
      if (newInput.trim().length > 0 && !isTyping) {
        setIsTyping(true);
        updateTypingStatus({
          userId: user._id,
          isTyping: true,
          conversationId,
        });
      }

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
    if (!user?._id || !conversationId) return;

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
  }, [input, isTyping, user?._id, conversationId, updateTypingStatus]);

  // Format messages for the UI
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
        content: message.content ?? "",
        images: message.images || [],
        role,
        timestamp: new Date(message._creationTime),
        status: message.senderId === user?._id ? status : undefined,
        type: message.type,
        title: message.title || "",
        price: message.price || 0,
        productImage: message.productImage || "",
        productId: message.productId,
        // Transfer-specific fields
        orderId: message.orderId,
        transferAmount: message.transferAmount,
        currency: message.currency,
        order: message.order,
      };
    });
  }, [messages, user?._id]);

  const activeChatData = useMemo(
    () =>
      conversationId && otherUser
        ? {
            name: otherUser.name || "Unknown User",
            image: otherUser.imageUrl || "",
          }
        : null,
    [conversationId, otherUser]
  );

  const toggleSidebar = () => {
    // On mobile, navigate back to chat list
    if (window.innerWidth < 768) {
      router.push("/chat");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (!input.trim() && selectedImages.length === 0) ||
      !user?._id ||
      !conversationId
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
        conversationId,
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
    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (authLoading) {
    return (
      <div className="h-full grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Invalid Conversation
          </h2>
          <p className="text-gray-500">
            The conversation you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while conversation is being fetched
  if (conversation === undefined) {
    return (
      <div className="h-full grid place-items-center">
        <Loader />
      </div>
    );
  }

  // Show error if conversation doesn't exist
  if (conversation === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Conversation Not Found
          </h2>
          <p className="text-gray-500">
            This conversation doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        toggleSidebar={toggleSidebar}
        activeChatData={activeChatData}
        isTyping={otherUserIsTyping ? otherUserIsTyping : false}
        isOnline={otherUserIsOnline}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedMessages={selectedMessages}
        setSelectedMessages={setSelectedMessages}
        vendorId={otherUserId!}
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

      {/* Wallet transfer button */}
      <div className="fixed bottom-[120px] right-6 z-20 flex flex-col gap-2">
        <Link href={`/wallet/transfer?vendorId=${otherUserId}`}>
          <Button
            size="icon"
            className="rounded-full shadow-md bg-green-600 hover:bg-green-700"
          >
            <Wallet className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Chat input */}
      <div className="w-full">
        <ChatInput
          input={input}
          setInput={handleInputWrapper}
          handleSubmit={handleSubmit}
          selectedImages={selectedImages}
          isUploading={isUploading}
          setSelectedImages={setSelectedImages}
        />
      </div>

      {/* User profile modal */}
      <UserProfile
        open={showProfile}
        onClose={() => setShowProfile(false)}
        userId={otherUserId!}
      />
    </div>
  );
}
