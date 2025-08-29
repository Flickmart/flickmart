import {
  RefreshCw,
  Building2,
  User,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Banknote,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AccountVerificationDialogProps {
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
}

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
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            Confirm Withdrawal
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Please review the details below before confirming your withdrawal
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4 mb-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Withdrawal Error</span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-red-700 break-words">
                  {error}
                </p>
                <div className="mt-2 text-xs text-red-600 space-y-1">
                  <p className="mt-1">If the problem persists, contact support.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {recipientDetails && (
          <div className="space-y-4 sm:space-y-6">
            {/* Details Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4" />
                Recipient Information
              </h3>

              <div className="grid gap-3 sm:gap-4">
                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 sm:gap-3 sm:p-3">
                  <Banknote
                    className="h-4 w-4 text-gray-500 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-medium text-gray-500">
                      Amount
                    </Label>
                    <div className="text-md font-bold text-green-600 truncate">
                      ₦{amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 sm:gap-3 sm:p-3">
                  <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-medium text-gray-500">
                      Bank Name
                    </Label>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {selectedBankName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 sm:gap-3 sm:p-3">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-medium text-gray-500">
                      Account Name
                    </Label>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {recipientDetails.account_name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 sm:gap-3 sm:p-3">
                  <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-medium text-gray-500">
                      Account Number
                    </Label>
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {accountNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Important
                  </h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Please ensure all details are correct. Withdrawals cannot be
                    cancelled once processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-3 pt-4">
          <Button
            onClick={() => {
              setError(null);
              setVerifyDialogOpen(false);
            }}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isWithdrawing}
          >
            Cancel
          </Button>

          <Button
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600"
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
