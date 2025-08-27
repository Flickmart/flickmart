"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SecurityHeader } from "./security-header";

interface AmountConfirmationProps {
  initialAmount: string;
  selectedProductsCount: number;
  calculatedTotal: number;
  onBack: () => void;
  onSelectInitialAmount: () => void;
  onSelectProductTotal: () => void;
  sellerName?: string;
}

export function AmountConfirmation({
  initialAmount,
  selectedProductsCount,
  calculatedTotal,
  onBack,
  onSelectInitialAmount,
  onSelectProductTotal,
  sellerName,
}: AmountConfirmationProps) {
  const formatAmount = (value: string | number) => {
    const num = typeof value === "string" ? Number.parseFloat(value) : value;
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const initialAmountNum = Number.parseFloat(initialAmount);
  const difference = calculatedTotal - initialAmountNum;

  return (
    <div className="flex flex-1 flex-col justify-center mg:p-6">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-semibold text-2xl text-gray-900 md:text-4xl">
            Choose Transfer Amount
          </h1>
          <p className="text-gray-600 text-xs md:text-md px-3">
            You've selected {selectedProductsCount} product
            {selectedProductsCount !== 1 ? "s" : ""}. How much would you like to
            transfer?
          </p>
        </div>

        {/* Transaction Details Panel */}
        <div className="mb-6 rounded-xl bg-[#D9D9D93D] p-4">
          <p className="mb-3 font-medium text-gray-800">Transaction Details</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-900">
                {sellerName || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Entered Amount</span>
              <span className="font-semibold text-gray-900">
                ₦{formatAmount(initialAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount Difference</span>
              <span className="font-semibold text-gray-900">
                {difference > 0
                  ? "₦" + formatAmount(Math.abs(difference))
                  : difference < 0
                    ? "-₦" + formatAmount(Math.abs(difference))
                    : "₦0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Product Cost</span>
              <span className="font-semibold text-gray-900">
                ₦{formatAmount(calculatedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 p-3">
          <Button
            className="w-full rounded-2xl bg-orange-500 py-4 font-medium text-lg text-white hover:bg-orange-600"
            onClick={onSelectInitialAmount}
          >
            Transfer ₦{formatAmount(initialAmount)}
          </Button>

          <Button
            className="w-full rounded-2xl bg-orange-50 py-4 font-medium text-lg text-orange-600 hover:bg-orange-100"
            onClick={onSelectProductTotal}
          >
            Transfer ₦{formatAmount(calculatedTotal)}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs px-3">
            You can change this selection by going back to product selection
          </p>
        </div>
      </div>
    </div>
  );
}
