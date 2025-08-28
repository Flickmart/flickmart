import { useQuery } from 'convex/react';
import { ArrowRight, Banknote, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PhotoView } from 'react-photo-view';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  id: string;
  message: string;
  images?: string[];
  isUser: boolean;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  selectionMode: boolean;
  selectedMessages: string[];
  handleLongPress: (messageId: string) => void;
  toggleMessageSelection: (messageId: string) => void;
  toggleSelectionMode: () => void;
  type?: 'text' | 'product' | 'image' | 'escrow' | 'transfer';
  title?: string;
  price?: number;
  image?: string;
  productId?: string;
  // Transfer-specific props
  orderId?: string;
  transferAmount?: number;
  currency?: string;
}

export default function MessageBubble({
  message,
  images = [],
  isUser,
  timestamp,
  status = 'read',
  id,
  selectionMode,
  selectedMessages,
  toggleMessageSelection,
  toggleSelectionMode,
  handleLongPress,
  type = 'text', // Default to 'text'
  title = '',
  price = 0,
  image = '', // Default to empty string
  productId = '',
  // Transfer-specific props
  orderId = '',
  transferAmount = 0,
  currency = '',
}: MessageBubbleProps) {
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  const order = useQuery(
    api.orders.getOrderById,
    orderId
      ? {
          orderId: orderId as Id<'orders'>,
        }
      : 'skip'
  );

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
        'flex',
        isUser ? 'justify-end' : 'justify-start',
        selectionMode && 'cursor-pointer'
      )}
      //DISABLED DELETE FEATURE
      // onClick={() => selectionMode && toggleMessageSelection(id)}
      // onContextMenu={(e) => {
      //   e.preventDefault();
      //   handleLongPress(id);
      // }}
      // onTouchStart={handleTouchStart}
      // onTouchEnd={handleTouchEnd}
      // onTouchCancel={handleTouchEnd}
    >
      <div
        className={cn(
          "max-w-[85%] xs:max-w-[80%] sm:max-w-[75%] lg:max-w-[65%] rounded-xl p-2 sm:px-3",
          isUser
            ? "bg-light-orange rounded-br-none text-black/80"
            : "bg-gray-300/80 text-foreground rounded-bl-none text-black",
          selectedMessages.includes(id) &&
            'border-2 border-orange-400 bg-orange-200',
          images.length > 0 && 'rounded-br-lg rounded-bl-lg py-0',
          type === 'transfer' && 'bg-transparent p-0 shadow-none'
        )}
      >
        {images && images.length > 0 && (
          <div
            className={`mt-1 grid gap-1 sm:mt-2 ${
              images.length === 1
                ? 'grid-cols-1'
                : images.length >= 2
                  ? 'grid-cols-2'
                  : ''
            }`}
          >
            {/* First image (always shown) */}
            {images.length >= 1 && (
              <div className={`${images.length > 1 ? 'row-span-2' : ''}`}>
                <PhotoView src={images[0]}>
                  <img
                    alt="Shared image 1"
                    className="h-full w-full cursor-pointer rounded-md object-cover"
                    src={images[0] || '/placeholder.svg'}
                  />
                </PhotoView>
              </div>
            )}

            {/* Second image */}
            {images.length >= 2 && (
              <PhotoView src={images[1]}>
                <img
                  alt="Shared image 2"
                  className="h-full w-full cursor-pointer rounded-md object-cover"
                  src={images[1] || '/placeholder.svg'}
                />
              </PhotoView>
            )}

            {/* Third image or overlay for more images */}
            {images.length >= 3 && (
              <div className="relative">
                <PhotoView src={images[2]}>
                  <img
                    alt="Shared image 3"
                    className="h-full w-full cursor-pointer rounded-md object-cover"
                    src={images[2] || '/placeholder.svg'}
                  />
                </PhotoView>

                {/* Overlay with count if more than 3 images */}
                {images.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50">
                    <span className="font-bold text-white text-xl">
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
                    alt={`Hidden image ${index + 4}`}
                    src={img || '/placeholder.svg'}
                  />
                </PhotoView>
              ))}
            </div>
          </div>
        )}
        <p
          className={cn(
            'break-words text-xs leading-relaxed sm:text-sm md:text-base',
            selectedMessages.includes(id) && 'text-right'
          )}
        >
          {type !== 'product' && type !== 'transfer' && message}
        </p>

        {type !== 'transfer' && (
          <div className="mt-1 flex items-center justify-end space-x-1">
            <span className="text-[10px] opacity-70 md:text-[10px]">
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
        )}
        {type === 'product' && (
          <ProductChatMessage
            isUser={isUser}
            message={message}
            productId={productId}
            productImage={image}
            productPrice={price}
            productTitle={title}
          />
        )}
        {type === 'transfer' && (
          <TransferChatMessage
            currency={currency}
            isUser={isUser}
            order={order}
            orderId={orderId}
            timestamp={timestamp}
            transferAmount={transferAmount}
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
  productId: string;
  isUser: boolean;
}

export function ProductChatMessage({
  productImage,
  productTitle,
  productPrice,
  message,
  productId,
  isUser,
}: ProductChatMessageProps) {
  return (
    <Link href={`/product/${productId}`}>
      <div className="flex justify-end">
        <div
          className={`max-w-[280px] sm:max-w-xs ${isUser ? "bg-light-orange" : "bg-gray-300/80"}`}
        >
          {/* Product Details Section - Highlighted */}
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#f58225] p-2 text-white sm:mb-3 sm:gap-3 sm:p-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16">
              <Image
                alt={productTitle}
                className="rounded-md"
                layout="fill"
                objectFit="cover"
                src={productImage || '/placeholder.svg'}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 flex items-center gap-1 font-semibold text-xs leading-tight sm:text-sm">
                <span className="truncate">{productTitle}</span>
                <LinkIcon className="h-3 w-3 flex-shrink-0 text-orange-200" />
              </p>
              <p className="mt-1 font-medium text-orange-100 text-xs">
                ₦{productPrice.toFixed(2)}
              </p>
            </div>
          </div>
          {/* Message Text */}
          <p className="text-xs leading-relaxed sm:text-sm">{message}</p>
        </div>
      </div>
    </Link>
  );
}

interface TransferChatMessageProps {
  transferAmount: number;
  currency: string;
  orderId: string;
  order?: any;
  timestamp?: string;
  isUser: boolean; // true if current user is the sender
}

export function TransferChatMessage({
  transferAmount,
  currency,
  orderId,
  order,
  timestamp,
  isUser,
}: TransferChatMessageProps) {
  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  // Get order status with fallback
  const orderStatus = order?.status || 'in_escrow';

  // Determine if user is sender or receiver
  const actionText = isUser ? 'Money Sent' : 'Money Received';

  // Define status configurations
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          bgGradient: 'from-green-50 to-emerald-50',
          hoverGradient: 'hover:from-green-100 hover:to-emerald-100',
          borderColor: 'border-green-200',
          iconGradient: 'from-green-500 to-emerald-600',
          textColor: 'text-green-700',
          amountColor: 'text-green-900',
          arrowColor: 'text-green-500',
          statusColor: 'text-green-600',
          timestampColor: 'text-green-500',
          description: 'Transaction completed',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgGradient: 'from-red-50 to-rose-50',
          hoverGradient: 'hover:from-red-100 hover:to-rose-100',
          borderColor: 'border-red-200',
          iconGradient: 'from-red-500 to-rose-600',
          textColor: 'text-red-700',
          amountColor: 'text-red-900',
          arrowColor: 'text-red-500',
          statusColor: 'text-red-600',
          timestampColor: 'text-red-500',
          description: 'Transaction cancelled',
        };
      case 'disputed':
        return {
          label: 'Disputed',
          bgGradient: 'from-orange-50 to-amber-50',
          hoverGradient: 'hover:from-orange-100 hover:to-amber-100',
          borderColor: 'border-orange-200',
          iconGradient: 'from-orange-500 to-amber-600',
          textColor: 'text-orange-700',
          amountColor: 'text-orange-900',
          arrowColor: 'text-orange-500',
          statusColor: 'text-orange-600',
          timestampColor: 'text-orange-500',
          description: 'Transaction disputed',
        };
      case 'in_escrow':
      default:
        return {
          label: 'In Escrow',
          bgGradient: 'from-blue-50 to-indigo-50',
          hoverGradient: 'hover:from-blue-100 hover:to-indigo-100',
          borderColor: 'border-blue-200',
          iconGradient: 'from-blue-500 to-indigo-600',
          textColor: 'text-blue-700',
          amountColor: 'text-blue-900',
          arrowColor: 'text-blue-500',
          statusColor: 'text-blue-600',
          timestampColor: 'text-blue-500',
          description: 'Payment on Hold',
        };
    }
  };

  const statusConfig = getStatusConfig(orderStatus);

  return (
    <Link href={`/orders/${orderId}`}>
      <div className="w-full">
        <div
          className={`bg-gradient-to-r ${statusConfig.bgGradient} border ${statusConfig.borderColor} cursor-pointer rounded-xl p-2.5 ${statusConfig.hoverGradient} shadow-sm transition-all duration-200`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`h-8 w-8 bg-gradient-to-br ${statusConfig.iconGradient} flex items-center justify-center rounded-lg shadow-sm`}
            >
              <Banknote className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between space-x-1">
                <div>
                  <p
                    className={`font-medium text-xs ${statusConfig.textColor} mb-0.5`}
                  >
                    {actionText}
                  </p>
                  <p
                    className={`font-bold text-base ${statusConfig.amountColor} leading-none`}
                  >
                    {currency === 'NGN' ? '₦' : currency}
                    {formatAmount(transferAmount)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-sm bg-white/50 px-2 py-0.5 font-semibold text-[10px] ${statusConfig.statusColor}`}
                  >
                    {statusConfig.label}
                  </span>
                  <ArrowRight
                    className={`h-4 w-4 ${statusConfig.arrowColor} flex-shrink-0`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p
              className={`text-[10px] ${statusConfig.statusColor} font-medium`}
            >
              {statusConfig.description}
            </p>
            {timestamp && (
              <span
                className={`text-[9px] ${statusConfig.timestampColor} opacity-70`}
              >
                {timestamp}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
