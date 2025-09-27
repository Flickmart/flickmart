'use client';

import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ChatSidebar from '@/components/chats/chat-sidebar';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { useAppPresence } from '@/hooks/useAppPresence';
import { useAuthUser } from '@/hooks/useAuthUser';

type FilterType = 'all' | 'unread' | 'archived';

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [, setSidebarOpen] = useState(false);

  // Get URL parameters for vendor chat initiation
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const { presenceState } = useAppPresence();

  console.log('Presense state', presenceState);

  const vendorId = searchParams.get('vendorId') as Id<'users'> | null;
  const productId = searchParams.get('productId') as Id<'product'> | null;

  // Fetch user's conversations
  const conversations = useQuery(
    api.chat.getConversations,
    user?._id ? { userId: user._id } : 'skip'
  );

  // Start conversation mutation
  const startConversation = useMutation(api.chat.startConversation);

  // Fetch all users we need information about
  const allUserIds = useMemo(() => {
    const ids = new Set<Id<'users'>>();

    // Add other users from conversations
    conversations?.forEach((conversation) => {
      if (conversation.user1 !== user?._id) ids.add(conversation.user1);
      if (conversation.user2 !== user?._id) ids.add(conversation.user2);
    });

    return Array.from(ids);
  }, [conversations, user?._id]);

  // Get all users' data in a single query
  const allUsers = useQuery(
    api.users.getMultipleUsers,
    allUserIds.length > 0 ? { userIds: allUserIds } : 'skip'
  );

  // Get all conversations' last messages
  const conversationIds = useMemo(
    () => conversations?.map((conv) => conv._id) || [],
    [conversations]
  );

  // Get messages for all conversations
  const allConversationMessages = useQuery(
    api.chat.getAllConversationsMessages,
    conversationIds.length > 0 ? { conversationIds } : 'skip'
  );

  // Helper function to format a single conversation
  const formatConversation = (
    conversation: Doc<'conversations'>,
    currentUserId: Id<'users'>,
    users: Doc<'users'>[],
    messages: any[]
  ) => {
    const otherUserId =
      conversation.user1 === currentUserId
        ? conversation.user2
        : conversation.user1;

    const otherUser = users.find((u) => u?._id === otherUserId);

    const conversationMessages = messages
      .filter((msg) => msg.conversationId === conversation._id)
      .sort((a, b) => b._creationTime - a._creationTime);

    const lastMessage = conversationMessages[0] || null;
    const containsImage = Boolean(lastMessage?.images?.length);

    const lastMessageTime = lastMessage
      ? new Date(lastMessage._creationTime).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })
      : '';

    const isArchived = conversation.archivedByUsers?.includes(currentUserId);
    const userUnreadCount =
      conversation.unreadCount && currentUserId in conversation.unreadCount
        ? conversation.unreadCount[currentUserId]
        : 0;

    const name =
      otherUser?._id === currentUserId
        ? 'Me'
        : otherUser?.name || 'Unknown user';

    return {
      id: conversation._id,
      name,
      imageUrl: otherUser?.imageUrl || '',
      lastMessage: lastMessage?.content ?? 'No messages yet',
      containsImage,
      time: lastMessageTime,
      unread: userUnreadCount,
      archived: isArchived,
    };
  };

  // Transform conversations data to match UI requirements
  const formattedConversations = useMemo(() => {
    if (!(conversations && allUsers && allConversationMessages && user?._id)) {
      return;
    }

    return conversations.map((conversation) =>
      formatConversation(
        conversation,
        user._id,
        allUsers,
        allConversationMessages
      )
    );
  }, [conversations, allUsers, allConversationMessages, user?._id]);

  // Filter conversations based on the active filter
  const filteredConversations = useMemo(() => {
    return formattedConversations?.filter((chat) => {
      // Apply search filter
      const matchesSearch =
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply tab filter
      if (activeFilter === 'unread') {
        return matchesSearch && chat.unread > 0;
      }
      if (activeFilter === 'archived') {
        return matchesSearch && chat.archived;
      }

      return matchesSearch;
    });
  }, [formattedConversations, searchQuery, activeFilter]);

  // Handle vendor chat initiation
  useEffect(() => {
    const initVendorChat = async () => {
      if (vendorId && (user?._id || productId)) {
        try {
          // Validate that vendorId is different from current user
          if (vendorId === user?._id) {
            toast.error('Cannot start conversation with yourself');
            router.replace('/chat');
            return;
          }

          // Check if conversation already exists
          const existingConv = conversations?.find(
            (conv) =>
              (conv.user1 === vendorId && conv.user2 === user?._id) ||
              (conv.user1 === user?._id && conv.user2 === vendorId)
          );

          let targetConversationId: Id<'conversations'>;

          if (existingConv) {
            targetConversationId = existingConv._id;
          } else {
            targetConversationId = await startConversation({
              user1Id: user?._id as Id<'users'>,
              user2Id: vendorId,
            });
            console.log('Created new conversation:', targetConversationId);
          }

          // Navigate to the conversation with product parameters
          router.replace(
            `/chat/${targetConversationId}?productId=${productId}&vendorId=${vendorId}`
          );
        } catch (error) {
          console.error('Failed to start conversation with vendor:', error);
          toast.error('Failed to start conversation with vendor');
          // Remove query params and show error
          router.replace('/chat');
        }
      }
    };

    // Only run if we have all required data and conversations are loaded
    if (conversations !== undefined && user !== undefined) {
      initVendorChat();
    }
  }, [vendorId, user, conversations, startConversation, router, productId]);

  // On desktop, redirect to first conversation if available (only if no vendor chat)
  useEffect(() => {
    if (
      !vendorId &&
      conversations &&
      conversations.length > 0 &&
      window.innerWidth >= 768
    ) {
      router.replace(`/chat/${conversations[0]._id}`);
    }
  }, [conversations, router, vendorId]);

  // if (authLoading) {
  //   return (
  //     <div className="grid h-screen place-items-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="flex h-full w-full overflow-auto bg-gray-100">
      {/* Mobile: Show sidebar, Desktop: Show welcome message */}
      <div className="w-full md:hidden">
        <ChatSidebar
          activeChat={null}
          activeFilter={activeFilter}
          conversations={filteredConversations?.map((convo) => ({
            ...convo,
            archived: convo.archived ?? false,
          }))}
          searchQuery={searchQuery}
          setActiveChat={() => {}}
          setActiveFilter={setActiveFilter}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={false}
        />
      </div>

      {/* Desktop welcome message */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl text-gray-700">
            Welcome to Chat
          </h2>
          <p className="text-gray-500">
            {(() => {
              if (conversations === undefined) {
                return 'Loading conversations...';
              }
              if (conversations.length === 0) {
                return 'No conversations yet.Click on "Chat Vendor" to start a new conversation!';
              }
              return 'Select a conversation to start chatting';
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}
