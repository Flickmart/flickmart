"use client";

import MobileHeader from "@/components/MobileHeader";
import Day from "@/components/notifications/Day";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Trash } from "lucide-react";
import { redirect } from "next/navigation";
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
  | "reminder";

const Page = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedType, setSelectedType] = useState<NotificationType>("all");

  const user = useQuery(api.users.current);
  const allNotifications = useQuery(api.notifications.getNotifications) || [];
  const unreadNotifications =
    useQuery(api.notifications.getUnreadNotifications) || [];
  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );
  const deleteAllNotifications = useMutation(
    api.notifications.deleteAllNotifications
  );

  const filteredNotifications = (
    activeTab === "all" ? allNotifications : unreadNotifications
  ).filter(
    (notification) =>
      selectedType === "all" || notification.type === selectedType
  );

  const unreadCount = unreadNotifications.length;

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

  useEffect(() => {
    if (!user) {
      redirect("/sign-in");
    }
  }, [user]);

  useEffect(() => {
    addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  if (!filteredNotifications) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main>
      <MobileHeader title="Notifications">
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="text-flickmart font-medium cursor-pointer text-sm hover:underline"
        >
          Mark all as Read
        </button>
      </MobileHeader>
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

        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as NotificationType)}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="new_message">Messages</SelectItem>
            <SelectItem value="new_like">Likes</SelectItem>
            <SelectItem value="new_comment">Comments</SelectItem>
            <SelectItem value="new_sale">Sales</SelectItem>
            <SelectItem value="advertisement">Ads</SelectItem>
            <SelectItem value="reminder">Reminders</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-10 px-[18px] flex justify-between items-center sm:block">
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
          className="hidden sm:inline-block bg-flickmart hover:bg-flickmart/80"
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
