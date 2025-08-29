import {
  ArrowDownToLine,
  RefreshCw,
  Banknote,
  AlertCircle,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
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
import { type Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
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

interface PaystackConfig {
  email: string;
  amount: number;
  publicKey: string;
  reference: string;
}

interface DepositDialogProps {
  user: Doc<"users">;
  open: boolean;
  setOpen: (open: boolean) => void;
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
  buttonHeight: string;
  buttonTextSize: string;
  iconSize: string;
  buttonGap: string;
}

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
    console.error("Paystack public key is not configured");
    // TODO: Show a user-friendly error message here
    return null;
  }

  // Ensure we have an email for the current user
  if (!user?.email) {
    console.error("User email is required for payment processing");
    toast.error("User email is required for payment processing");
    return null;
  }

    const MAX_AMOUNT = 10000000; // 10 million Naira
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
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 sm:h-12 sm:w-12">
              <Banknote className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
            </div>
            <DialogTitle className="text-lg font-semibold sm:text-xl">
              Deposit Money
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Deposit money into your wallet using a bank transfer or card
              payment.
            </DialogDescription>
          </DialogHeader>

          {/* Error Display - Prominent placement right after header */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800">
                      Payment Error
                    </span>
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
                  <p className="mt-2 text-xs text-red-600">
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
                htmlFor="deposit-amount"
                className="text-sm font-medium text-gray-700"
              >
                Amount to Deposit
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <Input
                  id="deposit-amount"
                  name="deposit-amount"
                  className="pl-8 text-base font-semibold sm:text-lg"
                  placeholder="0.00"
                  onChange={(e) => {
                    const parsedValue = parseFloat(e.target.value);
                    
                    if (!isFinite(parsedValue)) {
                      setError("Please enter a valid amount");
                      return;
                    }
                    
                    const clampedValue = Math.max(0, parsedValue);
                    setAmount(clampedValue);
                    setError(null);
                  }}
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              {amount > 0 && (
                <p className="text-xs text-gray-500">
                  You'll be redirected to a secure payment gateway to complete
                  your deposit
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-3 pt-4">
            {paystackReference ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
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
                        setPaystackReference("");
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
                <Button variant="outline" className="w-full sm:w-auto">
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
                className={`flex items-center justify-center gap-2 w-full sm:w-auto ${
                  isFormValid
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
