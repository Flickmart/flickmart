"use client";

import { useState, useRef } from "react";
import {
  ArrowUpRight,
  Clock,
  Share,
  RotateCcw,
  CheckCircle,
  XCircle,
  Slash,
} from "lucide-react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { PaystackButton } from "react-paystack";

export default function TransactionDetails({
  transaction,
  user,
  handlePaystackSuccess,
  handlePaystackClose,
}: {
  transaction: Doc<"transactions">;
  user: Doc<"users">;
  handlePaystackSuccess: (response: { reference: string; }) => Promise<void>;
  handlePaystackClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "transfer":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-green-600" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-orange-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    const formattedAmount = Math.abs(amount).toLocaleString();
    return (
      <span className={isPositive ? "text-green-600" : "text-red-500"}>
        {isPositive ? "+ " : "- "}₦{formattedAmount}
      </span>
    );
  };

  const generateReceiptImage = async () => {
    if (!receiptRef.current) return null;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: receiptRef.current.scrollHeight,
        width: receiptRef.current.scrollWidth,
      });

      return new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/png",
          1.0
        );
      });
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const imageBlob = await generateReceiptImage();

      if (!imageBlob) {
        toast.error("Failed to generate receipt image");
        return;
      }

      const file = new File([imageBlob], "transaction-receipt.png", {
        type: "image/png",
      });

      // Check if Web Share API is supported and can share files
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction receipt for Flickmart`,
          files: [file],
        });

        toast.success("Receipt shared successfully");
      } else {
        // Fallback: Download the image
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transaction-receipt.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.info("Receipt image downloaded to your device");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share receipt");
    } finally {
      setIsSharing(false);
    }
  };

  const config = {
    reference: transaction.paystackReference || transaction.reference,
    amount: transaction.amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  return (
    <div className="w-full overflow-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="cursor-pointer" asChild>
          <div
            key={transaction._id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg"
          >
            {getTransactionIcon(transaction.type)}
            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {format(transaction._creationTime, "MMM dd, yyyy")} at{" "}
                {format(transaction._creationTime, "hh:mm a")}
              </p>
            </div>
            <div className="text-right">
              {formatAmount(transaction.amount / 100)}
            </div>
          </div>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="h-auto w-screen lg:max-w-lg  lg:mx-auto rounded-t-2xl sm:rounded-2xl p-0 border-0 overflow-auto"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">
                  Transaction Details
                </SheetTitle>
              </div>
            </SheetHeader>

            {/* Receipt Content - This will be captured */}
            <div ref={receiptRef} className="px-6 space-y-4 bg-white">
              {/* Company Header for Receipt */}
              <div className="text-center py-2 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Flickmart</h2>
                <p className="text-xs text-gray-500">Transaction Receipt</p>
              </div>

              {/* Transaction Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Card payment to{" "}
                        <span className="font-medium text-gray-900">
                          {transaction.type === "funding" && "Flickmart wallet"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.bank} {transaction.last4}
                      </p>
                      <p className="text-xs text-gray-500">Sent</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatAmount(transaction.amount / 100)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                  Details
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">
                      Transaction ID
                    </span>
                    <span className="font-medium text-sm">
                      {transaction.reference || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">
                      Transaction Date
                    </span>
                    <span className="font-medium text-sm">
                      {format(transaction._creationTime, "MMM dd, yyyy")} at{" "}
                      {format(transaction._creationTime, "hh:mm a")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Recipient</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {transaction.type === "funding"
                          ? user.name
                          : transaction.type === "withdrawal"
                            ? "N/A"
                            : transaction.type === "transfer_in"
                              ? "Flickmart Wallet"
                              : "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Status</span>

                    {transaction.status === "pending" ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    ) : transaction.status === "success" ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-green-700 hover:bg-blue-50 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    ) : transaction.status === "failed" ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-red-700 hover:bg-blue-50 text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    ) : transaction.status === "cancelled" ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-yellow-700 hover:bg-blue-50 text-xs"
                      >
                        <Slash className="h-3 w-3 mr-1" />
                        Cancelled
                      </Badge>
                    ) : (
                      transaction.status
                    )}
                  </div>
                  {transaction.cardType && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm">
                        Payment Method
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {transaction.cardType[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm">
                          •••• {transaction.last4}
                        </span>
                      </div>
                    </div>
                  )}
                  {transaction.bank && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm"> Bank</span>
                      <span className="font-medium text-sm">
                        {transaction.bank}
                      </span>
                    </div>
                  )}

                  {transaction.paystackReference && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm">Reference</span>
                      <span className="font-medium text-sm">
                        {transaction.paystackReference}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Amount</span>
                    <span className="font-semibold text-sm text-green-600">
                      {formatAmount(transaction.amount / 100)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Fee</span>
                    <span className="font-medium text-sm">$0.00</span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="text-center py-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Thank you for using Flickmart
                </p>
                <p className="text-xs text-gray-400">
                  Generated on {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </Button>
                {transaction.type === "funding" &&
                  transaction.status === "pending" && (
                    <PaystackButton
                    {...config}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      email={user.email || ""}
                      className="w-full"
                    >
                      <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    </PaystackButton>
                  )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
