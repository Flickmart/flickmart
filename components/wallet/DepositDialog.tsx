import {
  AlertCircle,
  ArrowDownToLine,
  Banknote,
  RefreshCw,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
import type { Doc } from '@/convex/_generated/dataModel';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  {
    ssr: false,
    loading: () => (
      <Button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        disabled
      >
        Loading payment...
      </Button>
    ),
  }
);

type PaystackConfig = {
  email: string;
  amount: number;
  publicKey: string;
  reference: string;
};

type DepositDialogProps = {
  user: Doc<'users'>;
  open: boolean;
  setOpen: (open: boolean) => void;
  amount: number;
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
  buttonHeight: string;
  buttonTextSize: string;
  iconSize: string;
  buttonGap: string;
};

export default function DepositDialog({
  user,
  open,
  setOpen,
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
  buttonHeight,
  buttonTextSize,
  iconSize,
  buttonGap,
}: DepositDialogProps) {
  // Ensure the Paystack public key is set
  if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
    console.error('Paystack public key is not configured');
    // TODO: Show a user-friendly error message here
    return null;
  }

  // Ensure we have an email for the current user
  if (!user?.email) {
    console.error('User email is required for payment processing');
    toast.error('User email is required for payment processing');
    return null;
  }

  const MAX_AMOUNT = 10_000_000; // 10 million Naira
  const roundedAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places

  const paystackConfig: PaystackConfig = {
    email: user.email,
    amount: Math.min(roundedAmount * 100, MAX_AMOUNT * 100), // Convert to kobo with max limit
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    reference: paystackReference,
  };
  const isFormValid = amount > 0;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <form>
        <DialogTrigger asChild>
          <Button
            className={`flex w-full ${buttonHeight} items-center ${buttonGap} rounded-full bg-orange-500 ${buttonTextSize} text-white hover:bg-orange-600`}
          >
            <ArrowDownToLine className={iconSize} />
            Deposit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
          <DialogHeader className="pb-4 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 sm:h-12 sm:w-12">
              <Banknote className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
            </div>
            <DialogTitle className="font-semibold text-lg sm:text-xl">
              Deposit Money
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Deposit money into your wallet using a bank transfer or card
              payment.
            </DialogDescription>
          </DialogHeader>

          {/* Error Display - Prominent placement right after header */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-800 text-sm">
                      Payment Error
                    </span>
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => setError(null)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 break-words text-red-700 text-sm">
                    {error}
                  </p>
                  <p className="mt-2 text-red-600 text-xs">
                    Please check your payment details and try again. If the
                    problem persists, contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            {/* Amount Section */}
            <div className="space-y-2 sm:space-y-3">
              <Label
                className="font-medium text-gray-700 text-sm"
                htmlFor="deposit-amount"
              >
                Amount to Deposit
              </Label>
              <div className="relative">
                <span className="-translate-y-1/2 absolute top-1/2 left-3 text-gray-500">
                  ₦
                </span>
                <Input
                  className="pl-8 font-semibold text-base sm:text-lg"
                  id="deposit-amount"
                  min="0"
                  name="deposit-amount"
                  onChange={(e) => {
                    const parsedValue = Number.parseFloat(e.target.value);

                    if (!Number.isFinite(parsedValue)) {
                      setError('Please enter a valid amount');
                      return;
                    }

                    const clampedValue = Math.max(0, parsedValue);
                    setAmount(String(clampedValue));
                    setError(null);
                  }}
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                />
              </div>
              {amount > 0 && (
                <p className="text-gray-500 text-xs">
                  You'll be redirected to a secure payment gateway to complete
                  your deposit
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:gap-3">
            {paystackReference ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full sm:w-auto" variant="outline">
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Payment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this payment? Your payment
                      initialization will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, continue payment</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setPaystackReference('');
                        setIsPaystackModalOpen(false);
                        setOpen(false);
                      }}
                    >
                      Yes, cancel payment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DialogClose asChild>
                <Button className="w-full sm:w-auto" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            )}

            {paystackReference && isPaystackModalOpen ? (
              <PaystackButton
                {...paystackConfig}
                className="w-full sm:w-auto"
                onClose={handlePaystackClose}
                onSuccess={handlePaystackSuccess}
              >
                <Button
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <span className="text-sm">Complete Payment</span>
                </Button>
              </PaystackButton>
            ) : (
              <Button
                className={`flex w-full items-center justify-center gap-2 sm:w-auto ${
                  isFormValid
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                }`}
                disabled={!isFormValid || isInitializing}
                onClick={handleInitializePayment}
              >
                {isInitializing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Initializing...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="h-4 w-4" />
                    <span className="text-sm">Deposit</span>
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
