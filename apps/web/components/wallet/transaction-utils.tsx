import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export const formatAmount = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString();
  return <span>₦{formattedAmount}</span>;
};

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'funding':
    case 'transfer_in':
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <ArrowDownToLine className="h-5 w-5 text-green-600" />
        </div>
      );
    case 'withdrawal':
    case 'transfer_out':
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
          <ArrowUpFromLine className="h-5 w-5 text-orange-600" />
        </div>
      );
    default:
      return null;
  }
};

export const getAmountColor = (amount: number, status: string) => {
  return {
    'text-green-600': amount > 0 && status === 'success',
    'text-red-500': (amount < 0 && status === 'success') || status === 'failed',
    'text-blue-500': status === 'pending',
    'text-yellow-500': status === 'cancelled',
  };
};
