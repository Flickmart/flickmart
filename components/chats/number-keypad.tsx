"use client";

import { Button } from "@/components/ui/button";

interface NumberKeypadProps {
  onNumberClick: (number: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function NumberKeypad({ onNumberClick, onClear, onBackspace }: NumberKeypadProps) {
  return (
    <div className="bg-gray-200 p-6 pt-8">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              key={number}
              variant="secondary"
              className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
              onClick={() => onNumberClick(number.toString())}
            >
              {number}
            </Button>
          ))}

          <Button
            variant="secondary"
            className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
            onClick={onClear}
          >
            Clear
          </Button>

          <Button
            variant="secondary"
            className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
            onClick={() => onNumberClick("0")}
          >
            0
          </Button>

          <Button
            variant="secondary"
            className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
            onClick={onBackspace}
          >
            ⌫
          </Button>
        </div>
      </div>
    </div>
  );
}