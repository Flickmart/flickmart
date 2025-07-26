"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  CheckCircle,
  Clock,
  CreditCard,
  User,
  Package,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ProductsList } from "@/components/orders";
import { Skeleton } from "@/components/ui/skeleton";


// Error component for invalid order IDs
const OrderNotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
      <p className="text-gray-500 mb-6">
        The order you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link href="/orders">
        <Button className="bg-flickmart hover:bg-flickmart/90">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </Link>
    </div>
  </div>
);

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as Id<"orders">;

  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();
  const { getToken } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time order data from Convex
  const order = useQuery(api.orders.getOrderById, { orderId });

  const products = useQuery(
    api.orders.getProductsByIds,
    order ? { productIds: order.productIds } : "skip"
  );
  if (order === undefined) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
        </div>
        <Card>
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
            <Skeleton className="h-3 sm:h-4 w-36 sm:w-48" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
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
      case "in_escrow":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            In Escrow
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    setError(null);

    try {
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Authentication failed. Please log in again.");
        return;
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/orders/confirm-completion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
          }),
        }
      );
      console.log("Confirmation result:", result);
      // The useQuery will automatically update the UI with the new state!
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Order Details</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your transaction and manage completion confirmations
        </p>
      </div>

      {/* Order Information Card */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Order #{order._id.slice(-8).toUpperCase()}</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Transaction details and current status
              </CardDescription>
            </div>
            <div className="flex-shrink-0 self-start sm:self-center">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Transaction Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                Transaction Amount
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                ₦{(order.amount / 100).toFixed(2)}
              </div>
            </div>

            {/* Parties Involved */}
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Buyer
                </div>
                <div className="font-medium text-sm sm:text-base truncate">{order.buyerName}</div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Seller
                </div>
                <div className="font-medium text-sm sm:text-base truncate">{order.sellerName}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status-specific content */}
      {order.status === "in_escrow" && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="flex items-center gap-2 text-yellow-800 text-base sm:text-lg">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              Escrow Protection Active
            </CardTitle>
            <CardDescription className="text-yellow-700 text-sm sm:text-base">
              Funds are securely held until both parties confirm completion
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            {/* Confirmation Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-background gap-2 sm:gap-0">
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base">Your Confirmation</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {isBuyer ? "As the buyer" : "As the seller"}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {hasUserConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-600 font-medium text-sm sm:text-base">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                      <span className="text-yellow-600 font-medium text-sm sm:text-base">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-background gap-2 sm:gap-0">
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base">Other Party</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {isBuyer ? "Seller confirmation" : "Buyer confirmation"}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {otherPartyConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-600 font-medium text-sm sm:text-base">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                      <span className="text-yellow-600 font-medium text-sm sm:text-base">
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
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700  text-sm sm:text-base"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="truncate">Confirming Transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {isBuyer ? "I have received the product" : "I have delivered the products "}
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
                <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {order.status === "completed" && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-green-800">
                  Transaction Complete!
                </h2>
                <p className="text-green-700 text-sm sm:text-base px-2">
                  This transaction was successfully completed on{" "}
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
        products={products}
        isLoading={products === undefined}
        error={products === null ? "Failed to load products" : undefined}
      />
    </div>
  );
}
