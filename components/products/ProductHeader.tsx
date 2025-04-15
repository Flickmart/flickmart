import { Copy, MapPin, MessageCircle, Check, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export default function ProductHeader({
  location,
  title,
  price,
  timestamp,
  userId,
  productId,
  description
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

  const handleChat = async () => {
    if (!user) {
      toast.error("Please login to chat with vendor");
      return;
    }
    console.log("chat vendor clicked")

    // Navigate to chat page with vendor ID as query parameter
    router.push(`/chats?vendorId=${userId}`);
    toast.success("Starting chat with vendor");
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

  async function handleShare(){
    const shareData = {
      title: title || 'Check out this product',
      text: description?.substring(0, 100) + '...' || 'Check out this product on Flickmart',
      url: `https://flickmart-demo.vercel.app/product/${productId}`,
    };
    try{
      if(navigator.share){
        await navigator.share(shareData)
      }else{
        navigator.clipboard
      .writeText(shareData.url)
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="lg:space-y-3 w-full space-y-4 bg-white rounded-md p-5">
      <div className="flex text-xs font-light items-center gap-2 text-gray-500">
        <MapPin size={17} />
        <span className="capitalize">
          {location},{" "}
          <span className="normal-case">
            {weeksAgo !== 0 && `${weeksAgo} weeks`}
            {daysAgo !== 0 && !weeksAgo && `${daysAgo} days`}
            {hoursAgo !== 0 && !daysAgo && `${hoursAgo} hours`}
            {minsAgo !== 0 && !hoursAgo && `${minsAgo} minutes`}
            {" "}ago
          </span>
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
        <button onClick={handleShare} className="p-2 px-3 w-2/4 lg:w-1/4 font-medium border border-flickmart-chat-orange text-flickmart-chat-orange rounded-md flex items-center justify-center gap-2">
          {" "}
          <ExternalLink /> Share
        </button>
          {/* </DialogTrigger> */}
          {/* <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={`https://flickmart-demo.vercel.app/product/${productId}`}
                  readOnly
                />
              </div>
              <Button
                onClick={handleCopy}
                type="button"
                size="sm"
                className="px-3 transition-all duration-200"
              >
                <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
}
