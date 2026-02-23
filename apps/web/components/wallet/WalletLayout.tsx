import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import type { Doc } from 'backend/convex/_generated/dataModel';
import AccountVerificationDialog from './AccountVerificationDialog';
import TransactionHistory from './TransactionHistory';
import WalletActions from './WalletActions';
import WalletBalance from './WalletBalance';
import WalletHeader from './WalletHeader';

type WalletLayoutProps = {
  user: Doc<'users'>;
  balance: number;
  showBalance: boolean;
  isRefreshingBalance: boolean;
  activeTab: string;
  transactions: any[] | undefined;
  isLoadingTransactions: boolean;
  open: boolean;
  withdrawOpen: boolean;
  amount: number;
  error: string | null;
  isInitializing: boolean;
  isPaystackModalOpen: boolean;
  paystackReference: string;
  banks: any[];
  selectedBank: string;
  accountNumber: string;
  accountName: string;
  isLoadingBanks: boolean;
  isVerifyingAccount: boolean;
  isWithdrawing: boolean;
  recipientDetails: any;
  verifyDialogOpen: boolean;
  // Event handlers
  onToggleBalance: () => void;
  onRefreshBalance: () => void;
  setActiveTab: (tab: string) => void;
  handleRefreshTransactions: () => void;
  setOpen: (open: boolean) => void;
  setWithdrawOpen: (open: boolean) => void;
  setAmount: (amount: string) => void;
  setError: (error: string | null) => void;
  setPaystackReference: (reference: string) => void;
  setIsPaystackModalOpen: (open: boolean) => void;
  handleInitializePayment: () => void;
  handlePaystackSuccess: (response: { reference: string }) => Promise<void>;
  handlePaystackClose: () => void;
  setSelectedBank: (bank: string) => void;
  setAccountNumber: (number: string) => void;
  setAccountName: (name: string) => void;
  verifyAccount: () => void;
  handleWithdraw: () => void;
  handleContinueToConfirmation: () => void;
  setVerifyDialogOpen: (open: boolean) => void;
  // Bank account management
  bankAccounts: any[];
  selectedBankAccountId: string;
  setSelectedBankAccountId: (id: string) => void;
  saveNewAccount: boolean;
  setSaveNewAccount: (save: boolean) => void;
  useNewAccount: boolean;
  setUseNewAccount: (use: boolean) => void;
};

export default function WalletLayout({
  user,
  balance,
  showBalance,
  isRefreshingBalance,
  activeTab,
  transactions,
  isLoadingTransactions,
  open,
  withdrawOpen,
  amount,
  error,
  isInitializing,
  isPaystackModalOpen,
  paystackReference,
  banks,
  selectedBank,
  accountNumber,
  accountName,
  isLoadingBanks,
  isVerifyingAccount,
  isWithdrawing,
  recipientDetails,
  verifyDialogOpen,
  onToggleBalance,
  onRefreshBalance,
  setActiveTab,
  handleRefreshTransactions,
  setOpen,
  setWithdrawOpen,
  setAmount,
  setError,
  setPaystackReference,
  setIsPaystackModalOpen,
  handleInitializePayment,
  handlePaystackSuccess,
  handlePaystackClose,
  setSelectedBank,
  setAccountNumber,
  setAccountName,
  verifyAccount,
  handleWithdraw,
  handleContinueToConfirmation,
  setVerifyDialogOpen,
  bankAccounts,
  selectedBankAccountId,
  setSelectedBankAccountId,
  saveNewAccount,
  setSaveNewAccount,
  useNewAccount,
  setUseNewAccount,
}: WalletLayoutProps) {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {action !== 'show_history' && (
          <Card className="rounded-none border-0 shadow-none">
            <WalletHeader isMobile={true} user={user} />
            <WalletBalance
              balance={balance}
              isMobile={true}
              isRefreshingBalance={isRefreshingBalance}
              onRefreshBalance={onRefreshBalance}
              onToggleBalance={onToggleBalance}
              showBalance={showBalance}
            >
              <WalletActions
                accountName={accountName}
                accountNumber={accountNumber}
                amount={amount}
                bankAccounts={bankAccounts}
                banks={banks}
                error={error}
                handleContinueToConfirmation={handleContinueToConfirmation}
                handleInitializePayment={handleInitializePayment}
                handlePaystackClose={handlePaystackClose}
                handlePaystackSuccess={handlePaystackSuccess}
                handleWithdraw={handleWithdraw}
                isInitializing={isInitializing}
                isLoadingBanks={isLoadingBanks}
                isMobile={true}
                isPaystackModalOpen={isPaystackModalOpen}
                isVerifyingAccount={isVerifyingAccount}
                isWithdrawing={isWithdrawing}
                open={action === 'open_dialog' ? true : open}
                paystackReference={paystackReference}
                recipientDetails={recipientDetails}
                saveNewAccount={saveNewAccount}
                selectedBank={selectedBank}
                selectedBankAccountId={selectedBankAccountId}
                setAccountName={setAccountName}
                setAccountNumber={setAccountNumber}
                setAmount={setAmount}
                setError={setError}
                setIsPaystackModalOpen={setIsPaystackModalOpen}
                setOpen={setOpen}
                setPaystackReference={setPaystackReference}
                setSaveNewAccount={setSaveNewAccount}
                setSelectedBank={setSelectedBank}
                setSelectedBankAccountId={setSelectedBankAccountId}
                setUseNewAccount={setUseNewAccount}
                setVerifyDialogOpen={setVerifyDialogOpen}
                setWithdrawOpen={setWithdrawOpen}
                useNewAccount={useNewAccount}
                user={user}
                verifyAccount={verifyAccount}
                verifyDialogOpen={verifyDialogOpen}
                withdrawOpen={withdrawOpen}
              />
            </WalletBalance>
          </Card>
        )}
        <TransactionHistory
          activeTab={activeTab}
          handlePaystackClose={handlePaystackClose}
          handlePaystackSuccess={handlePaystackSuccess}
          handleRefreshTransactions={handleRefreshTransactions}
          isLoadingTransactions={isLoadingTransactions}
          isMobile={true}
          setActiveTab={setActiveTab}
          transactions={transactions}
          user={user}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="">
          <Card className="overflow-hidden rounded-none">
            <WalletHeader isMobile={false} user={user} />
            <CardContent className="p-0">
              <WalletBalance
                balance={balance}
                isMobile={false}
                isRefreshingBalance={isRefreshingBalance}
                onRefreshBalance={onRefreshBalance}
                onToggleBalance={onToggleBalance}
                showBalance={showBalance}
              >
                <WalletActions
                  accountName={accountName}
                  accountNumber={accountNumber}
                  amount={amount}
                  bankAccounts={bankAccounts}
                  banks={banks}
                  error={error}
                  handleContinueToConfirmation={handleContinueToConfirmation}
                  handleInitializePayment={handleInitializePayment}
                  handlePaystackClose={handlePaystackClose}
                  handlePaystackSuccess={handlePaystackSuccess}
                  handleWithdraw={handleWithdraw}
                  isInitializing={isInitializing}
                  isLoadingBanks={isLoadingBanks}
                  isMobile={false}
                  isPaystackModalOpen={isPaystackModalOpen}
                  isVerifyingAccount={isVerifyingAccount}
                  isWithdrawing={isWithdrawing}
                  open={open}
                  paystackReference={paystackReference}
                  recipientDetails={recipientDetails}
                  saveNewAccount={saveNewAccount}
                  selectedBank={selectedBank}
                  selectedBankAccountId={selectedBankAccountId}
                  setAccountName={setAccountName}
                  setAccountNumber={setAccountNumber}
                  setAmount={setAmount}
                  setError={setError}
                  setIsPaystackModalOpen={setIsPaystackModalOpen}
                  setOpen={setOpen}
                  setPaystackReference={setPaystackReference}
                  setSaveNewAccount={setSaveNewAccount}
                  setSelectedBank={setSelectedBank}
                  setSelectedBankAccountId={setSelectedBankAccountId}
                  setUseNewAccount={setUseNewAccount}
                  setVerifyDialogOpen={setVerifyDialogOpen}
                  setWithdrawOpen={setWithdrawOpen}
                  useNewAccount={useNewAccount}
                  user={user}
                  verifyAccount={verifyAccount}
                  verifyDialogOpen={verifyDialogOpen}
                  withdrawOpen={withdrawOpen}
                />
              </WalletBalance>

              <TransactionHistory
                activeTab={activeTab}
                handlePaystackClose={handlePaystackClose}
                handlePaystackSuccess={handlePaystackSuccess}
                handleRefreshTransactions={handleRefreshTransactions}
                isLoadingTransactions={isLoadingTransactions}
                isMobile={false}
                setActiveTab={setActiveTab}
                transactions={transactions}
                user={user}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Verification Dialog */}
      <AccountVerificationDialog
        accountNumber={accountNumber}
        amount={amount}
        banks={banks}
        error={error}
        handleWithdraw={handleWithdraw}
        isWithdrawing={isWithdrawing}
        recipientDetails={recipientDetails}
        selectedBank={selectedBank}
        setError={setError}
        setVerifyDialogOpen={setVerifyDialogOpen}
        verifyDialogOpen={verifyDialogOpen}
      />
    </div>
  );
}
