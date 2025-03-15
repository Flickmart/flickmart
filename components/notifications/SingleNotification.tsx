import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { Notification } from "@/app/notifications/page";
import Link from "next/link";

const SingleNotification = ({
  notification: { icon, text, time },
}: {
  notification: Notification;
}) => {
  return (
    <li className="flex justify-between border-b items-center py-5 px-4 gap-1 sm:px-12">
      <div className="flex gap-4 items-center sm:gap-4">
        <div className="relative size-16 sm:size-20">
          <Image alt="notification icon" src={icon} fill />
        </div>
        <div className="w-[74%]">
          <p className="text-sm sm:text-base sm:mb-3">
            {text}
            <Link href={"#"} className="text-gray-400">
              {" "}
              check now
            </Link>
          </p>
          <span className="text-xs font-light sm:text-[13px]">{time}</span>
        </div>
      </div>
      <button
        type="button"
        className="cursor-pointer hover:text-flickmart transition-all duration-300"
      >
        <EllipsisVertical />
      </button>
    </li>
  );
};
export default SingleNotification;
