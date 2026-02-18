'use client';

import { useMutation, useQuery } from 'convex/react';
import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ChatHeader from '@/components/chats/chat-header';
import ChatInput from '@/components/chats/chat-input';
import ChatMessages from '@/components/chats/chat-messages';
import UserProfile from '@/components/chats/user-profile';
import Loader from '@/components/multipage/Loader';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useUploadThing } from '@/utils/uploadthing';
import { StreamId } from '@convex-dev/persistent-text-streaming';
import { useStream } from "@convex-dev/persistent-text-streaming/react";


type Message = {
  _id: Id<'message'>;
  senderId: Id<'users'>;
  content: string;
  conversationId: Id<'conversations'>;
  _creationTime: number;
  readByUsers?: Id<'users'>[];
  images?: string[];
  type?: 'text' | 'product' | 'image' | 'transfer';
  product?: {
    title: string;
    price: number;
    image: string;
  };
  // Transfer-specific fields
  orderId?: Id<'orders'>;
  transferAmount?: number;
  currency?: string;
  order?: any;
};

type NegotiableRequest = {
  user_id: string;
  seller_id: string;
  product_name: string;
  actual_price: number;
  target_price: number;
  last_price: number;
  message: string;
  response: string;
};

export default function ConversationPage() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing('imageUploader');
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showProfile, setShowProfile] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [processedProductId, setProcessedProductId] =
    useState<Id<'product'> | null>(null);
  const [pendingMessages, setPendingMessages] = useState<
    Array<{
      id: string;
      content: string;
      images?: File[];
      timestamp: Date;
      isPending: boolean;
    }>
  >([]);

  const conversationId = params?.conversationId as Id<'conversations'>;
  const _vendorId = searchParams?.get('vendorId') as Id<'users'> | null;
  const productId = searchParams?.get('productId') as Id<'product'> | null;
  const [messageId, setMessageId] = useState<Id<"message"> | undefined>()
  const streamId = useQuery(api.chat.getStreamIdByMessageId, {
    messageId
  })
  const [showAIStream, setShowAIStream] = useState(false)
  const [prompt, setPrompt] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();

  // Typing status mutation
  const updateTypingStatus = useMutation(api.presence.updateTypingStatus);

  // Mark messages as read mutation
  const markMessagesAsRead = useMutation(api.chat.markMessagesAsRead);

  // Fetch messages for active conversation
  const messages = useQuery(
    api.chat.getMessages,
    conversationId ? { conversationId } : 'skip'
  );

  // Fetch conversation details
  const conversation = useQuery(
    api.chat.getConversation,
    conversationId ? { conversationId } : 'skip'
  );

  // Get the other user's ID
  const otherUserId = useMemo(() => {
    if (!(conversation && user?._id)) {
      return null;
    }
    return conversation.user1 === user._id
      ? conversation.user2
      : conversation.user1;
  }, [conversation, user?._id]);

  // Fetch other user's data
  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { userId: otherUserId } : 'skip'
  );

  // Mutation to send a message
  const sendMessage = useMutation(api.chat.sendMessage);

  // Get typing status for the active conversation
  const conversationTypingStatus = useQuery(
    api.presence.getConversationTypingStatus,
    conversationId ? { conversationId } : 'skip'
  );

  // Fetch product data if productId is present
  const product = useQuery(
    api.product.getById,
    productId ? { productId } : 'skip'
  );

  // Store in Local Storage
  // typeof vendorId === "string" && localStorage.setItem("vendorId", vendorId as string)

  // const vendorIdLocalStorage=  localStorage.getItem("vendorId")

  // Function to send initial product message
  const sendInitialProductMessage = useCallback(
    async (currentProductId: Id<'product'>) => {
      if (
        !user?._id ||
        processedProductId === currentProductId ||
        !product ||
        !conversationId
      ) {
        console.log('Skipping product message send:', {
          hasUser: !!user?._id,
          alreadyProcessed: processedProductId === currentProductId,
          hasProduct: !!product,
          hasConversation: !!conversationId,
        });
        return;
      }

      try {
        console.log('Sending product message:', {
          productId: currentProductId,
          productTitle: product.title,
          conversationId,
        });

        await sendMessage({
          senderId: user._id,
          conversationId,
          type: 'product',
          productId: currentProductId,
          price: product?.price,
          title: product?.title,
          productImage: product?.images?.[0],
          content: `Hey i'm interested in this product, ${product?.title} is it still available?`,
        });
        setProcessedProductId(currentProductId);
        console.log('Product message sent successfully');
      } catch (error) {
        console.error('Failed to send initial product message:', error);
        toast.error('Failed to send message');
      }
    },
    [user?._id, processedProductId, sendMessage, product, conversationId]
  );

  // Handle product message when productId is present
  useEffect(() => {
    if (productId && product && processedProductId !== productId) {
      console.log('Sending initial product message for product:', productId);
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
          console.error('Failed to mark messages as read:', error);
        }
      }
    };

    markAsRead();
  }, [conversationId, user?._id, markMessagesAsRead, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Determine if the other user is typing
  const otherUserIsTyping = useMemo(() => {
    if (!(user?._id && conversationTypingStatus && conversationId)) {
      return false;
    }

    const otherUser =
      conversationTypingStatus.user1.userId === user._id
        ? conversationTypingStatus.user2
        : conversationTypingStatus.user1;

    return otherUser.isTyping;
  }, [user?._id, conversationTypingStatus, conversationId]);

  // Get other user's online status using the new presence system
  const otherUserOnlineStatus = useQuery(
    api.presence.getUserOnlineStatus,
    otherUserId ? { userId: otherUserId } : 'skip'
  );

  console.log('otherUserId:', otherUserId);
  console.log('otherUserOnlineStatus:', otherUserOnlineStatus);
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
    if (!(user?._id && conversationId)) {
      return;
    }

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
    const actualMessages = (messages || []).map((message) => {
      const role: 'user' | 'assistant' =
        message.senderId === user?._id ? 'user' : 'assistant';

      // Determine message status (sent, delivered, read)
      let status: 'sent' | 'delivered' | 'read' = 'sent';

      if (message.readByUsers && message.readByUsers.length > 0) {
        const otherUserRead = message.readByUsers.some(
          (id) => id !== user?._id
        );
        status = otherUserRead ? 'read' : 'delivered';
      }

      return {
        id: message._id,
        chatId: message.conversationId,
        content: message.content ?? '',
        images: message.images || [],
        role,
        timestamp: new Date(message._creationTime),
        status: message.senderId === user?._id ? status : undefined,
        type: message.type,
        title: message.title || '',
        price: message.price || 0,
        productImage: message.productImage || '',
        productId: message.productId,
        // Transfer-specific fields
        orderId: message.orderId,
        transferAmount: message.transferAmount,
        currency: message.currency,
        isPending: false,
      };
    });

    const pendingMessagesList = pendingMessages.map((msg) => ({
      id: msg.id,
      chatId: conversationId,
      content: msg.content,
      images: [], // Pending messages don't have URLs yet
      role: 'user' as const,
      timestamp: msg.timestamp,
      status: 'sent' as const,
      type: 'text' as const,
      title: '',
      price: 0,
      productImage: '',
      productId: undefined,
      orderId: undefined,
      transferAmount: undefined,
      currency: undefined,
      isPending: true,
    }));

    return [...actualMessages, ...pendingMessagesList].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }, [messages, user?._id, pendingMessages, conversationId]);

  const activeChatData = useMemo(
    () =>
      conversationId && otherUser
        ? {
            name: otherUser.name || 'Unknown User',
            image: otherUser.imageUrl || '',
          }
        : null,
    [conversationId, otherUser]
  );

  const toggleSidebar = () => {
    // On mobile, navigate back to chat list
    if (window.innerWidth < 768) {
      router.push('/chat');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (!input.trim() && selectedImages.length === 0) ||
      !user?._id ||
      !conversationId
    ) {
      return;
    }

    // Create optimistic message ID
    const optimisticMessageId = `pending-${Date.now()}-${Math.random()}`;

    // Reset typing status
    setIsTyping(false);
    updateTypingStatus({
      userId: user._id,
      isTyping: false,
      conversationId: undefined,
    });

    // Clear input immediately for better UX
    const messageText = input;
    const messageImages = [...selectedImages];
    setPrompt(input)
    setInput('');
    setSelectedImages([]);

    // Add pending message to state
    setPendingMessages((prev) => [
      ...prev,
      {
        id: optimisticMessageId,
        content: messageText,
        images: messageImages,
        timestamp: new Date(),
        isPending: true,
      },
    ]);

    try {
      let imageUrls: string[] | undefined = [];
      if (messageImages.length > 0) {
        try {
          const res = await startUpload(messageImages);
          imageUrls = res?.map((file) => file.ufsUrl);
        } catch (error) {
          console.error('Failed to upload images:', error);
          toast.error('Failed to upload images');
          // Remove pending message on image upload failure
          setPendingMessages((prev) =>
            prev.filter((msg) => msg.id !== optimisticMessageId)
          );
          return;
        }
      }

      // Send message with text and/or images
      const chatId = await sendMessage({
        senderId: user._id,
        content: messageText,
        conversationId,
        images: imageUrls,
        type: 'text',
      });
      setShowAIStream(true)
      setMessageId(chatId)


     // Remove pending message on success
      setPendingMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessageId)
      );


    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      // Remove pending message on failure
      setPendingMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessageId)
      );
    }
  };

  const handleInputWrapper = (value: string) => {
    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (authLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">
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
      <div className="grid h-full place-items-center">
        <Loader />
      </div>
    );
  }

  // Show error if conversation doesn't exist
  if (conversation === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">
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
    <div className="flex h-full flex-col">
      <ChatHeader
        activeChatData={activeChatData}
        isOnline={otherUserOnlineStatus?.isOnline}
        isTyping={otherUserIsTyping ? otherUserIsTyping : false}
        selectedMessages={selectedMessages}
        selectionMode={selectionMode}
        setSelectedMessages={setSelectedMessages}
        setSelectionMode={setSelectionMode}
        setShowProfile={setShowProfile}
        showProfile={showProfile}
        toggleSidebar={toggleSidebar}
        vendorId={otherUserId!}
      />

      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          setShowAIStream={() => setShowAIStream(false)}
          messageId={messageId as Id<"message">}
          prompt={prompt}
          showAIStream= {showAIStream}
          streamId = {streamId as string}
          messages={formattedMessages}
          selectedMessages={selectedMessages}
          selectionMode={selectionMode}
          setSelectedMessages={setSelectedMessages}
          setSelectionMode={setSelectionMode}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Wallet transfer button */}
      <div className="fixed right-2 bottom-[120px] z-20 flex flex-col gap-2">
        <Link href={`/wallet/transfer?vendorId=${otherUserId}`}>
          <Button
            className="!size-12 rounded-full bg-[#FF8100] shadow-black/25 shadow-md"
            size="icon"
          >
            <Wallet className="!size-[22px]" />
          </Button>
        </Link>
      </div>

      {/* Chat input */}
      <div className="w-full">
        <ChatInput
          handleSubmit={handleSubmit}
          input={input}
          isUploading={isUploading}
          selectedImages={selectedImages}
          setInput={handleInputWrapper}
          setSelectedImages={setSelectedImages}
        />
      </div>

      {/* User profile modal */}
      <UserProfile
        onClose={() => setShowProfile(false)}
        open={showProfile}
        userId={otherUserId!}
      />
    </div>
  );
}
