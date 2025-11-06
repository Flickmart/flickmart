import { Skeleton } from '../ui/skeleton';

const ChatSkeleton = () => {
  return (
    <div className="md:bg-gray-100">
      <div className="h-screen space-y-4 bg-white pt-8 md:w-[360px]">
        <div className="mb-8 px-3 md:mb-6">
          <Skeleton className="h-8 w-20 bg-flickmart-chat-gray md:h-6 md:w-[52px]" />{' '}
          {/* "Chats" */}
        </div>

        {/* Search bar */}
        <div className="px-3">
          <Skeleton className="h-9 w-full rounded-lg bg-flickmart-chat-gray" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 px-3">
          <Skeleton className="h-7 w-12 rounded-full bg-flickmart-chat-gray" />
          <Skeleton className="h-7 w-16 rounded-full bg-flickmart-chat-gray" />
          <Skeleton className="h-7 w-20 rounded-full bg-flickmart-chat-gray" />
        </div>

        {/* Messages */}
        <SidebarSkeleton />
      </div>
    </div>
  );
};
export default ChatSkeleton;

export const SidebarSkeleton = () => {
  return (
    <div className="mx-auto w-full space-y-4 px-3 pt-5">
      {[...new Array(5)].map((_, i) => (
        <div className="flex items-center space-x-3" key={i}>
          {/* Avatar */}
          <Skeleton className="size-12 rounded-full bg-flickmart-chat-gray" />

          {/* Text Content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 bg-flickmart-chat-gray" />{' '}
            {/* Name */}
            <Skeleton className="h-3 w-2/3 bg-flickmart-chat-gray" />{' '}
            {/* Message preview */}
          </div>

          {/* Time */}
          <Skeleton className="h-3 w-8 bg-flickmart-chat-gray" />
        </div>
      ))}
    </div>
  );
};
