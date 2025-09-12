import { Card, CardContent } from "@/components/ui/card";
import { type Doc } from "@/convex/_generated/dataModel";
import WalletHeader from "./WalletHeader";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";
import TransactionHistory from "./TransactionHistory";
import AccountVerificationDialog from "./AccountVerificationDialog";
import { useSearchParams } from "next/navigation";

interface WalletLayoutProps {
  user: Doc<"users">;
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
}

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
  const searchParams = useSearchParams()
  const action = searchParams.get("action")
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
       {action !== "show_history" && <Card className="rounded-none border-0 shadow-none">
          <WalletHeader user={user} isMobile={true} />
          <WalletBalance
            balance={balance}
            showBalance={showBalance}
            isRefreshingBalance={isRefreshingBalance}
            isMobile={true}
            onToggleBalance={onToggleBalance}
            onRefreshBalance={onRefreshBalance}
          >
            <WalletActions
              user={user}
              isMobile={true}
              open={action === "open_dialog" ? true : open}
              withdrawOpen={withdrawOpen}
              setOpen={setOpen}
              setWithdrawOpen={setWithdrawOpen}
              amount={amount}
              setAmount={setAmount}
              error={error}
              setError={setError}
              isInitializing={isInitializing}
              isPaystackModalOpen={isPaystackModalOpen}
              paystackReference={paystackReference}
              setPaystackReference={setPaystackReference}
              setIsPaystackModalOpen={setIsPaystackModalOpen}
              handleInitializePayment={handleInitializePayment}
              handlePaystackSuccess={handlePaystackSuccess}
              handlePaystackClose={handlePaystackClose}
              banks={banks}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              accountName={accountName}
              setAccountName={setAccountName}
              isLoadingBanks={isLoadingBanks}
              isVerifyingAccount={isVerifyingAccount}
              isWithdrawing={isWithdrawing}
              verifyAccount={verifyAccount}
              handleWithdraw={handleWithdraw}
              handleContinueToConfirmation={handleContinueToConfirmation}
              recipientDetails={recipientDetails}
              verifyDialogOpen={verifyDialogOpen}
              setVerifyDialogOpen={setVerifyDialogOpen}
              bankAccounts={bankAccounts}
              selectedBankAccountId={selectedBankAccountId}
              setSelectedBankAccountId={setSelectedBankAccountId}
              saveNewAccount={saveNewAccount}
              setSaveNewAccount={setSaveNewAccount}
              useNewAccount={useNewAccount}
              setUseNewAccount={setUseNewAccount}
            />
          </WalletBalance>
        </Card>}
        <TransactionHistory
          transactions={transactions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoadingTransactions={isLoadingTransactions}
          handleRefreshTransactions={handleRefreshTransactions}
          user={user}
          handlePaystackSuccess={handlePaystackSuccess}
          handlePaystackClose={handlePaystackClose}
          isMobile={true}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="">
          <Card className="overflow-hidden rounded-none">
            <WalletHeader user={user} isMobile={false} />
            <CardContent className="p-0">
              <WalletBalance
                balance={balance}
                showBalance={showBalance}
                isRefreshingBalance={isRefreshingBalance}
                isMobile={false}
                onToggleBalance={onToggleBalance}
                onRefreshBalance={onRefreshBalance}
              >
                <WalletActions
                  user={user}
                  isMobile={false}
                  open={open}
                  withdrawOpen={withdrawOpen}
                  setOpen={setOpen}
                  setWithdrawOpen={setWithdrawOpen}
                  amount={amount}
                  setAmount={setAmount}
                  error={error}
                  setError={setError}
                  isInitializing={isInitializing}
                  isPaystackModalOpen={isPaystackModalOpen}
                  paystackReference={paystackReference}
                  setPaystackReference={setPaystackReference}
                  setIsPaystackModalOpen={setIsPaystackModalOpen}
                  handleInitializePayment={handleInitializePayment}
                  handlePaystackSuccess={handlePaystackSuccess}
                  handlePaystackClose={handlePaystackClose}
                  banks={banks}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                  accountNumber={accountNumber}
                  setAccountNumber={setAccountNumber}
                  accountName={accountName}
                  setAccountName={setAccountName}
                  isLoadingBanks={isLoadingBanks}
                  isVerifyingAccount={isVerifyingAccount}
                  isWithdrawing={isWithdrawing}
                  verifyAccount={verifyAccount}
                  handleWithdraw={handleWithdraw}
                  handleContinueToConfirmation={handleContinueToConfirmation}
                  recipientDetails={recipientDetails}
                  verifyDialogOpen={verifyDialogOpen}
                  setVerifyDialogOpen={setVerifyDialogOpen}
                  bankAccounts={bankAccounts}
                  selectedBankAccountId={selectedBankAccountId}
                  setSelectedBankAccountId={setSelectedBankAccountId}
                  saveNewAccount={saveNewAccount}
                  setSaveNewAccount={setSaveNewAccount}
                  useNewAccount={useNewAccount}
                  setUseNewAccount={setUseNewAccount}
                />
              </WalletBalance>

              <TransactionHistory
                transactions={transactions}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoadingTransactions={isLoadingTransactions}
                handleRefreshTransactions={handleRefreshTransactions}
                user={user}
                handlePaystackSuccess={handlePaystackSuccess}
                handlePaystackClose={handlePaystackClose}
                isMobile={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Verification Dialog */}
      <AccountVerificationDialog
        verifyDialogOpen={verifyDialogOpen}
        setVerifyDialogOpen={setVerifyDialogOpen}
        recipientDetails={recipientDetails}
        selectedBank={selectedBank}
        banks={banks}
        accountNumber={accountNumber}
        amount={amount}
        isWithdrawing={isWithdrawing}
        handleWithdraw={handleWithdraw}
        error={error}
        setError={setError}
      />
    </div>
  );
}
