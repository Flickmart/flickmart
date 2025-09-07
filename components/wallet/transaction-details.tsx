'use client';

import { format } from 'date-fns';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Doc } from '@/convex/_generated/dataModel';

import { cn } from '@/lib/utils';
import { TransactionReceipt } from './transaction-receipt';
import { TransactionStatusBadge } from './transaction-status-badge';
import { formatAmount } from './transaction-utils';

interface TransactionDetailsProps {
  transaction: Doc<'transactions'>;
  user: Doc<'users'>;
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

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full overflow-auto">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild className="cursor-pointer">
          <div
            className="flex items-center gap-3 rounded-lg bg-white p-3"
            key={transaction._id}
          >
            {transaction.type === 'funding' ||
            transaction.type === 'transfer_in' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <ArrowDownToLine className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ArrowUpFromLine className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-gray-500 text-xs">
                {format(transaction._creationTime, 'MMM dd, yyyy')} at{' '}
                {format(transaction._creationTime, 'hh:mm a')}
              </p>
            </div>
            <div
              className={cn(
                'flex flex-col items-center gap-1 text-right',
                transaction.type === 'withdrawal' ||
                  transaction.type === 'ads_posting' ||
                  transaction.type === 'ad_promotion'
                  ? 'text-red-500'
                  : 'text-green-500'
              )}
            >
              <span className="flex items-center gap-1 font-semibold text-sm">
                {transaction.type === 'withdrawal' ||
                transaction.type === 'ads_posting' ||
                transaction.type === 'ad_promotion'
                  ? '-'
                  : '+'}
                {formatAmount(transaction.amount / 100)}
              </span>
              <TransactionStatusBadge status={transaction.status} />
            </div>
          </div>
        </SheetTrigger>

        <SheetContent
          className="h-auto w-screen overflow-auto rounded-t-2xl border-0 p-0 sm:rounded-2xl lg:mx-auto lg:max-w-lg"
          side="right"
        >
          <div className="flex h-full flex-col">
            <TransactionReceipt
              handlePaystackClose={handlePaystackClose}
              handlePaystackSuccess={handlePaystackSuccess}
              onClose={onClose}
              transaction={transaction}
              user={user}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
