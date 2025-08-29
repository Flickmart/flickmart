import { type Doc } from '@/convex/_generated/dataModel';
import DepositDialog from './DepositDialog';
import WithdrawDialog from './WithdrawDialog';

interface WalletActionsProps {
  user: Doc<'users'>;
  isMobile?: boolean;
  open: boolean;
  withdrawOpen: boolean;
  setOpen: (open: boolean) => void;
  setWithdrawOpen: (open: boolean) => void;
  amount: number;
  setAmount: (amount: number) => void;
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
  recipientDetails: any;
  verifyDialogOpen: boolean;
  setVerifyDialogOpen: (open: boolean) => void;
}

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
  recipientDetails,
  verifyDialogOpen,
  setVerifyDialogOpen,
}: WalletActionsProps) {
  const buttonHeight = isMobile ? 'h-12' : 'h-16';
  const buttonTextSize = isMobile ? 'text-base' : 'text-lg';
  const iconSize = isMobile ? 'h-5 w-5' : 'h-6 w-6';
  const buttonGap = isMobile ? 'gap-2' : 'gap-3';

  return (
    <div className="grid grid-cols-2 gap-4">
      <DepositDialog
        user={user}
        open={open}
        setOpen={setOpen}
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
        buttonHeight={buttonHeight}
        buttonTextSize={buttonTextSize}
        iconSize={iconSize}
        buttonGap={buttonGap}
      />

      <WithdrawDialog
        user={user}
        withdrawOpen={withdrawOpen}
        setWithdrawOpen={setWithdrawOpen}
        amount={amount}
        setAmount={setAmount}
        error={error}
        setError={setError}
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
        recipientDetails={recipientDetails}
        verifyDialogOpen={verifyDialogOpen}
        setVerifyDialogOpen={setVerifyDialogOpen}
        buttonHeight={buttonHeight}
        buttonTextSize={buttonTextSize}
        iconSize={iconSize}
        buttonGap={buttonGap}
      />
    </div>
  );
}
