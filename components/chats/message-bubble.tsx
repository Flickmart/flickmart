import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PhotoView } from "react-photo-view";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { LinkIcon } from "lucide-react";

interface MessageBubbleProps {
  id: string;
  message: string;
  images?: string[];
  isUser: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  selectionMode: boolean;
  selectedMessages: string[];
  handleLongPress: (messageId: string) => void;
  toggleMessageSelection: (messageId: string) => void;
  toggleSelectionMode: () => void;
  type?: "text" | "product" | "image" | "escrow";
  title?: string;
  price?: number;
  image?: string;
}

export default function MessageBubble({
  message,
  images = [],
  isUser,
  timestamp,
  status = "read",
  id,
  selectionMode,
  selectedMessages,
  toggleMessageSelection,
  toggleSelectionMode,
  handleLongPress,
  type = "text", // Default to 'text'
  title = "",
  price = 0,
  image = "", // Default to empty string
}: MessageBubbleProps) {
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
    const timer = setTimeout(() => {
      handleLongPress(id);
    }, 1500);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    setTouchStartTime(0);
  };

  useEffect(() => {
    return () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
    };
  }, [touchTimer]);

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        selectionMode && "cursor-pointer"
      )}
      onClick={() => selectionMode && toggleMessageSelection(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress(id);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className={cn(
          "max-w-[85%] xs:max-w-[80%] sm:max-w-[75%] md:max-w-[65%] rounded-lg py-1 px-2 sm:py-2 sm:px-3 md:p-3 shadow-sm",
          isUser
            ? "bg-flickmart text-white rounded-br-none"
            : "bg-background text-foreground rounded-bl-none",
          selectedMessages.includes(id) &&
            "bg-orange-200 border-2 border-orange-400",
          images.length > 0 && "rounded-br-lg rounded-bl-lg py-0"
        )}
      >
        {images && images.length > 0 && (
          <div
            className={`grid gap-1 mt-1 sm:mt-2 ${
              images.length === 1
                ? "grid-cols-1"
                : images.length >= 2
                  ? "grid-cols-2"
                  : ""
            }`}
          >
            {/* First image (always shown) */}
            {images.length >= 1 && (
              <div className={`${images.length > 1 ? "row-span-2" : ""}`}>
                <PhotoView src={images[0]}>
                  <img
                    src={images[0] || "/placeholder.svg"}
                    alt="Shared image 1"
                    className="cursor-pointer rounded-md object-cover h-full w-full"
                  />
                </PhotoView>
              </div>
            )}

            {/* Second image */}
            {images.length >= 2 && (
              <PhotoView src={images[1]}>
                <img
                  src={images[1] || "/placeholder.svg"}
                  alt="Shared image 2"
                  className="cursor-pointer rounded-md object-cover h-full w-full"
                />
              </PhotoView>
            )}

            {/* Third image or overlay for more images */}
            {images.length >= 3 && (
              <div className="relative">
                <PhotoView src={images[2]}>
                  <img
                    src={images[2] || "/placeholder.svg"}
                    alt="Shared image 3"
                    className="cursor-pointer rounded-md object-cover h-full w-full"
                  />
                </PhotoView>

                {/* Overlay with count if more than 3 images */}
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <span className="text-white font-bold text-xl">
                      +{images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Hidden images (for PhotoView gallery) */}
            <div className="hidden">
              {images.slice(3).map((img, index) => (
                <PhotoView key={`hidden-${index}`} src={img}>
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Hidden image ${index + 4}`}
                  />
                </PhotoView>
              ))}
            </div>
          </div>
        )}
        <p
          className={cn(
            "break-words text-xs sm:text-sm md:text-base leading-relaxed",
            selectedMessages.includes(id) && " text-right "
          )}
        >
          {type !== "product" && message}
        </p>

        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-[10px] md:text-[10px] opacity-70">
            {timestamp}
          </span>
          {/* {isUser && (
            <span className="text-[10px] md:text-xs">
              {status === "sent" && <Check className="h-4 w-4 inline" />}
              {status === "delivered" && (
                <CheckCheck className="h-4 w-4 inline" />
              )}
              {status === "read" && (
                <CheckCheck className="h-4 w-4 inline text-blue-500" />
              )}
            </span>
          )} */}
        </div>
        {type === "product" && (
          <ProductChatMessage
            productImage={image}
            productTitle={title}
            productPrice={price}
            message={message}
          />
        )}
      </div>
    </div>
  );
}

interface ProductChatMessageProps {
  productImage: string;
  productTitle: string;
  message: string;
  productPrice: number;
}

export function ProductChatMessage({
  productImage,
  productTitle,
  productPrice,
  message,
}: ProductChatMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[280px] sm:max-w-xs bg-flickmart text-white">
        {/* Product Details Section - Highlighted */}
        <div className="bg-orange-600 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border border-orange-400 flex items-center gap-2 sm:gap-3">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={productTitle}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold line-clamp-2 leading-tight flex items-center gap-1">
              <span className="truncate">{productTitle}</span>
              <LinkIcon className="w-3 h-3 text-orange-200 flex-shrink-0" />
            </p>
            <p className="text-xs font-medium text-orange-100 mt-1">${productPrice.toFixed(2)}</p>
          </div>
        </div>
        {/* Message Text */}
        <p className="text-xs sm:text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
