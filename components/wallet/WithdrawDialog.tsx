import React, { useEffect } from "react";
import {
  ArrowUpFromLine,
  RefreshCw,
  Building2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface BankAccount {
  _id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault?: boolean;
  isVerified?: boolean;
}

interface EnhancedWithdrawDialogProps {
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
}

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
      setAmount("0");
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
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            Withdraw Money
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Transfer funds from your wallet to your bank account securely
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4 mb-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">
                    Withdrawal Error
                  </span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-red-700 break-words">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Amount Section */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="withdraw-amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount to Withdraw
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <Input
                id="withdraw-amount"
                name="withdraw-amount"
                className="pl-8 text-base font-semibold sm:text-lg"
                placeholder="0.00"
                value={isValidAmount ? amount.toString() : ""}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            {isValidAmount && (
              <p className="text-xs text-gray-500">
                Available balance will be updated after successful withdrawal
              </p>
            )}
          </div>

          {/* Bank Account Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select Withdrawal Method
            </Label>

            {bankAccounts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-saved-account"
                    checked={!useNewAccount}
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
                        setSelectedBankAccountId("");
                      }
                      setError(null);
                    }}
                  />
                  <Label
                    htmlFor="use-saved-account"
                    className="text-sm cursor-pointer"
                  >
                    Use saved bank account
                  </Label>
                </div>

                {!useNewAccount && (
                  <div className="ml-6 space-y-2">
                    {bankAccounts.map((account) => (
                      <div
                        key={account._id}
                        className={cn(
                          "flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-colors",
                          selectedBankAccountId === account._id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
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
                              setSelectedBankAccountId("");
                            }
                            setError(null);
                          }}
                        />
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {account.bankName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {account.accountName} • ****
                            {account.accountNumber.slice(-4)}
                            {account.isDefault && (
                              <span className="ml-2 text-orange-600 font-medium">
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
                id="use-new-account"
                checked={useNewAccount}
                onCheckedChange={(checked) => {
                  setUseNewAccount(checked as boolean);
                  if (checked) {
                    setSelectedBankAccountId("");
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
                htmlFor="use-new-account"
                className="text-sm cursor-pointer"
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
                  htmlFor="bank-select"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Bank
                </Label>
                {isLoadingBanks ? (
                  <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <RefreshCw className="h-4 w-4 animate-spin text-orange-500 sm:h-5 sm:w-5" />
                    <span className="ml-2 text-sm text-gray-600 sm:ml-3">
                      Loading banks...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:h-12"
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
                  htmlFor="account-number"
                  className="text-sm font-medium text-gray-700"
                >
                  Account Number
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="account-number"
                    maxLength={10}
                    name="account-number"
                    className="pl-10"
                    placeholder="Enter 10-digit account number"
                    onChange={(e) => {
                      setAccountNumber(e.target.value.replace(/\D/g, ""));
                      setError(null);
                    }}
                    type="text"
                    value={accountNumber}
                  />
                </div>
                {accountNumber.length > 0 && accountNumber.length < 10 && (
                  <p className="text-xs text-orange-600">
                    Account number must be 10 digits
                  </p>
                )}
                {accountNumber.length === 10 && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid account number format
                  </p>
                )}
              </div>

              {/* Account Name Display */}
              {accountName && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Account Verified
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    Account Name:{" "}
                    <span className="font-semibold">{accountName}</span>
                  </p>
                </div>
              )}

              {/* Save Account Option */}
              {accountName && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-account"
                    checked={saveNewAccount}
                    onCheckedChange={(checked) =>
                      setSaveNewAccount(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="save-account"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Save this account for future withdrawals
                  </Label>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-3 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>

          {useNewAccount ? (
            <Button
              className={cn(
                "flex items-center justify-center gap-2 w-full sm:w-auto",
                isFormValid
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                "flex items-center justify-center gap-2 w-full sm:w-auto",
                isFormValid
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
