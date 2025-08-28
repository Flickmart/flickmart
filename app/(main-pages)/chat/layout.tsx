'use client';

import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import ChatSidebar from '@/components/chats/chat-sidebar';
import Loader from '@/components/multipage/Loader';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

type FilterType = 'all' | 'unread' | 'archived';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();

  // Fetch user's conversations
  const conversations = useQuery(
    api.chat.getConversations,
    user?._id ? { userId: user._id } : 'skip'
  );

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

  // Transform conversations data to match UI requirements
  const formattedConversations = useMemo(() => {
    if (!(conversations && allUsers && allConversationMessages && user?._id))
      return [];

    return conversations.map((conversation) => {
      // Determine the other participant (not the current user)
      const otherUserId =
        conversation.user1 === user._id
          ? conversation.user2
          : conversation.user1;

      // Find user in our pre-fetched users
      const otherUser = allUsers.find((u) => u?._id === otherUserId);

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
            hour: 'numeric',
            minute: '2-digit',
          })
        : '';

      // Check if conversation is archived by this user
      const isArchived =
        conversation.archivedByUsers?.includes(user._id) ?? false;

      // Get unread count for current user
      const userUnreadCount =
        conversation.unreadCount && user._id in conversation.unreadCount
          ? conversation.unreadCount[user._id as string]
          : 0;

      const name =
        otherUser?._id === user?._id ? 'Me' : otherUser?.name || 'Unknown user';

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
      if (activeFilter === 'unread') {
        return matchesSearch && chat.unread > 0;
      }
      if (activeFilter === 'archived') {
        return matchesSearch && chat.archived;
      }

      return matchesSearch;
    });
  }, [formattedConversations, searchQuery, activeFilter]);

  if (authLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-69px)] w-full overflow-hidden bg-gray-100">
      {/* Sidebar - always visible on desktop */}
      <div className="hidden w-[360px] border-gray-200 border-r bg-white md:block">
        <ChatSidebar
          activeChat={null}
          activeFilter={activeFilter}
          conversations={filteredConversations}
          searchQuery={searchQuery}
          setActiveChat={() => {}}
          setActiveFilter={setActiveFilter}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={false}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
