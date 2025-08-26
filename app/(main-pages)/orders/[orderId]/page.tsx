'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Package,
  ShieldCheck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ProductsList } from '@/components/orders';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

// Error component for invalid order IDs
const OrderNotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <h1 className="mb-2 font-semibold text-2xl text-gray-900">
        Order Not Found
      </h1>
      <p className="mb-6 text-gray-500">
        The order you're looking for doesn't exist or you don't have permission
        to view it.
      </p>
      <Link href="/orders">
        <Button className="bg-flickmart hover:bg-flickmart/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </Link>
    </div>
  </div>
);

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as Id<'orders'>;

  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();
  const { getToken } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time order data from Convex
  const order = useQuery(api.orders.getOrderById, { orderId });

  const products = useQuery(
    api.orders.getProductsByIds,
    order ? { productIds: order.productIds } : 'skip'
  );
  if (order === undefined) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 sm:h-8 sm:w-64" />
          <Skeleton className="h-3 w-64 sm:h-4 sm:w-96" />
        </div>
        <Card>
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
            <Skeleton className="h-3 w-36 sm:h-4 sm:w-48" />
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-6 sm:pb-6">
            <Skeleton className="h-3 w-full sm:h-4" />
            <Skeleton className="h-3 w-3/4 sm:h-4" />
            <Skeleton className="h-3 w-1/2 sm:h-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle order not found or unauthorized access
  if (order === null) {
    return <OrderNotFound />;
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <Card>
          <CardContent className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm sm:text-base">Authenticating...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  const isBuyer = order.buyerId === user?._id;
  const hasUserConfirmed = isBuyer
    ? order.buyerConfirmedCompletion
    : order.sellerConfirmedCompletion;
  const otherPartyConfirmed = isBuyer
    ? order.sellerConfirmedCompletion
    : order.buyerConfirmedCompletion;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return (
          <Badge
            className="border-yellow-200 bg-yellow-100 text-yellow-800"
            variant="secondary"
          >
            <Clock className="mr-1 h-3 w-3" />
            In Escrow
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            className="border-green-200 bg-green-100 text-green-800"
            variant="secondary"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status.replace('_', ' ')}</Badge>;
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    setError(null);

    try {
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/orders/confirm-completion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
          }),
        }
      );
      console.log('Confirmation result:', result);
      // The useQuery will automatically update the UI with the new state!
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          Order Details
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your transaction and manage completion confirmations
        </p>
      </div>

      {/* Order Information Card */}
      <Card>
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                <span className="truncate">
                  Order #{order._id.slice(-8).toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Transaction details and current status
              </CardDescription>
            </div>
            <div className="flex-shrink-0 self-start sm:self-center">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Transaction Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs sm:text-sm">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                Transaction Amount
              </div>
              <div className="font-bold text-xl sm:text-2xl">
                ₦{(order.amount / 100).toFixed(2)}
              </div>
            </div>

            {/* Parties Involved */}
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs sm:text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Buyer
                </div>
                <div className="truncate font-medium text-sm sm:text-base">
                  {order.buyerName}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs sm:text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Seller
                </div>
                <div className="truncate font-medium text-sm sm:text-base">
                  {order.sellerName}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status-specific content */}
      {order.status === 'in_escrow' && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="flex items-center gap-2 text-base text-yellow-800 sm:text-lg">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              Escrow Protection Active
            </CardTitle>
            <CardDescription className="text-sm text-yellow-700 sm:text-base">
              Funds are securely held until both parties confirm completion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6">
            {/* Confirmation Status */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex flex-col gap-2 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-4">
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base">
                    Your Confirmation
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {isBuyer ? 'As the buyer' : 'As the seller'}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {hasUserConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5" />
                      <span className="font-medium text-green-600 text-sm sm:text-base">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 flex-shrink-0 text-yellow-600 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm text-yellow-600 sm:text-base">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-4">
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base">
                    Other Party
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {isBuyer ? 'Seller confirmation' : 'Buyer confirmation'}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {otherPartyConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5" />
                      <span className="font-medium text-green-600 text-sm sm:text-base">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 flex-shrink-0 text-yellow-600 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm text-yellow-600 sm:text-base">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Section */}
            {!hasUserConfirmed && (
              <div className="space-y-3 sm:space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm sm:text-base">
                    Once you have received the item/service and are satisfied
                    with the transaction, please confirm completion below to
                    release the funds to the seller.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-green-600 text-sm hover:bg-green-700 sm:text-base"
                  disabled={isConfirming}
                  onClick={handleConfirm}
                  size="lg"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="truncate">
                        Confirming Transaction...
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {isBuyer
                          ? 'I have received the product'
                          : 'I have delivered the products '}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {hasUserConfirmed && !otherPartyConfirmed && (
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm sm:text-base">
                  You have confirmed completion. Waiting for the other party to
                  confirm before funds are released.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm sm:text-base">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {order.status === 'completed' && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3 text-center sm:space-y-4">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12">
                <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h2 className="font-bold text-green-800 text-lg sm:text-xl">
                  Transaction Complete!
                </h2>
                <p className="px-2 text-green-700 text-sm sm:text-base">
                  This transaction was successfully completed on{' '}
                  <span className="font-medium">
                    {new Date(order.completedAt!).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <ProductsList
        error={products === null ? 'Failed to load products' : undefined}
        isLoading={products === undefined}
        products={products}
      />
    </div>
  );
}
