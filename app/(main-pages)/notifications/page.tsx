"use client";

import MobileHeader from "@/components/MobileHeader";
import Day from "@/components/notifications/Day";
import { useState, useEffect, JSX } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";
import { AlarmClock, Bell, ChevronDown, Megaphone, MessageCircle, MessageSquareText, ShoppingBag, ThumbsUp, Banknote } from "lucide-react";


export interface Notification {
  icon: string;
  text: string;
  time: string;
  id?: string;
  isRead?: boolean;
  link?: string;
  imageUrl?: string;
  type?: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "new_message":
      return "/image-group.png";
    case "new_like":
      return "/checkmark.png";
    case "new_comment":
      return "/image-group.png";
    case "new_sale":
      return "/checkmark.png";
    case "advertisement":
      return "/image-group.png";
    case "reminder":
      return "/image-group.png";
    default:
      return "/image-group.png";
  }
};

type NotificationType =
  | "all"
  | "new_message"
  | "new_like"
  | "new_comment"
  | "new_sale"
  | "advertisement"
  | "reminder"
  | "escrow_funded"
  | "escrow_released"
  | "completion_confirmed"

const notificationLabels: Record<NotificationType, string> = {
  all: "All Types",
  new_message: "Messages",
  new_like: "Likes",
  new_comment: "Comments",
  new_sale: "Sales",
  advertisement: "Ads",
  reminder: "Reminders",
  escrow_funded: "Payment made",
  escrow_released: "Payment released",
  completion_confirmed: "Confirm Transaction",
};

// icons for each notification type
const notificationIcons: Record<NotificationType, JSX.Element> = {
  all: <Bell className="w-5 h-5" />,
  new_message: <MessageCircle className="w-5 h-5" />,
  new_like: <ThumbsUp className="w-5 h-5" />,
  new_comment: <MessageSquareText className="w-5 h-5" />,
  new_sale: <ShoppingBag className="w-5 h-5" />,
  advertisement: <Megaphone className="w-5 h-5" />,
  reminder: <AlarmClock className="w-5 h-5" />,
  escrow_funded: <Banknote className="w-5 h-5" />,
  escrow_released: <Banknote className="w-5 h-5" />,
  completion_confirmed: <Banknote className="w-5 h-5" />,
};

const Page = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedType, setSelectedType] = useState<NotificationType>("all");
  const [open, setOpen] = useState(false); // Track popover open state

  const options: NotificationType[] = [
    "all",
    "new_message",
    "new_like",
    "new_comment",
    "new_sale",
    "advertisement",
    "reminder",
    "escrow_funded",
    "escrow_released",
    "completion_confirmed",
  ];

  const { user: convexUser, isLoading: authLoading, isAuthenticated } = useAuthUser();
  const allNotifications =
    useQuery(
      api.notifications.getNotifications,
      convexUser?._id
        ? {
          userId: convexUser?._id,
        }
        : "skip"
    ) || [];
  const unreadNotifications =
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
    activeTab === "all" ? allNotifications : unreadNotificationsByReadStatus
  ).filter(
    (notification) =>
      selectedType === "all" || notification.type === selectedType
  );

  const unreadCount = unreadNotificationsByReadStatus.length;

  const handleMarkAllAsRead = async (): Promise<void> => {
    // Check if there are any unread notifications
    if (unreadCount === 0) {
      toast.info("All notifications are already read");
      return;
    }
    toast.promise(markAllAsRead(), {
      loading: "Marking all notifications as read...",
      success: "All notifications marked as read",
      error: "Failed to mark notifications as read",
    });
  };

  const handleDeleteAll = async (): Promise<void> => {
    toast.promise(deleteAllNotifications(), {
      loading: "Deleting all notifications...",
      success: "All notifications deleted",
      error: "Failed to delete notifications",
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
    addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    if (!filteredNotifications) return {};

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterday = today - 86400000; // 24 hours in milliseconds

    return filteredNotifications.reduce(
      (groups: Record<string, Notification[]>, notification) => {
        const timestamp = notification.timestamp;
        const notificationDate = new Date(timestamp).getTime();

        let day;
        if (notificationDate >= today) {
          day = "Today";
        } else if (notificationDate >= yesterday) {
          day = "Yesterday";
        } else {
          day = "Older";
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
      <div className="h-screen flex items-center justify-center">
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
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-flickmart font-medium cursor-pointer text-sm hover:underline"
          >
            Mark all as Read
          </button>
        }
      />
      <div className="relative w-full flex items-center justify-center py-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 font-medium transition">
              {notificationLabels[selectedType]}
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-screen md:w-[500px] xl:w-[500px] p-2 rounded-2xl z-50 bg-white text-gray-500 border">
            <ul className="space-y-1">
              {options.map((type) => (
                <li key={type}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-4 rounded-lg transition",
                      selectedType === type && "bg-flickmart/10 font-semibold text-black"
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
        className={`${isVisible ? "translate-y-0" : "-translate-y-full"} h-[60px] transition-all duration-300 bg-white flex items-center px-[18px] justify-between shadow-lg font-semibold sticky top-[77px] z-30 sm:h-[80px] sm:translate-y-0 sm:top-0`}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={
              activeTab === "all" ? "text-flickmart" : "text-flickmart-gray"
            }
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={
              activeTab === "unread" ? "text-flickmart" : "text-flickmart-gray"
            }
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>
      <div className="w-full mt-10 px-[18px] flex gap-2 justify-between items-center sm:block">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:text-white hover:bg-red-400"
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
                className="bg-red-500 text-white hover:text-white hover:bg-red-400"
                onClick={handleDeleteAll}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          type="button"
          onClick={handleMarkAllAsRead}
          className="ml-2 hidden sm:inline-block bg-flickmart hover:bg-flickmart/80"
        >
          Mark all as Read
        </Button>
      </div>
      {Object.entries(groupedNotifications).map(([day, dayNotifications]) => (
        <Day key={day} notifications={dayNotifications} day={day} />
      ))}
      {Object.keys(groupedNotifications).length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-lg text-gray-500">No notifications to display</p>
        </div>
      )}
    </main>
  );
};
export default Page;
