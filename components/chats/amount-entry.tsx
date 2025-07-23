"use client";

import { Button } from "@/components/ui/button";
import { SecurityHeader } from "./security-header";
import { NumberKeypad } from "./number-keypad";
import { PresetAmounts } from "./preset-amounts";

interface AmountEntryProps {
  amount: string;
  displayAmount: string;
  onNumberClick: (number: string) => void;
  onPresetClick: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onTransfer: () => void;
}

export function AmountEntry({
  amount,
  displayAmount,
  onNumberClick,
  onPresetClick,
  onClear,
  onBackspace,
  onTransfer,
}: AmountEntryProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SecurityHeader />

      <div className="flex-1 px-6 pb-0">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Amount
          </h1>

          <div className="mb-8">
            <div className="flex items-center text-4xl font-light text-gray-900 mb-2">
              <span className="mr-2">₦</span>
              <span className="min-w-0 flex-1">
                {displayAmount || "0.00"}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
          </div>

          <PresetAmounts onPresetClick={onPresetClick} />

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-2xl text-lg mb-6"
            onClick={onTransfer}
            disabled={!amount}
          >
            Transfer
          </Button>
        </div>
      </div>

      <NumberKeypad
        onNumberClick={onNumberClick}
        onClear={onClear}
        onBackspace={onBackspace}
      />
    </div>
  );
}