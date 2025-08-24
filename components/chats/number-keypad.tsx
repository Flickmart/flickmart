'use client';

import { Button } from '@/components/ui/button';

interface NumberKeypadProps {
  onNumberClick: (number: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function NumberKeypad({
  onNumberClick,
  onClear,
  onBackspace,
}: NumberKeypadProps) {
  return (
    <div className="bg-[#F5F5F5] p-4 md:p-6 md:pt-8 h-full md:h-auto flex flex-col justify-center">
      <div className="mx-auto max-w-lg w-full">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              className="h-12 md:h-16 rounded-md border-0 bg-white font-medium text-xl md:text-2xl text-gray-900 shadow-sm hover:bg-gray-50"
              key={number}
              onClick={() => onNumberClick(number.toString())}
              variant="secondary"
            >
              {number}
            </Button>
          ))}

          <Button
            className="h-12 md:h-16 rounded-md border-0 bg-white font-medium text-gray-900 text-base md:text-lg shadow-sm hover:bg-gray-50"
            onClick={onClear}
            variant="secondary"
          >
            Clear
          </Button>

          <Button
            className="h-12 md:h-16 rounded-md border-0 bg-white font-medium text-xl md:text-2xl text-gray-900 shadow-sm hover:bg-gray-50"
            onClick={() => onNumberClick('0')}
            variant="secondary"
          >
            0
          </Button>

          <Button
            className="h-12 md:h-16 rounded-md border-0 bg-white font-medium text-gray-900 text-base md:text-lg shadow-sm hover:bg-gray-50"
            onClick={onBackspace}
            variant="secondary"
          >
            ⌫
          </Button>
        </div>
      </div>
    </div>
  );
}
