'use client';

import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlarmClock,
  Banknote,
  Bell,
  ChevronDown,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  ShoppingBag,
  ThumbsUp,
} from 'lucide-react';
import { type JSX, useEffect, useState } from 'react';
import { toast } from 'sonner';
import MobileHeader from '@/components/MobileHeader';
import Day from '@/components/notifications/Day';
import { Spinner } from '@/components/Spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from 'backend/convex/_generated/api';
import { useAuthUser } from '@/hooks/useAuthUser';
import { cn } from '@/lib/utils';

export type Notification = {
  icon: string;
  text: string;
  time: string;
  id?: string;
  isRead?: boolean;
  link?: string;
  imageUrl?: string;
  type?: string;
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'new_message':
      return '/image-group.png';
    case 'new_like':
      return '/checkmark.png';
    case 'new_comment':
      return '/image-group.png';
    case 'new_sale':
      return '/checkmark.png';
    case 'advertisement':
      return '/image-group.png';
    case 'reminder':
      return '/image-group.png';
    default:
      return '/image-group.png';
  }
};

type NotificationType =
  | 'all'
  | 'new_message'
  | 'new_like'
  | 'new_comment'
  | 'new_sale'
  | 'advertisement'
  | 'reminder'
  | 'escrow_funded'
  | 'escrow_released'
  | 'completion_confirmed';

const notificationLabels: Record<NotificationType, string> = {
  all: 'All Types',
  new_message: 'Messages',
  new_like: 'Likes',
  new_comment: 'Comments',
  new_sale: 'Sales',
  advertisement: 'Ads',
  reminder: 'Reminders',
  escrow_funded: 'Payment made',
  escrow_released: 'Payment released',
  completion_confirmed: 'Confirm Transaction',
};

// icons for each notification type
const notificationIcons: Record<NotificationType, JSX.Element> = {
  all: <Bell className="h-5 w-5" />,
  new_message: <MessageCircle className="h-5 w-5" />,
  new_like: <ThumbsUp className="h-5 w-5" />,
  new_comment: <MessageSquareText className="h-5 w-5" />,
  new_sale: <ShoppingBag className="h-5 w-5" />,
  advertisement: <Megaphone className="h-5 w-5" />,
  reminder: <AlarmClock className="h-5 w-5" />,
  escrow_funded: <Banknote className="h-5 w-5" />,
  escrow_released: <Banknote className="h-5 w-5" />,
  completion_confirmed: <Banknote className="h-5 w-5" />,
};

const Page = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [selectedType, setSelectedType] = useState<NotificationType>('all');
  const [open, setOpen] = useState(false); // Track popover open state

  const options: NotificationType[] = [
    'all',
    'new_message',
    'new_like',
    'new_comment',
    'new_sale',
    'advertisement',
    'reminder',
    'escrow_funded',
    'escrow_released',
    'completion_confirmed',
  ];

  const {
    user: convexUser,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthUser();
  const allNotifications =
    useQuery(
      api.notifications.getNotifications,
      convexUser?._id
        ? {
            userId: convexUser?._id,
          }
        : 'skip'
    ) || [];
  const _unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];
  const unreadNotificationsByReadStatus =
    useQuery(api.notifications.getUnreadNotificationsByReadStatus) || [];
  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );
  const markAllAsViewed = useMutation(
    api.notifications.markAllNotificationsAsViewed
  );
  const deleteAllNotifications = useMutation(
    api.notifications.deleteAllNotifications
  );

  const filteredNotifications = (
    activeTab === 'all' ? allNotifications : unreadNotificationsByReadStatus
  ).filter(
    (notification) =>
      selectedType === 'all' || notification.type === selectedType
  );

  const unreadCount = unreadNotificationsByReadStatus.length;

  const handleMarkAllAsRead = async (): Promise<void> => {
    // Check if there are any unread notifications
    if (unreadCount === 0) {
      toast.info('All notifications are already read');
      return;
    }
    toast.promise(markAllAsRead(), {
      loading: 'Marking all notifications as read...',
      success: 'All notifications marked as read',
      error: 'Failed to mark notifications as read',
    });
  };

  const handleDeleteAll = async (): Promise<void> => {
    toast.promise(deleteAllNotifications(), {
      loading: 'Deleting all notifications...',
      success: 'All notifications deleted',
      error: 'Failed to delete notifications',
    });
  };

  function handleScroll() {
    if (window.innerWidth >= 640) {
      return;
    }
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // Hide on scroll down
    } else {
      setIsVisible(true); // Show on scroll up
    }
    setLastScrollY(window.scrollY);
  }

  // Remove the redirect effect since useAuthUser handles it

  useEffect(() => {
    addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Mark all notifications as viewed when the page is opened
    // This resets the unread count but doesn't mark individual notifications as read
    if (convexUser?._id) {
      markAllAsViewed();
    }
  }, [convexUser?._id, markAllAsViewed]);

  // Group notifications by day (today, yesterday, older)
  const groupedNotifications = (() => {
    if (!filteredNotifications) {
      return {};
    }

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterday = today - 86_400_000; // 24 hours in milliseconds

    return filteredNotifications.reduce(
      (groups: Record<string, Notification[]>, notification) => {
        const timestamp = notification.timestamp;
        const notificationDate = new Date(timestamp).getTime();

        let day;
        if (notificationDate >= today) {
          day = 'Today';
        } else if (notificationDate >= yesterday) {
          day = 'Yesterday';
        } else {
          day = 'Older';
        }

        if (!groups[day]) {
          groups[day] = [];
        }

        groups[day].push({
          id: notification._id,
          icon: notification.imageUrl || getIconForType(notification.type),
          text: notification.content,
          time: formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
          }),
          isRead: notification.isRead,
          link: notification.link,
          imageUrl: notification.imageUrl,
          type: notification.type,
        });

        return groups;
      },
      {}
    );
  })();

  if (authLoading || !filteredNotifications) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return (
    <main className="">
      <MobileHeader
        rightSlot={
          <button
            className="cursor-pointer font-medium text-flickmart text-sm hover:underline"
            onClick={handleMarkAllAsRead}
            type="button"
          >
            Mark all as Read
          </button>
        }
      />
      <div className="relative flex w-full items-center justify-center py-4">
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 font-medium transition">
              {notificationLabels[selectedType]}
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-screen rounded-2xl border bg-white p-2 text-gray-500 md:w-[500px] xl:w-[500px]">
            <ul className="space-y-1">
              {options.map((type) => (
                <li key={type}>
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-4 transition',
                      selectedType === type &&
                        'bg-flickmart/10 font-semibold text-black'
                    )}
                    onClick={() => {
                      setSelectedType(type);
                      setOpen(false);
                    }}
                  >
                    {notificationIcons[type]}
                    {notificationLabels[type]}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={`${isVisible ? 'translate-y-0' : '-translate-y-full'} sticky top-[77px] z-30 flex h-[60px] items-center justify-between bg-white px-[18px] font-semibold shadow-lg transition-all duration-300 sm:top-0 sm:h-[80px] sm:translate-y-0`}
      >
        <div className="flex gap-2">
          <button
            className={
              activeTab === 'all' ? 'text-flickmart' : 'text-flickmart-gray'
            }
            onClick={() => setActiveTab('all')}
            type="button"
          >
            All
          </button>
          <button
            className={
              activeTab === 'unread' ? 'text-flickmart' : 'text-flickmart-gray'
            }
            onClick={() => setActiveTab('unread')}
            type="button"
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>
      <div className="mt-10 flex w-full items-center justify-between gap-2 px-[18px] sm:block">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
              variant="outline"
            >
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all notifications? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
                onClick={handleDeleteAll}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          className="ml-2 hidden bg-flickmart hover:bg-flickmart/80 sm:inline-block"
          onClick={handleMarkAllAsRead}
          type="button"
        >
          Mark all as Read
        </Button>
      </div>
      {Object.entries(groupedNotifications).map(([day, dayNotifications]) => (
        <Day day={day} key={day} notifications={dayNotifications} />
      ))}
      {Object.keys(groupedNotifications).length === 0 && (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-lg">No notifications to display</p>
        </div>
      )}
    </main>
  );
};
export default Page;
