"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  CheckCircle,
  Clock,
  CreditCard,
  User,
  Package,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as Id<"orders">;

  const user = useQuery(api.users.current);
  const { getToken } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time order data from Convex
  const order = useQuery(api.orders.getOrderById, { orderId });

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <p className="text-muted-foreground">
          Track your transaction and manage completion confirmations
        </p>
      </div>

      {/* Order Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order #{order._id.slice(-8).toUpperCase()}
              </CardTitle>
              <CardDescription>
                Transaction details and current status
              </CardDescription>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Transaction Amount
              </div>
              <div className="text-2xl font-bold">
                ₦{(order.amount / 100).toFixed(2)}
              </div>
            </div>

            {/* Parties Involved */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Buyer
                </div>
                <div className="font-medium">{order.buyerName}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Seller
                </div>
                <div className="font-medium">{order.sellerName}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status-specific content */}
      {order.status === "in_escrow" && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <ShieldCheck className="h-5 w-5" />
              Escrow Protection Active
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Funds are securely held until both parties confirm completion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confirmation Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div className="space-y-1">
                  <div className="font-medium">Your Confirmation</div>
                  <div className="text-sm text-muted-foreground">
                    {isBuyer ? "As the buyer" : "As the seller"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasUserConfirmed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div className="space-y-1">
                  <div className="font-medium">Other Party</div>
                  <div className="text-sm text-muted-foreground">
                    {isBuyer ? "Seller confirmation" : "Buyer confirmation"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {otherPartyConfirmed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">
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
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Once you have received the item/service and are satisfied
                    with the transaction, please confirm completion below to
                    release the funds to the seller.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming Transaction...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Transaction Completion
                    </>
                  )}
                </Button>
              </div>
            )}

            {hasUserConfirmed && !otherPartyConfirmed && (
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  You have confirmed completion. Waiting for the other party to
                  confirm before funds are released.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {order.status === "completed" && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-green-800">
                  Transaction Complete!
                </h2>
                <p className="text-green-700">
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
    </div>
  );
}
