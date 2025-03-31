import Image from "next/image";
import { EllipsisVertical, Trash, CheckCheck, Eye } from "lucide-react";
import { Notification } from "@/app/notifications/page";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const SingleNotification = ({
  notification: { icon, text, time, id, isRead, link, imageUrl },
}: {
  notification: Notification;
}) => {
  const updateNotification = useMutation(api.notifications.updateNotification);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleMarkAsRead = (e?: React.MouseEvent): void => {
    if (e) {
      e.stopPropagation();
    }
    
    if (id && !isRead) {
      toast.promise(
        updateNotification({
          notificationId: id as Id<"notifications">,
          isRead: true,
        }),
        {
          loading: 'Marking as read...',
          success: 'Notification marked as read',
          error: 'Failed to mark notification as read'
        }
      );
    }
  };

  const handleMarkAsUnread = (e: React.MouseEvent): void => {
    e.stopPropagation();
    
    if (id && isRead) {
      toast.promise(
        updateNotification({
          notificationId: id as Id<"notifications">,
          isRead: false,
        }),
        {
          loading: 'Marking as unread...',
          success: 'Notification marked as unread',
          error: 'Failed to mark notification as unread'
        }
      );
    }
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    
    if (id) {
      toast.promise(
        deleteNotification({
          notificationId: id as Id<"notifications">,
        }),
        {
          loading: 'Deleting notification...',
          success: 'Notification deleted',
          error: 'Failed to delete notification'
        }
      );
    }
  };

  return (
    <li
      className={`flex justify-between border-b items-center py-5 px-4 gap-1 sm:px-12 cursor-pointer ${!isRead ? "bg-blue-50" : ""}`}
      onClick={handleMarkAsRead}
    >
      <div className="flex gap-4 items-center sm:gap-4">
        <div className="relative size-16 sm:size-20">
          <Image alt="notification icon" src={imageUrl || icon} fill />
        </div>
        <div className="w-[74%]">
          <p className="text-sm sm:text-base sm:mb-3">
            {text}
            {link && (
              <Link
                href={link}
                className="text-flickmart ml-1 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead();
                }}
              >
                check now
              </Link>
            )}
          </p>
          <span className="text-xs font-light sm:text-[13px]">{time}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className={`cursor-pointer transition-all duration-300 ${isRead ? "text-gray-300 hover:text-gray-500" : "hover:text-flickmart"}`}
          >
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {isRead ? (
            <DropdownMenuItem 
              onClick={handleMarkAsUnread}
              className="cursor-pointer flex items-center gap-2"
            >
              <Eye size={16} />
              <span>Mark as unread</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={handleMarkAsRead}
              className="cursor-pointer flex items-center gap-2"
            >
              <CheckCheck size={16} />
              <span>Mark as read</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer text-red-500 flex items-center gap-2"
          >
            <Trash size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
export default SingleNotification;
