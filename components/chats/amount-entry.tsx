'use client';

import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Doc } from '@/convex/_generated/dataModel';
import { NumberKeypad } from './number-keypad';
import { PresetAmounts } from './preset-amounts';
import { SecurityHeader } from './security-header';

interface AmountEntryProps {
  amount: string;
  displayAmount: string;
  seller?: Doc<'users'>;
  onNumberClick: (number: string) => void;
  onPresetClick: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onTransfer: () => void;
}

export function AmountEntry({
  seller,
  amount,
  displayAmount,
  onNumberClick,
  onPresetClick,
  onClear,
  onBackspace,
  onTransfer,
}: AmountEntryProps) {
  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex items-center justify-between p-2 pb-4">
        <div className="ml-auto flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-600 text-sm">Secure</span>
        </div>
      </div>

      {/* <SecurityHeader /> */}
      <div className="flex-1 px-6 pb-0 overflow-y-auto md:overflow-y-hidden">
        <div className="mx-auto max-w-lg">
        <div className="flex max-w-lg items-center justify-start gap-2  pb-4 ">
          <Avatar className="h-10 w-10 border border-flickmart">
            <AvatarImage alt={seller?.name || 'User'} src={seller?.imageUrl} />
            <AvatarFallback>
              {seller?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 text-xl text-extrabold">{seller?.name}</span>
        </div>
          <h1 className="mb-4 font-semibold text-2xl text-gray-900 mt-5 md:mt-9">Amount</h1>

          <div className="mb-8">
            <div className="mb-2 flex items-center font-light text-4xl text-gray-900">
              <span className="mr-2">₦</span>
              <span className="min-w-0 flex-1">{displayAmount || '0.00'}</span>
            </div>
            <div className="h-px bg-gray-200" />
          </div>

          <PresetAmounts onPresetClick={onPresetClick} />

          <Button
            className="mb-6 w-full rounded-full bg-orange-500 py-5 font-medium text-lg text-white hover:bg-orange-600"
            disabled={!amount}
            onClick={onTransfer}
          >
            Transfer
          </Button>
        </div>
      </div>

      <div className="md:h-auto h-[40vh]">
        <NumberKeypad
          onBackspace={onBackspace}
          onClear={onClear}
          onNumberClick={onNumberClick}
        />
      </div>
    </div>
  );
}
