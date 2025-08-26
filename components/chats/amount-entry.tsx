'use client';

import { Shield } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between p-2 pb-4">
        <div className="flex max-w-md items-center justify-center gap-2 px-6 py-1">
          <Avatar className="h-10 w-10 border border-flickmart">
            <AvatarImage alt={seller?.name || 'User'} src={seller?.imageUrl} />
            <AvatarFallback>
              {seller?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">{seller?.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-600 text-sm">Secure</span>
        </div>
      </div>

      {/* <SecurityHeader /> */}
      <div className="flex-1 px-6 pb-0">
        <div className="mx-auto max-w-md">
          <h1 className="mb-8 font-semibold text-2xl text-gray-900">Amount</h1>

          <div className="mb-8">
            <div className="mb-2 flex items-center font-light text-4xl text-gray-900">
              <span className="mr-2">₦</span>
              <span className="min-w-0 flex-1">{displayAmount || '0.00'}</span>
            </div>
            <div className="h-px bg-gray-200" />
          </div>

          <PresetAmounts onPresetClick={onPresetClick} />

          <Button
            className="mb-6 w-full rounded-2xl bg-orange-500 py-4 font-medium text-lg text-white hover:bg-orange-600"
            disabled={!amount}
            onClick={onTransfer}
          >
            Transfer
          </Button>
        </div>
      </div>

      <NumberKeypad
        onBackspace={onBackspace}
        onClear={onClear}
        onNumberClick={onNumberClick}
      />
    </div>
  );
}
