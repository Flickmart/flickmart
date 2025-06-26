import { Copy, MapPin, MessageCircle, Check, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { initialChat, shareProduct } from "@/utils/helpers";

export default function ProductHeader({
  location,
  title,
  price,
  timestamp,
  userId,
  productId,
  description,
}: {
  location: string;
  title: string;
  price: number;
  timestamp: string;
  userId: Id<"users">;
  productId: Id<"product">;
  description: string;
}) {
  const date = new Date(timestamp);
  const dateNow = new Date();
  const dateDiff = dateNow.getTime() - date.getTime();
  const router = useRouter();
  const user = useQuery(api.users.current);
  // Convert milliseconds to hours by dividing by number of milliseconds in an hour
  const hoursAgo = Math.floor(dateDiff / (1000 * 60 * 60));
  const minsAgo = Math.floor(dateDiff / (1000 * 60));
  const daysAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  const weeksAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7));
  const monthsAgo = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7 * 4));

  const timeSince = () => {
    let value = 0;
    let timeSpan = "";
    if (monthsAgo) {
      value = monthsAgo;
      timeSpan = "month";
    } else if (weeksAgo) {
      value = weeksAgo;
      timeSpan = "week";
    } else if (daysAgo) {
      value = daysAgo;
      timeSpan = "day";
    } else if (hoursAgo) {
      value = hoursAgo;
      timeSpan = "hour";
    } else if (minsAgo) {
      value = minsAgo;
      timeSpan = "min";
    }
    if (value > 1) {
      timeSpan += "s";
    }
    return value && timeSpan
      ? `${value} ${timeSpan} ago`
      : "less than a minute ago";
  };

  const handleChat = () => {
    initialChat({
      user: user ?? null,
      userId,
      onNavigate: router.push,
      productId,
    });
  };

  // State to track if copy was successful
  // const [copied, setCopied] = useState(false);

  // Function to handle copying to clipboard
  // const handleCopy = () => {
  //   const url = `https://flickmart-demo.vercel.app/product/${productId}`;
  //   navigator.clipboard
  //     .writeText(url)
  //     .then(() => {
  //       setCopied(true);
  //       // Reset copied state after 2 seconds
  //       setTimeout(() => setCopied(false), 2000);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy: ", err);
  //     });
  // };

  async function handleShare() {
    shareProduct({ title, description, productId });
  }

  return (
    <div className="lg:space-y-3 w-full space-y-4 bg-white rounded-md p-5">
      <div className="flex text-xs font-light items-center gap-2 text-gray-500">
        <MapPin size={17} />
        <span className="capitalize">
          {location}, <span className="normal-case">{timeSince()}</span>
        </span>
      </div>
      <h2 className="text-xl font-bold capitalize text-gray-800">{title}</h2>
      <div className="space-x-3 flex items-center">
        <span className="inline-block text-flickmart-chat-orange text-lg font-extrabold  tracking-wider">
          &#8358;{price.toLocaleString()}
        </span>
        {/* <span className="bg-green-500/80 tracking-widest p-1 rounded-md text-white font-semibold text-xs">Negotiable</span> */}
      </div>
      <div className=" flex  gap-3 text-white">
        <button
          className="p-2 px-3 w-2/4 lg:w-1/4 font-medium bg-flickmart-chat-orange rounded-md flex items-center justify-center gap-2"
          onClick={handleChat}
        >
          {" "}
          <MessageCircle /> Chat vendor
        </button>
        {/* <Dialog> */}
        {/* <DialogTrigger asChild> */}
        <button
          onClick={handleShare}
          className="p-2 px-3 w-2/4 lg:w-1/4 font-medium border border-flickmart-chat-orange text-flickmart-chat-orange rounded-md flex items-center justify-center gap-2"
        >
          {" "}
          <ExternalLink /> Share
        </button>
      </div>
    </div>
  );
}
