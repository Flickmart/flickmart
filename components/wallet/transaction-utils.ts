import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import React from 'react';

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case "funding":
    case "transfer_in":
      return (
        React.createElement("div", { className: "w-10 h-10 rounded-full bg-green-100 flex items-center justify-center" },
          React.createElement(ArrowDownToLine, { className: "w-5 h-5 text-green-600" })
        )
      );
    case "withdrawal":
    case "transfer_out":
      return (
        React.createElement("div", { className: "w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center" },
          React.createElement(ArrowUpFromLine, { className: "w-5 h-5 text-orange-600" })
        )
      );
    default:
      return null;
  }
};

export const formatAmount = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString();
  return `₦${formattedAmount}`;
};

export const getAmountColor = (amount: number, status: string) => {
  return {
    "text-green-600": amount > 0 && status === "success",
    "text-red-500": (amount < 0 && status === "success") || status === "failed",
    "text-blue-500": status === "pending",
    "text-yellow-500": status === "cancelled"
  };
};
