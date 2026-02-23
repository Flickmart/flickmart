import type { Doc } from 'backend/convex/_generated/dataModel';
import DepositDialog from './DepositDialog';
import WithdrawDialog from './WithdrawDialog';

type WalletActionsProps = {
  user: Doc<'users'>;
  isMobile?: boolean;
  open: boolean;
  withdrawOpen: boolean;
  setOpen: (open: boolean) => void;
  setWithdrawOpen: (open: boolean) => void;
  amount: number | string;
  setAmount: (amount: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isInitializing: boolean;
  isPaystackModalOpen: boolean;
  paystackReference: string;
  setPaystackReference: (reference: string) => void;
  setIsPaystackModalOpen: (open: boolean) => void;
  handleInitializePayment: () => void;
  handlePaystackSuccess: (response: { reference: string }) => void;
  handlePaystackClose: () => void;
  banks: any[];
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  accountNumber: string;
  setAccountNumber: (number: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  isLoadingBanks: boolean;
  isVerifyingAccount: boolean;
  isWithdrawing: boolean;
  verifyAccount: () => void;
  handleWithdraw: () => void;
  handleContinueToConfirmation: () => void;
  recipientDetails: any;
  verifyDialogOpen: boolean;
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

export default function WalletActions({
  user,
  isMobile = false,
  open,
  withdrawOpen,
  setOpen,
  setWithdrawOpen,
  amount,
  setAmount,
  error,
  setError,
  isInitializing,
  isPaystackModalOpen,
  paystackReference,
  setPaystackReference,
  setIsPaystackModalOpen,
  handleInitializePayment,
  handlePaystackSuccess,
  handlePaystackClose,
  banks,
  selectedBank,
  setSelectedBank,
  accountNumber,
  setAccountNumber,
  accountName,
  setAccountName,
  isLoadingBanks,
  isVerifyingAccount,
  isWithdrawing,
  verifyAccount,
  handleWithdraw,
  handleContinueToConfirmation,
  recipientDetails,
  verifyDialogOpen,
  setVerifyDialogOpen,
  bankAccounts,
  selectedBankAccountId,
  setSelectedBankAccountId,
  saveNewAccount,
  setSaveNewAccount,
  useNewAccount,
  setUseNewAccount,
}: WalletActionsProps) {
  const buttonHeight = isMobile ? 'h-12' : 'h-16';
  const buttonTextSize = isMobile ? 'text-base' : 'text-lg';
  const iconSize = isMobile ? 'h-5 w-5' : 'h-6 w-6';
  const buttonGap = isMobile ? 'gap-2' : 'gap-3';

  return (
    <div className="grid grid-cols-2 gap-4">
      <DepositDialog
        amount={Number(amount)}
        buttonGap={buttonGap}
        buttonHeight={buttonHeight}
        buttonTextSize={buttonTextSize}
        error={error}
        handleInitializePayment={handleInitializePayment}
        handlePaystackClose={handlePaystackClose}
        handlePaystackSuccess={handlePaystackSuccess}
        iconSize={iconSize}
        isInitializing={isInitializing}
        isPaystackModalOpen={isPaystackModalOpen}
        open={open}
        paystackReference={paystackReference}
        setAmount={setAmount}
        setError={setError}
        setIsPaystackModalOpen={setIsPaystackModalOpen}
        setOpen={setOpen}
        setPaystackReference={setPaystackReference}
        user={user}
      />

      <WithdrawDialog
        accountName={accountName}
        accountNumber={accountNumber}
        amount={Number(amount)}
        bankAccounts={bankAccounts}
        banks={banks}
        buttonGap={buttonGap}
        buttonHeight={buttonHeight}
        buttonTextSize={buttonTextSize}
        error={error}
        handleContinueToConfirmation={handleContinueToConfirmation}
        handleWithdraw={handleWithdraw}
        iconSize={iconSize}
        isLoadingBanks={isLoadingBanks}
        isVerifyingAccount={isVerifyingAccount}
        isWithdrawing={isWithdrawing}
        recipientDetails={recipientDetails}
        saveNewAccount={saveNewAccount}
        selectedBank={selectedBank}
        selectedBankAccountId={selectedBankAccountId}
        setAccountName={setAccountName}
        setAccountNumber={setAccountNumber}
        setAmount={setAmount}
        setError={setError}
        setSaveNewAccount={setSaveNewAccount}
        setSelectedBank={setSelectedBank}
        setSelectedBankAccountId={setSelectedBankAccountId}
        setUseNewAccount={setUseNewAccount}
        setVerifyDialogOpen={setVerifyDialogOpen}
        setWithdrawOpen={setWithdrawOpen}
        useNewAccount={useNewAccount}
        verifyAccount={verifyAccount}
        verifyDialogOpen={verifyDialogOpen}
        withdrawOpen={withdrawOpen}
      />
    </div>
  );
}
