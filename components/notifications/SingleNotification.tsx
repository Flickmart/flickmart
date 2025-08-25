import { useMutation } from 'convex/react';
import { CheckCheck, EllipsisVertical, Eye, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Notification } from '@/app/(main-pages)/notifications/page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

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
          notificationId: id as Id<'notifications'>,
          isRead: true,
        }),
        {
          loading: 'Marking as read...',
          success: 'Notification marked as read',
          error: 'Failed to mark notification as read',
        }
      );
    }
  };

  const handleMarkAsUnread = (e: React.MouseEvent): void => {
    e.stopPropagation();

    if (id && isRead) {
      toast.promise(
        updateNotification({
          notificationId: id as Id<'notifications'>,
          isRead: false,
        }),
        {
          loading: 'Marking as unread...',
          success: 'Notification marked as unread',
          error: 'Failed to mark notification as unread',
        }
      );
    }
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();

    if (id) {
      toast.promise(
        deleteNotification({
          notificationId: id as Id<'notifications'>,
        }),
        {
          loading: 'Deleting notification...',
          success: 'Notification deleted',
          error: 'Failed to delete notification',
        }
      );
    }
  };

  return (
    <li
      className={`flex cursor-pointer items-center justify-between gap-1 border-b px-4 py-5 sm:px-12 ${isRead ? '' : 'bg-blue-50'}`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-center gap-4 sm:gap-4">
        <div className="relative size-16 sm:size-20">
          <Image alt="notification icon" fill src={imageUrl || icon} />
        </div>
        <div className="w-[74%]">
          <p className="text-sm sm:mb-3 sm:text-base">
            {text}
            {link && (
              <Link
                className="ml-1 text-flickmart hover:underline"
                href={link}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead();
                }}
              >
                check now
              </Link>
            )}
          </p>
          <span className="font-light text-xs sm:text-[13px]">{time}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`cursor-pointer transition-all duration-300 ${isRead ? 'text-gray-300 hover:text-gray-500' : 'hover:text-flickmart'}`}
            onClick={(e) => e.stopPropagation()}
            type="button"
          >
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {isRead ? (
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2"
              onClick={handleMarkAsUnread}
            >
              <Eye size={16} />
              <span>Mark as unread</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2"
              onClick={handleMarkAsRead}
            >
              <CheckCheck size={16} />
              <span>Mark as read</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-red-500"
            onClick={handleDelete}
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
