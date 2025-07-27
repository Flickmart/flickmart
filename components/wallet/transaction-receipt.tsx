"use client";

import { format } from "date-fns";
import {
  ArrowUpRight,
  RotateCcw,
  Share,
  Download,
  CheckCircle,
  Clock,
  ArrowDownLeft,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatAmount } from "./transaction-utils";
import { Doc } from "@/convex/_generated/dataModel";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PaystackButton } from "react-paystack";
import { TransactionStatusBadge } from "./transaction-status-badge";
import Image from "next/image";

interface TransactionReceiptProps {
  transaction: Doc<"transactions">;
  user: Doc<"users">;
  handlePaystackSuccess: (response: { reference: string }) => Promise<void>;
  handlePaystackClose: () => void;
}

export function TransactionReceipt({
  transaction,
  user,
  handlePaystackSuccess,
  handlePaystackClose,
}: TransactionReceiptProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const config = {
    reference: transaction.paystackReference || transaction.reference,
    amount: transaction.amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const generateReceiptImage = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;
    
    setIsCapturing(true);
    
    if (receiptRef.current) {
      receiptRef.current.style.animation = "none";
    }

    // Small delay to let layout settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const html2canvas = (await import("html2canvas")).default;
      await document.fonts.ready;

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: window.devicePixelRatio || 2,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
      });
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      if (receiptRef.current) {
        receiptRef.current.style.animation = "";
      }
      setIsCapturing(false);
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const imageBlob = await generateReceiptImage();
      if (!imageBlob) {
        toast.error("Failed to generate receipt image");
        return;
      }

      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flickmart-transaction-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Receipt downloaded");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
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
          text: "Transaction receipt from Flickmart",
          files: [file],
        });

        toast.success("Shared successfully");
      } else {
        toast.error("Sharing not supported on this device");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share receipt");
    } finally {
      setIsSharing(false);
    }
  };

  const recipient = transaction.metadata?.recipientName
  const getTransactionDescription = () => {
    switch (transaction.type) {
      case "funding":
        return {
          title: `${transaction.cardType?.toUpperCase() || "Card"} Payment`,
          subtitle: "To Flickmart Wallet",
          recipient: user.name,
        };
      case "withdrawal":
        return {
          title: "Wallet Withdrawal",
          subtitle: "From Flickmart Wallet",
          recipient: "Bank Account",
        };
      case "transfer_in":
        return {
          title: "Transfer Received",
          subtitle: "To Flickmart Wallet",
          recipient: recipient ? recipient : user.name,
        };
      case "transfer_out":
        return {
          title: "Transfer Received",
          subtitle: "To Flickmart Wallet",
          recipient: recipient ? recipient : user.name,
        };
      case "ads_posting":
        return {
          title: "Ads Payment",
          subtitle: "To Flickmart LLC",
          recipient: "Flickmart LLC",
        };
      default:
        return {
          title: "Transaction",
          subtitle: "Flickmart",
          recipient: "Unknown",
        };
    }
  };

  const transactionInfo = getTransactionDescription();

  return (
    <div className=" relative">
      <div
        className="px-6 space-y-2 bg-white relative z-10"
        id="capture_div"
        ref={receiptRef}
        style={isCapturing ? { width: '400px' } : {}}
      >
        {/* Compact Orange Brand Banner */}
        <div className="text-center py-3 bg-flickmart -mx-6 mb-6 relative">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex gap-1 items-center">
              <Image
                src="/flickmart-logo.svg"
                width={500}
                height={500}
                className="h-12 w-12"
                alt=""
              />
              <h1 className="font-bold text-xl mt-2">
                Flick<span className="text-white">Mart</span>
              </h1>
            </div>
            <p className="text-orange-100 text-sm">Transaction Receipt</p>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {transaction.type !== "funding" && transaction.type !== "transfer_in" ? (

                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                  <ArrowUpRight className="h-5 w-5 text-flickmart" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {transactionInfo.title}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-semibold text-flickmart">
                    {transactionInfo.subtitle}
                  </span>
                </p>
                {transaction.cardType &&
                  transaction.bank &&
                  transaction.last4 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{transaction.bank}</span>
                      <span>•</span>
                      <span>•••• {transaction.last4}</span>
                    </div>
                  )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatAmount(transaction.amount / 100)}
              </p>
              <p className="text-xs text-flickmart font-semibold capitalize">
                {transaction.status}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-3">
            <div className="w-1 h-6 bg-flickmart rounded-full"></div>
            Transaction Details
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">
                Transaction ID
              </span>
              <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                {transaction.reference || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">
                Date & Time
              </span>
              <div className="text-right">
                <p className="font-semibold text-sm text-gray-900">
                  {format(transaction._creationTime, "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-gray-500">
                  {format(transaction._creationTime, "hh:mm a")}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">
                Recipient
              </span>
              <div className="flex items-center gap-3">
                {transaction.type !== "ads_posting" &&
                  transaction.type !== "withdrawal" && (
                    <Avatar className="h-8 w-8 border-2 border-orange-200">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="text-xs bg-flickmart text-white font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                <span className="font-semibold text-sm text-gray-900">
                  {transactionInfo.recipient}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">Status</span>
              <TransactionStatusBadge status={transaction.status} />
            </div>

            {transaction.cardType && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600 text-sm font-medium">
                  Payment Method
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-flickmart rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {transaction.cardType[0]}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-gray-900">
                    •••• {transaction.last4}
                  </span>
                </div>
              </div>
            )}

            {transaction.bank && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600 text-sm font-medium">Bank</span>
                <span className="font-semibold text-sm text-gray-900">
                  {transaction.bank}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">Amount</span>
              <span className="font-bold text-flickmart">
                {formatAmount(transaction.amount / 100)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-600 text-sm font-medium">Fee</span>
              <span className="font-medium text-gray-800">$0.00</span>
            </div>

            {transaction.paystackReference && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600 text-sm font-medium">
                  Reference
                </span>
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                  {transaction.paystackReference}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="text-center py-3 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 bg-flickmart rounded-full"></div>
              <span className="text-xs text-gray-600 font-medium">
                Secure & Verified
              </span>
              <div className="w-2 h-2 bg-flickmart rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Thank you for choosing Flickmart
            </p>
            <p className="text-xs text-gray-500">
              Generated on {new Date().toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Customer Service: support@flickmart.app
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="space-y-3">
          {/* Primary Action */}
          <Button
            className="w-full h-12 bg-flickmart hover:bg-orange-700 text-white font-semibold rounded-xl"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Share className="h-4 w-4 mr-2" />
            )}
            Share Receipt
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-10 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium rounded-xl"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
              ) : (
                <>
                  <Download className="h-3 w-3 mr-2" />
                  Download
                </>
              )}
            </Button>

            {transaction.type === "funding" &&
              transaction.status === "pending" ? (
              <PaystackButton
                {...config}
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                email={user.email || ""}
              >
                <Button
                  variant="outline"
                  className="h-10 bg-white hover:bg-orange-50 border-orange-300 text-orange-700 font-medium rounded-xl hover:text-orange-800 w-full"
                >
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Retry
                </Button>
              </PaystackButton>
            ) : (
              <Button
                variant="outline"
                className="h-10 bg-white hover:bg-orange-50 border-orange-300 text-orange-700 font-medium rounded-xl hover:text-orange-800"
                disabled
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
