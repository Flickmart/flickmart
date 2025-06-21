import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import React from "react";

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case "funding":
    case "transfer_in":
      return React.createElement(
        "div",
        {
          className:
            "w-10 h-10 rounded-full bg-green-100 flex items-center justify-center",
        },
        React.createElement(ArrowDownToLine, {
          className: "w-5 h-5 text-green-600",
        })
      );
    case "withdrawal":
    case "ads_posting":
    case "ad_promotion":
    case "transfer_out":
      return React.createElement(
        "div",
        {
          className:
            "w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center",
        },
        React.createElement(ArrowUpFromLine, {
          className: "w-5 h-5 text-orange-600",
        })
      );
    default:
      return null;
  }
};

export const formatAmount = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString();
  return `₦${formattedAmount}`;
};

export const getAmountColor = (
  amount: number,
  status: string,
  type?: "funding" | "transfer_in" | "transfer_out" | "escrow_freeze" | "escrow_release" | "escrow_refund" | "ads_posting" | "ad_promotion" | "subscription" | "refund" | "withdrawal"
) => {
  if (
    (type === "withdrawal" || type === "transfer_out" || type === "ads_posting" || type === "ad_promotion" || type === "escrow_freeze" || type === "subscription") &&
    status === "success"
  ) {
    return { "text-gray-500": true };
  }
  if (
    (type === "funding" || type === "transfer_in" || type === "escrow_release" || type === "escrow_refund" || type === "refund") &&
    status === "success"
  ) {
    return { "text-green-600": true };
  }
  if (status === "failed") {
    return { "text-red-500": true };
  }
  if (status === "pending") {
    return { "text-blue-500": true };
  }
  if (status === "cancelled") {
    return { "text-yellow-500": true };
  }
  return {};
};
