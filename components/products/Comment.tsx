import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import CommentContent from "./CommentContent";
import { useQuery } from "convex/react";

export default function Comment({ productId }: { productId: Id<"product"> }) {
  const comments = useQuery(api.comments.getCommentsByProductId, { productId });

  return (
    <Drawer>
      <div>
        <DrawerTrigger className="bg-white flex items-center w-full lg:pr-10  justify-between py-7 px-3 gap-3  lg:p-7  rounded-md">
          <div className="flex items-start gap-3">
            <div className="pt-2">
              <Avatar>
                <AvatarImage
                  src={comments?.[0]?.user?.imageUrl}
                  alt={comments?.[0]?.user?.name || ""}
                />
                <AvatarFallback>EN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col space-y-2 text-left">
              <h3 className="lg:text-lg font-semibold">
                {comments?.[0]?.user?.name}
              </h3>
              <p className="text-xs">{comments?.[0]?.content}</p>
            </div>
          </div>
        </DrawerTrigger>
        <CommentContent productId={productId} />
      </div>
    </Drawer>
  );
}
