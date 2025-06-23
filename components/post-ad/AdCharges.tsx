"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ClipLoader } from "react-spinners";
import { Id } from "@/convex/_generated/dataModel";

interface AdChargesProps {
  plan: "basic" | "pro" | "premium";
  isPending: boolean;
  formTrigger: () => Promise<boolean>;
  formSubmit: () => Promise<void>;
  allowAdPost: boolean;
  adId: Id<"product"> | undefined;
}

const PLAN_PRICES = {
  basic: 20,
  pro: 100,
  premium: 50,
};

export default function AdCharges({
  plan,
  isPending,
  formTrigger,
  formSubmit,
  allowAdPost,
  adId,
}: AdChargesProps) {
  const [showChargeDialog, setShowChargeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();

  const user = useQuery(api.users.current);
  const wallet = useQuery(
    api.wallet.getWalletByUserId,
    user ? { userId: user._id } : "skip"
  );
  const updateMetadata = useMutation(api.transactions.updateMetadata);

  const balance = wallet?.balance ? wallet?.balance / 100 : 0;
  const chargeAmount = PLAN_PRICES[plan];

  const handlePostAdClick = async () => {
    // First validate the form
    const isValid = await formTrigger();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!allowAdPost) {
      toast.error("Please add at least one image");
      return;
    }

    // Only show the charge dialog, do not submit the form here
    setShowChargeDialog(true);
  };

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
      console.log("Charge response:", data, data.data.transactionId);
      if (data.status) {
        toast.success("Payment successful! Posting your ad...");
        // Only submit the form after successful payment
        await formSubmit();

        setTimeout(() => {
          updateMetadata({
            transactionId: data.data.transactionId,
            metadata: {
              adId: adId,
              plan: plan
            },
          });
        }, 4000);
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
          <span className="font-semibold">
            ₦{chargeAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Your Wallet Balance</span>
          <span className="font-semibold">₦{balance.toLocaleString()}</span>
        </div>
        <Button
          onClick={handlePostAdClick}
          className="w-full py-7 lg:py-9 lg:rounded-none text-xl bg-flickmart"
          disabled={isPending || isProcessing}
          type="button"
        >
          {isPending || isProcessing ? (
            <ClipLoader color="#ffffff" />
          ) : (
            "Post Ad"
          )}
        </Button>
      </div>

      <Dialog open={showChargeDialog} onOpenChange={setShowChargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ad Posting</DialogTitle>
            <DialogDescription>
              You are about to post an ad with {plan} plan. ₦{chargeAmount} will
              be deducted from your wallet.
            </DialogDescription>
          </DialogHeader>
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
              className="bg-flickmart"
            >
              {isProcessing ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Confirm & Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
