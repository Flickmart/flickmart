import { Bookmark, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductCard({
  image,
  title,
  price,
  location,
  likes,
  productId,
  views,
}: {
  image?: string;
  title?: string;
  price?: number;
  location?: string;
  likes?: number;
  productId: Id<"product">;
  views?: number;
}) {
  if (title?.length && title?.length > 20) {
    title = title?.substring(0, 20)?.trim() + "...";
  }
  const comments = useQuery(api.comments.getCommentsByProductId, {
    productId,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const userEngagements = [
    {
      engagementName: "Like",
      engagement: likes || 0,
    },
    {
      engagementName: "Comment",
      engagement: comments?.length || 0,
    },
    {
      engagementName: "View",
      engagement: views || 0,
    },
  ];
  useEffect(() => {
    const id = setTimeout(() => {
      if (currentIndex < userEngagements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 2000);
    () => {
      clearTimeout(id);
    };
  });

  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: "saved",
  });
  const bookmarkProduct = useMutation(api.product.addBookmark);

  const { isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  const router = useRouter();
  const handleBookmark = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please sign in to perform this action");
        router.push("/sign-in?callback=/product/" + productId);
        return;
      }
      const bookmarked = await bookmarkProduct({ productId, type: "saved" });
      // bookmarked?.added
      typeof bookmarked === "object" && bookmarked?.added
        ? toast.success(`Item added to saved`)
        : toast.success(`Item removed from saved`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="relative h-[300px] justify-between rounded-md border border-[#BDBDBD] p-[6px] overflow-hidden bg-white">
      <div className="w-32 absolute bg-[#FF5031] py-1 font-bold text-white text-sm uppercase -rotate-45 top-3 -left-10 flex items-center justify-center gap-1 z-10">
        <Image alt="fire" height={20} src="/icons/fire-icon.png" width={20} />
        hot
      </div>
      {/* Implement bookmark feature */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleBookmark();
        }}
        type="button"
        className={
          "absolute z-10 top-2 shadow-lg right-2 rounded-full bg-white p-2"
        }
      >
        <Bookmark
          className={` ${saved?.data?.added ? "fill-flickmart stroke-[#F68B1E]" : "stroke-[#6C7275] fill-[#6C7275]"}`}
        />
      </button>
      {image ? (
        <Link
          href={`/products/${productId}`}
          className="block h-[74%] overflow-hidden rounded-sm"
        >
          <Image
            alt={title || ""}
            className="border size-full object-cover object-top sm:hover:scale-125 transition-transform duration-300"
            height={500}
            src={image || ""}
            width={500}
          />
        </Link>
      ) : (
        <Link
          href={`/products/${productId}`}
          className="h-[74%] block relative"
        >
          <Image
            alt={title || ""}
            className="absolute rounded-sm w-1/2 abs-center-x abs-center-y  object-top"
            height={500}
            src="/no-image.png"
            width={500}
          />
        </Link>
      )}
      <div className="flex flex-col text-left pt-1 space-y-[3px]">
        <div className="flex capitalize gap-1 items-center text-sm font-medium text-gray-700">
          <MapPin className="size-4 text-red-500" />
          {location}
        </div>
        <span className="font-semibold">{title}</span>
        <div className="flex justify-between items-start text-sm">
          <span className="text-flickmart font-semibold">
            &#8358;{price?.toLocaleString()}
          </span>
          <div className="flex flex-col items-end gap-1">
            {userEngagements.map(({ engagementName, engagement }, index) => {
              if (engagement !== 1) {
                engagementName += "s";
              }
              let position = "";
              if (currentIndex > index) {
                position = "-translate-y-full opacity-0";
              } else if (currentIndex < index) {
                position = "translate-y-full opacity-0";
              } else {
                position = "translate-y-0";
              }
              return (
                <span
                  key={engagementName}
                  className={`text-[#A8A8A8] font-semibold absolute custom-transition  ${position}`}
                >
                  {engagement} {engagementName}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
