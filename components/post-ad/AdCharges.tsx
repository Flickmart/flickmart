'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface AdChargesProps {
  plan: 'free' | 'basic' | 'pro' | 'premium';
  isPending: boolean;
  formTrigger: () => Promise<boolean>;
  formSubmit: () => Promise<void>;
  images: Array<string>;
  adId: Id<'product'> | undefined;
  basicDuration: number;
}

export default function AdCharges({
  plan,
  isPending,
  formTrigger,
  formSubmit,
  images,
  adId,
  basicDuration,
}: AdChargesProps) {
  const PLAN_PRICES = {
    basic: basicDuration === 7 ? 300 : 200,
    pro: 1000,
    premium: 5000,
    free: 0,
  };
  const [showChargeDialog, setShowChargeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  const wallet = useQuery(
    api.wallet.getWalletByUserId,
    user ? { userId: user._id } : 'skip'
  );
  const updateMetadata = useMutation(api.transactions.updateMetadata);

  const balance = wallet?.balance ? wallet?.balance / 100 : 0;
  const chargeAmount = PLAN_PRICES[plan];

  const handlePostAdClick = async () => {
    if (!images.length) {
      toast.error('Please add at least one image');
      return;
    }
    // First validate the form
    const isValid = await formTrigger();
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Only show the charge dialog, do not submit the form here
    setShowChargeDialog(true);
  };

  const handleCharge = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to post an ad');
      return;
    }
    if (!wallet) {
      toast.error('Please create a wallet first');
      return;
    }

    if (balance < chargeAmount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    try {
      setIsProcessing(true);
      const token = await getToken({ template: 'convex' });
      if (!token) {
        toast.error('Authentication failed');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/charge-ad`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: chargeAmount,
            plan,
            userId: user?._id,
            walletId: wallet._id,
          }),
        }
      );

      const data = await response.json();
      console.log('Charge response:', data, data.data.transactionId);
      if (data.status) {
        toast.success('Payment successful! Posting your ad...');
        // Only submit the form after successful payment
        await formSubmit();

        setTimeout(() => {
          updateMetadata({
            transactionId: data.data.transactionId,
            metadata: {
              adId,
              plan,
            },
          });
        }, 4000);
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (error) {
      toast.error('Error processing payment');
    } finally {
      setIsProcessing(false);
      setShowChargeDialog(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Ad Posting Fee ({plan} plan)</span>
          <span className="font-semibold">
            ₦{chargeAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Your Wallet Balance</span>
          <span className="font-semibold">₦{balance.toLocaleString()}</span>
        </div>
        <Button
          className="w-full bg-flickmart py-7 text-xl transition-all duration-300 hover:scale-110 lg:rounded-none lg:py-9"
          disabled={isPending || isProcessing}
          onClick={handlePostAdClick}
          type="button"
        >
          {isPending || isProcessing ? (
            <ClipLoader color="#ffffff" />
          ) : (
            'Post Ad'
          )}
        </Button>
      </div>

      <Dialog onOpenChange={setShowChargeDialog} open={showChargeDialog}>
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
              disabled={isProcessing}
              onClick={() => setShowChargeDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="bg-flickmart"
              disabled={isProcessing}
              onClick={handleCharge}
            >
              {isProcessing ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                'Confirm & Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
