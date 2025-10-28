import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type AccountVerificationDialogProps = {
  verifyDialogOpen: boolean;
  setVerifyDialogOpen: (open: boolean) => void;
  recipientDetails: any;
  selectedBank: string;
  banks: any[];
  accountNumber: string;
  amount: number;
  isWithdrawing: boolean;
  handleWithdraw: () => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export default function AccountVerificationDialog({
  verifyDialogOpen,
  setVerifyDialogOpen,
  recipientDetails,
  selectedBank,
  banks,
  accountNumber,
  amount,
  isWithdrawing,
  handleWithdraw,
  error,
  setError,
}: AccountVerificationDialogProps) {
  const selectedBankName = banks.find(
    (bank) => bank.code === selectedBank
  )?.name;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
        }
        setVerifyDialogOpen(open);
      }}
      open={verifyDialogOpen}
    >
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
        <DialogHeader className="pb-4 text-center">
          <DialogTitle className="font-semibold text-lg sm:text-xl">
            Confirm Withdrawal
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Please review the details below before confirming your withdrawal
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
                <div className="mt-2 space-y-1 text-red-600 text-xs">
                  <p className="mt-1">
                    If the problem persists, contact support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {recipientDetails && (
          <div className="space-y-4 sm:space-y-6">
            {/* Details Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
                <User className="h-4 w-4" />
                Recipient Information
              </h3>

              <div className="grid gap-3 sm:gap-4">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:gap-3 sm:p-3">
                  <Banknote
                    aria-hidden="true"
                    className="h-4 w-4 flex-shrink-0 text-gray-500"
                  />
                  <div className="min-w-0 flex-1">
                    <Label className="font-medium text-gray-500 text-xs">
                      Amount
                    </Label>
                    <div className="truncate font-bold text-green-600 text-md">
                      ₦{amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:gap-3 sm:p-3">
                  <Building2 className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <Label className="font-medium text-gray-500 text-xs">
                      Bank Name
                    </Label>
                    <div className="truncate font-medium text-gray-900 text-sm">
                      {selectedBankName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:gap-3 sm:p-3">
                  <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <Label className="font-medium text-gray-500 text-xs">
                      Account Name
                    </Label>
                    <div className="truncate font-medium text-gray-900 text-sm">
                      {recipientDetails.account_name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:gap-3 sm:p-3">
                  <CreditCard className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <Label className="font-medium text-gray-500 text-xs">
                      Account Number
                    </Label>
                    <div className="font-medium font-mono text-gray-900 text-sm">
                      {accountNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800 text-sm">
                    Important
                  </h4>
                  <p className="mt-1 text-amber-700 text-xs">
                    Please ensure all details are correct. Withdrawals cannot be
                    cancelled once processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:gap-3">
          <Button
            className="w-full sm:w-auto"
            disabled={isWithdrawing}
            onClick={() => {
              setError(null);
              setVerifyDialogOpen(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            className="flex w-full items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
            disabled={isWithdrawing}
            onClick={handleWithdraw}
          >
            {isWithdrawing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Confirm Withdrawal</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
