import {
  AlertCircle,
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  CreditCard,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type BankAccount = {
  _id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault?: boolean;
  isVerified?: boolean;
};

type EnhancedWithdrawDialogProps = {
  withdrawOpen: boolean;
  setWithdrawOpen: (open: boolean) => void;
  amount: number;
  setAmount: (amount: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
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
  bankAccounts: BankAccount[];
  selectedBankAccountId: string;
  setSelectedBankAccountId: (id: string) => void;
  saveNewAccount: boolean;
  setSaveNewAccount: (save: boolean) => void;
  useNewAccount: boolean;
  setUseNewAccount: (use: boolean) => void;
  buttonHeight: string;
  buttonTextSize: string;
  iconSize: string;
  buttonGap: string;
};

export default function WithdrawDialog({
  withdrawOpen,
  setWithdrawOpen,
  amount,
  setAmount,
  error,
  setError,
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
  buttonHeight,
  buttonTextSize,
  iconSize,
  buttonGap,
}: EnhancedWithdrawDialogProps) {
  // Auto-select default bank account when dialog opens
  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedBankAccountId && !useNewAccount) {
      const defaultAccount = bankAccounts.find((account) => account.isDefault);
      if (defaultAccount) {
        setSelectedBankAccountId(defaultAccount._id);
      } else {
        // If no default, select the first account
        setSelectedBankAccountId(bankAccounts[0]._id);
      }
    }
  }, [
    bankAccounts,
    selectedBankAccountId,
    useNewAccount,
    setSelectedBankAccountId,
  ]);

  // Convert amount to numeric value and validate it
  const numericAmount = Number(amount);
  const isValidAmount = Number.isFinite(numericAmount) && numericAmount > 0;

  const isFormValid =
    isValidAmount &&
    ((!useNewAccount && selectedBankAccountId) ||
      (useNewAccount && selectedBank && accountNumber.length === 10));

  // Handle dialog close and clear amount
  const handleDialogClose = (open: boolean) => {
    setWithdrawOpen(open);
    if (!open) {
      // Clear amount when dialog is closed
      setAmount('0');
      setError(null);
    }
  };

  return (
    <Dialog onOpenChange={handleDialogClose} open={withdrawOpen}>
      <DialogTrigger asChild>
        <Button
          className={`flex w-full ${buttonHeight} items-center ${buttonGap} rounded-full bg-orange-500 ${buttonTextSize} text-white hover:bg-orange-600`}
        >
          <ArrowUpFromLine className={iconSize} />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
        <DialogHeader className="pb-4 text-center">
          <DialogTitle className="font-semibold text-lg sm:text-xl">
            Withdraw Money
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Transfer funds from your wallet to your bank account securely
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-800 text-sm">
                    Withdrawal Error
                  </span>
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => setError(null)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 break-words text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Amount Section */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              className="font-medium text-gray-700 text-sm"
              htmlFor="withdraw-amount"
            >
              Amount to Withdraw
            </Label>
            <div className="relative">
              <span className="-translate-y-1/2 absolute top-1/2 left-3 text-gray-500">
                ₦
              </span>
              <Input
                className="pl-8 font-semibold text-base sm:text-lg"
                id="withdraw-amount"
                min="0"
                name="withdraw-amount"
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={isValidAmount ? amount.toString() : ''}
              />
            </div>
            {isValidAmount && (
              <p className="text-gray-500 text-xs">
                Available balance will be updated after successful withdrawal
              </p>
            )}
          </div>

          {/* Bank Account Selection */}
          <div className="space-y-3">
            <Label className="font-medium text-gray-700 text-sm">
              Select Withdrawal Method
            </Label>

            {bankAccounts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={!useNewAccount}
                    id="use-saved-account"
                    onCheckedChange={(checked) => {
                      setUseNewAccount(!checked);
                      if (checked && bankAccounts.length > 0) {
                        // Auto-select default or first account when switching to saved accounts
                        const defaultAccount = bankAccounts.find(
                          (account) => account.isDefault
                        );
                        if (defaultAccount) {
                          setSelectedBankAccountId(defaultAccount._id);
                        } else if (!selectedBankAccountId) {
                          setSelectedBankAccountId(bankAccounts[0]._id);
                        }
                      } else {
                        setSelectedBankAccountId('');
                      }
                      setError(null);
                    }}
                  />
                  <Label
                    className="cursor-pointer text-sm"
                    htmlFor="use-saved-account"
                  >
                    Use saved bank account
                  </Label>
                </div>

                {!useNewAccount && (
                  <div className="ml-6 space-y-2">
                    {bankAccounts.map((account) => (
                      <div
                        className={cn(
                          'flex cursor-pointer items-center space-x-2 rounded-lg border p-3 transition-colors',
                          selectedBankAccountId === account._id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        )}
                        key={account._id}
                        onClick={() => {
                          setSelectedBankAccountId(account._id);
                          setError(null);
                        }}
                      >
                        <Checkbox
                          checked={selectedBankAccountId === account._id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBankAccountId(account._id);
                            } else {
                              setSelectedBankAccountId('');
                            }
                            setError(null);
                          }}
                        />
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {account.bankName}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {account.accountName} • ****
                            {account.accountNumber.slice(-4)}
                            {account.isDefault && (
                              <span className="ml-2 font-medium text-orange-600">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        {account.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={useNewAccount}
                id="use-new-account"
                onCheckedChange={(checked) => {
                  setUseNewAccount(checked as boolean);
                  if (checked) {
                    setSelectedBankAccountId('');
                  } else if (bankAccounts.length > 0) {
                    // Auto-select default or first account when switching back to saved accounts
                    const defaultAccount = bankAccounts.find(
                      (account) => account.isDefault
                    );
                    if (defaultAccount) {
                      setSelectedBankAccountId(defaultAccount._id);
                    } else {
                      setSelectedBankAccountId(bankAccounts[0]._id);
                    }
                  }
                  setError(null);
                }}
              />
              <Plus className="h-4 w-4 text-gray-500" />
              <Label
                className="cursor-pointer text-sm"
                htmlFor="use-new-account"
              >
                Add new bank account
              </Label>
            </div>
          </div>

          {/* New Account Details - Only show when useNewAccount is true */}
          {useNewAccount && (
            <>
              {/* Bank Selection */}
              <div className="space-y-2 sm:space-y-3">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="bank-select"
                >
                  Select Bank
                </Label>
                {isLoadingBanks ? (
                  <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <RefreshCw className="h-4 w-4 animate-spin text-orange-500 sm:h-5 sm:w-5" />
                    <span className="ml-2 text-gray-600 text-sm sm:ml-3">
                      Loading banks...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Building2 className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                    <select
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white pr-4 pl-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:h-12"
                      id="bank-select"
                      onChange={(e) => {
                        setSelectedBank(e.target.value);
                        setError(null);
                      }}
                      value={selectedBank}
                    >
                      <option value="">Choose your bank</option>
                      {banks.map((bank) => (
                        <option key={bank.code + bank.name} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2 sm:space-y-3">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="account-number"
                >
                  Account Number
                </Label>
                <div className="relative">
                  <CreditCard className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    id="account-number"
                    maxLength={10}
                    name="account-number"
                    onChange={(e) => {
                      setAccountNumber(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    placeholder="Enter 10-digit account number"
                    type="text"
                    value={accountNumber}
                  />
                </div>
                {accountNumber.length > 0 && accountNumber.length < 10 && (
                  <p className="text-orange-600 text-xs">
                    Account number must be 10 digits
                  </p>
                )}
                {accountNumber.length === 10 && (
                  <p className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid account number format
                  </p>
                )}
              </div>

              {/* Account Name Display */}
              {accountName && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 text-sm">
                      Account Verified
                    </span>
                  </div>
                  <p className="mt-1 text-green-700 text-sm">
                    Account Name:{' '}
                    <span className="font-semibold">{accountName}</span>
                  </p>
                </div>
              )}

              {/* Save Account Option */}
              {accountName && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={saveNewAccount}
                    id="save-account"
                    onCheckedChange={(checked) =>
                      setSaveNewAccount(checked as boolean)
                    }
                  />
                  <Label
                    className="cursor-pointer text-gray-700 text-sm"
                    htmlFor="save-account"
                  >
                    Save this account for future withdrawals
                  </Label>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:gap-3">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          {useNewAccount ? (
            <Button
              className={cn(
                'flex w-full items-center justify-center gap-2 sm:w-auto',
                isFormValid
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              )}
              disabled={!isFormValid || isVerifyingAccount}
              onClick={
                accountName ? handleContinueToConfirmation : verifyAccount
              }
            >
              {isVerifyingAccount ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Verifying...</span>
                </>
              ) : accountName ? (
                <>
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span className="text-sm">Continue</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Verify Account</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              className={cn(
                'flex w-full items-center justify-center gap-2 sm:w-auto',
                isFormValid
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              )}
              disabled={!isFormValid || isWithdrawing}
              onClick={handleWithdraw}
            >
              {isWithdrawing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span className="text-sm">Withdraw Now</span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
