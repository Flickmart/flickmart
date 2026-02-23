'use client';

import { Button } from '@/components/ui/button';

type NumberKeypadProps = {
  onNumberClick: (number: string) => void;
  onClear: () => void;
  onBackspace: () => void;
};

export function NumberKeypad({
  onNumberClick,
  onClear,
  onBackspace,
}: NumberKeypadProps) {
  return (
    <div className="flex h-full flex-col justify-center bg-[#F5F5F5] p-1 md:h-auto md:p-6 md:pt-8">
      <div className="mx-auto h-auto w-full max-w-lg">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              className="h-12 rounded-md border-0 bg-white font-medium text-gray-900 text-xl shadow-sm hover:bg-gray-50 md:h-16 md:text-2xl"
              key={number}
              onClick={() => onNumberClick(number.toString())}
              variant="secondary"
            >
              {number}
            </Button>
          ))}

          <Button
            className="h-12 rounded-md border-0 bg-white font-medium text-base text-gray-900 shadow-sm hover:bg-gray-50 md:h-16 md:text-lg"
            onClick={onClear}
            variant="secondary"
          >
            Clear
          </Button>

          <Button
            className="h-12 rounded-md border-0 bg-white font-medium text-gray-900 text-xl shadow-sm hover:bg-gray-50 md:h-16 md:text-2xl"
            onClick={() => onNumberClick('0')}
            variant="secondary"
          >
            0
          </Button>

          <Button
            className="h-12 rounded-md border-0 bg-white font-medium text-base text-gray-900 shadow-sm hover:bg-gray-50 md:h-16 md:text-lg"
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
