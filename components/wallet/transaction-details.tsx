"use client";

import { useState, useRef } from "react";
import {
  Share,
  RotateCcw,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { PaystackButton } from "react-paystack";
import { cn } from "@/lib/utils";
import { TransactionStatusBadge } from "./transaction-status-badge";
import { TransactionReceipt } from "./transaction-receipt";
import {
  getTransactionIcon,
  formatAmount,
  getAmountColor,
} from "./transaction-utils";

interface TransactionDetailsProps {
  transaction: Doc<"transactions">;
  user: Doc<"users">;
  handlePaystackSuccess: (response: { reference: string }) => Promise<void>;
  handlePaystackClose: () => void;
}

export default function TransactionDetails({
  transaction,
  user,
  handlePaystackSuccess,
  handlePaystackClose,
}: TransactionDetailsProps) {
  const [open, setOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const generateReceiptImage = async () => {
    if (!receiptRef.current) return null;

    try {
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
        canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
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
            {transaction.type === "funding" ||
            transaction.type === "transfer_in" ? (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowUpFromLine className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {format(transaction._creationTime, "MMM dd, yyyy")} at{" "}
                {format(transaction._creationTime, "hh:mm a")}
              </p>
            </div>
            <div
              className={cn(
                "text-right flex flex-col gap-1 items-center",
                transaction.type === "withdrawal" ||
                  transaction.type === "ads_posting" ||
                  transaction.type === "ad_promotion"
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              <span className="flex items-center gap-1 text-sm font-semibold">
                {transaction.type === "withdrawal" ||
                transaction.type === "ads_posting" ||
                transaction.type === "ad_promotion"
                  ? "-"
                  : "+"}
                {formatAmount(transaction.amount / 100)}
              </span>
              <TransactionStatusBadge status={transaction.status} />
            </div>
          </div>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="h-auto w-screen lg:max-w-lg lg:mx-auto rounded-t-2xl sm:rounded-2xl p-0 border-0 overflow-auto"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">
                  Transaction Details
                </SheetTitle>
              </div>
            </SheetHeader>

            <TransactionReceipt transaction={transaction} user={user} />

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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
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
