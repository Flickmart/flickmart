import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TransactionStatusBadge } from "./transaction-status-badge";
import { formatAmount } from "./transaction-utils";
import { Doc } from "@/convex/_generated/dataModel";

interface TransactionReceiptProps {
  transaction: Doc<"transactions">;
  user: Doc<"users">;
}

export function TransactionReceipt({ transaction, user }: TransactionReceiptProps) {
  return (
    <div className="px-6 space-y-4 bg-white">
      <div className="text-center py-2 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Flickmart</h2>
        <p className="text-xs text-gray-500">Transaction Receipt</p>
      </div>

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

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 text-base">Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Transaction ID</span>
            <span className="font-medium text-sm">
              {transaction.reference || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Transaction Date</span>
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
                  {user.name.split(" ").map((n) => n[0]).join("")}
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
            <TransactionStatusBadge status={transaction.status} />
          </div>

          {transaction.cardType && (
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 text-sm">Payment Method</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {transaction.cardType[0].toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-sm">•••• {transaction.last4}</span>
              </div>
            </div>
          )}

          {transaction.bank && (
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 text-sm">Bank</span>
              <span className="font-medium text-sm">{transaction.bank}</span>
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

      <div className="text-center py-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">Thank you for using Flickmart</p>
        <p className="text-xs text-gray-400">
          Generated on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
