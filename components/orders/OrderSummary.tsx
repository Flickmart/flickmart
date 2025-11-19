'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Id } from '@/convex/_generated/dataModel';

// TypeScript interfaces
type Product = {
  _id: Id<'product'>;
  name: string;
  price: number;
  images?: string[];
  description?: string;
};

type OrderWithDetails = {
  _id: Id<'orders'>;
  productIds: Id<'product'>[];
  buyerId: Id<'users'>;
  sellerId: Id<'users'>;
  amount: number;
  status: 'in_escrow' | 'completed' | 'cancelled' | 'disputed';
  buyerConfirmedCompletion: boolean;
  sellerConfirmedCompletion: boolean;
  createdAt: number;
  completedAt?: number;
  // Enriched data
  buyerName?: string;
  sellerName?: string;
  buyerImageUrl?: string;
  sellerImageUrl?: string;
  userRole: 'buyer' | 'seller';
};

type OrderSummaryProps = {
  order: OrderWithDetails;
  products: Product[];
};

// Helper functions
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number): string => {
  const value = amount / 100;
  return `₦${value.toLocaleString()}`;
};

const getStatusBadgeProps = (status: OrderWithDetails['status']) => {
  switch (status) {
    case 'in_escrow':
      return {
        className: 'bg-flickmart text-white hover:bg-flickmart/90',
        text: 'In Escrow',
      };
    case 'completed':
      return {
        className: 'bg-green-500 text-white hover:bg-green-600',
        text: 'Completed',
      };
    case 'cancelled':
      return {
        className: 'bg-red-500 text-white hover:bg-red-600',
        text: 'Cancelled',
      };
    case 'disputed':
      return {
        className: 'bg-yellow-500 text-black hover:bg-yellow-600',
        text: 'Disputed',
      };
    default:
      return {
        className: 'bg-gray-500 text-white',
        text: status,
      };
  }
};

const getInitials = (name?: string): string => {
  if (!name) {
    return 'U';
  }
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// OrderSummary component
export const OrderSummary = ({ order, products }: OrderSummaryProps) => {
  const statusProps = getStatusBadgeProps(order.status);
  const otherPartyName =
    order.userRole === 'buyer' ? order.sellerName : order.buyerName;
  const otherPartyImageUrl =
    order.userRole === 'buyer' ? order.sellerImageUrl : order.buyerImageUrl;
  const otherPartyRole = order.userRole === 'buyer' ? 'Seller' : 'Buyer';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg sm:text-xl">
                Order #{order._id.slice(-8)}
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Placed on {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            <Badge
              className={`${statusProps.className} flex-shrink-0 px-2 py-1 text-xs sm:text-sm`}
            >
              {statusProps.text}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Transaction Details */}
        <Card>
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-lg">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-6 sm:pb-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Total Amount
              </span>
              <span className="font-semibold text-base text-flickmart sm:text-lg">
                {formatCurrency(order.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge className={`${statusProps.className} px-2 py-1 text-xs`}>
                {statusProps.text}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Your Role</span>
              <span className="font-medium text-sm capitalize">
                {order.userRole}
              </span>
            </div>
            {order.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Completed</span>
                <span className="text-sm">{formatDate(order.completedAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other Party Details */}
        <Card>
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-lg">
              {otherPartyRole} Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
                <AvatarImage alt={otherPartyName} src={otherPartyImageUrl} />
                <AvatarFallback>{getInitials(otherPartyName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm sm:text-base">
                  {otherPartyName || 'Unknown User'}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {otherPartyRole}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <CardTitle className="text-base sm:text-lg">
            Products ({products.length} item{products.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {products.map((product, index) => (
              <div key={product._id}>
                <div className="flex space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-16">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          alt={product.name}
                          className="h-full w-full object-cover"
                          height={64}
                          src={product.images[0]}
                          width={64}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-6 sm:w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium text-gray-900 text-sm sm:text-base">
                      {product.name}
                    </h4>
                    <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
                      {formatCurrency(product.price)}
                    </p>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-muted-foreground text-xs sm:text-sm">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < products.length - 1 && (
                  <Separator className="mt-3 sm:mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Status (for in_escrow orders) */}
      {order.status === 'in_escrow' && (
        <Card>
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-lg">
              Completion Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Buyer Confirmation
                </span>
                <div className="flex items-center space-x-2">
                  {order.buyerConfirmedCompletion ? (
                    <>
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                      <span className="font-medium text-green-600 text-xs sm:text-sm">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gray-300" />
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Seller Confirmation
                </span>
                <div className="flex items-center space-x-2">
                  {order.sellerConfirmedCompletion ? (
                    <>
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                      <span className="font-medium text-green-600 text-xs sm:text-sm">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gray-300" />
                      <span className="text-gray-500 text-xs sm:text-sm">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
