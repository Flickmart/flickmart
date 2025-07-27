"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { TransactionStatusBadge } from "./transaction-status-badge";
import { TransactionReceipt } from "./transaction-receipt";
import { formatAmount } from "./transaction-utils";

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

            <TransactionReceipt
              transaction={transaction}
              user={user}
              handlePaystackSuccess={handlePaystackSuccess}
              handlePaystackClose={handlePaystackClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
