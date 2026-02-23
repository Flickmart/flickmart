import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Doc } from 'backend/convex/_generated/dataModel';
import { TransactionHistorySkeleton } from './skeleton';
import TransactionTabs from './TransactionTabs';
import TransactionDetails from './transaction-details';

type TransactionHistoryProps = {
  transactions: any[] | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoadingTransactions: boolean;
  handleRefreshTransactions: () => void;
  user: Doc<'users'>;
  handlePaystackSuccess: (response: { reference: string }) => Promise<void>;
  handlePaystackClose: () => void;
  isMobile?: boolean;
};

export default function TransactionHistory({
  transactions,
  activeTab,
  setActiveTab,
  isLoadingTransactions,
  handleRefreshTransactions,
  user,
  handlePaystackSuccess,
  handlePaystackClose,
  isMobile = false,
}: TransactionHistoryProps) {
  const filteredTransactions = transactions?.filter((transaction) => {
    if (activeTab === 'all') {
      return true;
    }
    if (activeTab === 'deposits') {
      return (
        transaction.type === 'funding' ||
        transaction.type === 'transfer_in' ||
        transaction.type === 'escrow_refund'
      );
    }
    if (activeTab === 'withdrawals') {
      return transaction.type === 'withdrawal';
    }
    return true;
  });

  const containerPadding = isMobile ? 'p-4' : 'p-8';
  const titleSize = isMobile ? 'text-xl' : 'text-2xl';
  const titleMargin = isMobile ? 'mb-1' : 'mb-2';
  const descriptionSize = isMobile ? 'text-sm' : 'text-base';

  if (isLoadingTransactions) {
    return <TransactionHistorySkeleton />;
  }

  return (
    <div className={containerPadding}>
      <div
        className={`mb-${isMobile ? '4' : '6'} flex items-center justify-between`}
      >
        <div>
          <h3 className={`${titleMargin} font-bold ${titleSize}`}>
            Transaction History
          </h3>
          <p className={`text-gray-500 ${descriptionSize}`}>
            Your recent financial activities
          </p>
        </div>
        <Button
          className="text-gray-600 hover:text-gray-800"
          onClick={handleRefreshTransactions}
          size="sm"
          variant="ghost"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <TransactionTabs
        activeTab={activeTab}
        isMobile={isMobile}
        setActiveTab={setActiveTab}
      />

      {filteredTransactions?.length === 0 && (
        <span>No transactional activities</span>
      )}

      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {filteredTransactions?.map((transaction) => (
          <TransactionDetails
            handlePaystackClose={handlePaystackClose}
            handlePaystackSuccess={handlePaystackSuccess}
            key={transaction._id}
            transaction={transaction}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
