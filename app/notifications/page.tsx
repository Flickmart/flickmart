"use client";

import MobileHeader from "@/components/MobileHeader";
import Day from "@/components/notifications/Day";
import { useState, useEffect } from "react";

export interface Notification {
  icon: string;
  text: string;
  time: string;
}
const fakeNotifications: Notification[] = [
  {
    icon: "/checkmark.png",
    text: "Congrats Mbah, your account has been created successfully",
    time: "10 minutes ago",
  },
  {
    icon: "/checkmark.png",
    text: "Congrats Mbah, your account has been created successfully",
    time: "10 minutes ago",
  },
  {
    icon: "/image-group.png",
    text: "Congrats Mbah, your account has been created successfully",
    time: "10 minutes ago",
  },
  {
    icon: "/image-group.png",
    text: "Congratulations you've recieved #1000 for posting of ads. ",
    time: "10 minutes ago",
  },
  {
    icon: "/image-group.png",
    text: "These ads might be interesting for you! check now",
    time: "10 minutes ago",
  },
];

const page = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <main>
      <MobileHeader title="Notifications">
        <button
          type="button"
          className="text-flickmart font-medium cursor-pointer text-sm hover:underline"
        >
          Mark all as Read
        </button>
      </MobileHeader>
      <div
        className={`${isVisible ? "translate-y-0" : "-translate-y-full"} h-[60px] transition-all duration-300 bg-white flex items-center px-[18px] justify-between shadow-lg font-semibold sticky top-[77px] z-30 sm:h-[80px] sm:translate-y-0 sm:top-0`}
      >
        <button type="button" className="text-flickmart-gray">
          Read
        </button>
        <button type="button" className="text-flickmart">
          Unread (5)
        </button>
      </div>
      <div className="text-right mt-10 px-[18px] hidden sm:block">
        <button
          type="button"
          className="cursor-pointer text-sm inline-block py-2 bg-flickmart text-white font-semibold px-2 rounded-sm border-flickmart transition-all duration-300 border-2 hover:bg-white hover:text-flickmart "
        >
          Mark all as Read
        </button>
      </div>
      <Day notifications={fakeNotifications} day="Today" />
      <Day notifications={fakeNotifications} day="Yesterday" />
    </main>
  );
};
export default page;
