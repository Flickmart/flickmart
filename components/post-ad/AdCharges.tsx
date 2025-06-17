"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { ClipLoader } from "react-spinners";

interface AdChargesProps {
  plan: "basic" | "pro" | "premium";
  onConfirm: () => void;
  isPending: boolean;
}

const PLAN_PRICES = {
  basic: 100, // ₦100
  pro: 250,   // ₦250
  premium: 500 // ₦500
};

export default function AdCharges({ plan, onConfirm, isPending }: AdChargesProps) {
  const [showChargeDialog, setShowChargeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();
  
  const user = useQuery(api.users.current);
  const wallet = useQuery(
    api.wallet.getWalletByUserId,
    user ? { userId: user._id } : "skip"
  );

  const balance = wallet?.balance ? wallet?.balance / 100 : 0;
  const chargeAmount = PLAN_PRICES[plan];

  const handleCharge = async () => {
    if (!user || !wallet) {
      toast.error("Please log in to post an ad");
      return;
    }

    if (balance < chargeAmount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    try {
      setIsProcessing(true);
      const token = await getToken({ template: "convex" });
      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/charge-ad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: chargeAmount,
            plan,
            userId: user._id,
            walletId: wallet._id,
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        toast.success("Payment successful!");
        onConfirm();
      } else {
        toast.error(data.message || "Payment failed");
      }
    } catch (error) {
      toast.error("Error processing payment");
    } finally {
      setIsProcessing(false);
      setShowChargeDialog(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ad Posting Fee ({plan} plan)</span>
          <span className="font-semibold">₦{chargeAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Your Wallet Balance</span>
          <span className="font-semibold">₦{balance.toLocaleString()}</span>
        </div>
        <Button
          onClick={() => setShowChargeDialog(true)}
          disabled={isPending || balance < chargeAmount}
          className="w-full bg-flickmart text-white py-3 rounded-xl"
        >
          {isPending ? <ClipLoader color="#ffffff" /> : "Post Ad"}
        </Button>
      </div>

      <Dialog open={showChargeDialog} onOpenChange={setShowChargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ad Posting</DialogTitle>
            <DialogDescription>
              You will be charged ₦{chargeAmount.toLocaleString()} from your wallet for posting this ad with the {plan} plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-semibold capitalize">{plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">₦{chargeAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance After:</span>
              <span className="font-semibold">₦{(balance - chargeAmount).toLocaleString()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChargeDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCharge}
              disabled={isProcessing}
              className="bg-flickmart text-white"
            >
              {isProcessing ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Confirm & Pay"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 