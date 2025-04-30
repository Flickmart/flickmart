import { Check, CheckCheck, ZoomOut, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

interface MessageBubbleProps {
  message: string;
  images?: string[];
  isUser: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  id: string;
  selectionMode: boolean;
  selectedMessages: string[];
  toggleMessageSelection: (messageId: string) => void;
  toggleSelectionMode: () => void;
  handleLongPress: (messageId: string) => void;
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
        "group flex items-start gap-2 px-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          "relative max-w-[80%] space-y-2 rounded-lg p-3",
          isUser ? "bg-orange-500 text-white" : "bg-gray-200 text-black",
          selectionMode && selectedMessages.includes(id) && "bg-opacity-50"
        )}
        onClick={() => selectionMode && toggleMessageSelection(id)}
      >
        {/* Image Messages */}
        <PhotoProvider
          toolbarRender={({ onScale, scale, rotate, onRotate }) => {
            return (
              <>
                <ZoomIn
                  className="PhotoView-Slider__toolbarIcon"
                  onClick={() => onScale(scale - 1)}
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "",
                  }}
                />
                <ZoomOut
                  className="PhotoView-Slider__toolbarIcon"
                  onClick={() => onScale(scale + 1)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="PhotoView-Slider__toolbarIcon lucide lucide-rotate-cw-icon lucide-rotate-cw"
                  onClick={() => onRotate(rotate + 90)}
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <svg
                  className="PhotoView-Slider__toolbarIcon"
                  onClick={() => onRotate(rotate + 90)}
                />
              </>
            );
          }}
        >
          <div className="foo">
            {images.map((item, index) => (
              <PhotoView key={index} src={item}>
                <img src={item} alt="" className="rounded-lg" />
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
        {/* Text Message */}
        {message && <p className="break-words">{message}</p>}

        {/* Timestamp and Status */}
        <div
          className={cn(
            "flex items-center gap-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-[10px] md:text-xs opacity-70">{timestamp}</span>
          {isUser && (
            <div className="flex">
              {status === "sent" && <Check className="h-4 w-4 inline" />}
              {status === "delivered" && (
                <CheckCheck className="h-4 w-4 inline" />
              )}
              {status === "read" && (
                <CheckCheck className="h-4 w-4 inline text-blue-500" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
