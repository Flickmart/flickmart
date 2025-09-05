'use client';

import { format } from 'date-fns';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  RotateCcw,
  Share,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Doc } from '@/convex/_generated/dataModel';
import { TransactionStatusBadge } from './transaction-status-badge';
import { formatAmount } from './transaction-utils';

interface TransactionReceiptProps {
  transaction: Doc<'transactions'>;
  user: Doc<'users'>;
  handlePaystackSuccess: (response: { reference: string }) => Promise<void>;
  handlePaystackClose: () => void;
  onClose?: () => void;
}

export function TransactionReceipt({
  transaction,
  user,
  handlePaystackSuccess,
  handlePaystackClose,
  onClose,
}: TransactionReceiptProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const config = {
    reference: transaction.paystackReference || transaction.reference,
    amount: transaction.amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const generateReceiptImage = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;

    setIsCapturing(true);

    if (receiptRef.current) {
      receiptRef.current.style.animation = 'none';
    }

    // Small delay to let layout settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const html2canvas = (await import('html2canvas')).default;
      await document.fonts.ready;

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: window.devicePixelRatio || 2,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      if (receiptRef.current) {
        receiptRef.current.style.animation = '';
      }
      setIsCapturing(false);
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const imageBlob = await generateReceiptImage();
      if (!imageBlob) {
        toast.error('Failed to generate receipt image');
        return;
      }

      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flickmart-transaction-receipt.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Receipt downloaded');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const imageBlob = await generateReceiptImage();
      if (!imageBlob) {
        toast.error('Failed to generate receipt image');
        return;
      }

      const file = new File([imageBlob], 'transaction-receipt.png', {
        type: 'image/png',
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: 'Transaction Receipt',
          text: 'Transaction receipt from Flickmart',
          files: [file],
        });

        toast.success('Shared successfully');
      } else {
        toast.error('Sharing not supported on this device');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share receipt');
    } finally {
      setIsSharing(false);
    }
  };

  const recipient = transaction.metadata?.recipientName;
  const getTransactionDescription = () => {
    switch (transaction.type) {
      case 'funding':
        return {
          title: `${transaction.cardType?.toUpperCase() || 'Card'} Payment`,
          subtitle: 'To Flickmart Wallet',
          recipient: user.name,
        };
      case 'withdrawal':
        return {
          title: 'Wallet Withdrawal',
          subtitle: 'From Flickmart Wallet',
          recipient: 'Bank Account',
        };
      case 'transfer_in':
        return {
          title: 'Transfer Received',
          subtitle: 'To Flickmart Wallet',
          recipient: recipient ? recipient : user.name,
        };
      case 'transfer_out':
        return {
          title: 'Transfer Received',
          subtitle: 'To Flickmart Wallet',
          recipient: recipient ? recipient : user.name,
        };
      case 'ads_posting':
        return {
          title: 'Ads Payment',
          subtitle: 'To Flickmart LLC',
          recipient: 'Flickmart LLC',
        };
      default:
        return {
          title: 'Transaction',
          subtitle: 'Flickmart',
          recipient: 'Unknown',
        };
    }
  };

  const transactionInfo = getTransactionDescription();

  return (
    <div className="relative">
      {/* Close Button */}
      {onClose && (
        <Button
          className="absolute right-4 top-4 z-20 h-8 w-8 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white"
          onClick={onClose}
          variant="ghost"
        >
          <X className="h-4 w-4 text-gray-600" />
        </Button>
      )}
      
      <div
        className="relative z-10 space-y-2 bg-white px-6"
        id="capture_div"
        ref={receiptRef}
        style={isCapturing ? { width: '400px' } : {}}
      >
        {/* Compact Orange Brand Banner */}
        <div className="-mx-6 relative mb-6 bg-flickmart py-3 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Image
                alt=""
                className="h-12 w-12"
                height={500}
                src="/flickmart-logo.svg"
                width={500}
              />
              <h1 className="mt-2 font-bold text-xl">
                Flick<span className="text-white">Mart</span>
              </h1>
            </div>
            <p className="text-orange-100 text-sm">Transaction Receipt</p>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {transaction.type !== 'funding' &&
              transaction.type !== 'transfer_in' ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-200 bg-orange-100">
                  <ArrowUpRight className="h-5 w-5 text-flickmart" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-200 bg-green-100">
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                </div>
              )}
              <div>
                <p className="mb-1 font-semibold text-gray-900 text-sm">
                  {transactionInfo.title}
                </p>
                <p className="mb-1 text-gray-600 text-xs">
                  <span className="font-semibold text-flickmart">
                    {transactionInfo.subtitle}
                  </span>
                </p>
                {transaction.cardType &&
                  transaction.bank &&
                  transaction.last4 && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <span>{transaction.bank}</span>
                      <span>•</span>
                      <span>•••• {transaction.last4}</span>
                    </div>
                  )}
              </div>
            </div>
            <div className="text-right">
              <p className="mb-1 font-bold text-2xl text-gray-900">
                {formatAmount(transaction.amount / 100)}
              </p>
              <p className="font-semibold text-flickmart text-xs capitalize">
                {transaction.status}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-3 font-bold text-gray-900 text-lg">
            <div className="h-6 w-1 rounded-full bg-flickmart" />
            Transaction Details
          </h3>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">
                Transaction ID
              </span>
              <span className="rounded-lg bg-gray-50 px-3 py-1 font-mono font-semibold text-gray-900 text-sm">
                {transaction.reference || 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">
                Date & Time
              </span>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  {format(transaction._creationTime, 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-500 text-xs">
                  {format(transaction._creationTime, 'hh:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">
                Recipient
              </span>
              <div className="flex items-center gap-3">
                {transaction.type !== 'ads_posting' &&
                  transaction.type !== 'withdrawal' && (
                    <Avatar className="h-8 w-8 border-2 border-orange-200">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="bg-flickmart font-bold text-white text-xs">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                <span className="font-semibold text-gray-900 text-sm">
                  {transactionInfo.recipient}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">Status</span>
              <TransactionStatusBadge status={transaction.status} />
            </div>

            {transaction.cardType && (
              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-gray-600 text-sm">
                  Payment Method
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-8 items-center justify-center rounded-md bg-flickmart">
                    <span className="font-bold text-white text-xs">
                      {transaction.cardType[0]}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    •••• {transaction.last4}
                  </span>
                </div>
              </div>
            )}

            {transaction.bank && (
              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-gray-600 text-sm">Bank</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {transaction.bank}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">Amount</span>
              <span className="font-bold text-flickmart">
                {formatAmount(transaction.amount / 100)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="font-medium text-gray-600 text-sm">Fee</span>
              <span className="font-medium text-gray-800">$0.00</span>
            </div>

            {transaction.paystackReference && (
              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-gray-600 text-sm">
                  Reference
                </span>
                <span className="rounded-lg bg-gray-50 px-3 py-1 font-mono font-semibold text-gray-900 text-sm">
                  {transaction.paystackReference}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="space-y-1 py-3 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-flickmart" />
              <span className="font-medium text-gray-600 text-xs">
                Secure & Verified
              </span>
              <div className="h-2 w-2 rounded-full bg-flickmart" />
            </div>
            <p className="font-medium text-gray-600 text-sm">
              Thank you for choosing Flickmart
            </p>
            <p className="text-gray-500 text-xs">
              Generated on {new Date().toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">
              Customer Service: support@flickmart.app
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-gray-200 border-t bg-gray-50 p-4">
        <div className="space-y-3">
          {/* Primary Action */}
          <Button
            className="h-12 w-full rounded-xl bg-flickmart font-semibold text-white hover:bg-orange-700"
            disabled={isSharing}
            onClick={handleShare}
          >
            {isSharing ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
            ) : (
              <Share className="mr-2 h-4 w-4" />
            )}
            Share Receipt
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="h-10 rounded-xl border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50"
              disabled={isDownloading}
              onClick={handleDownload}
              variant="outline"
            >
              {isDownloading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-gray-600 border-b-2" />
              ) : (
                <>
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </>
              )}
            </Button>

            {transaction.type === 'funding' &&
            transaction.status === 'pending' ? (
              <PaystackButton
                {...config}
                email={user.email || ''}
                onClose={handlePaystackClose}
                onSuccess={handlePaystackSuccess}
              >
                <Button
                  className="h-10 w-full rounded-xl border-orange-300 bg-white font-medium text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Retry
                </Button>
              </PaystackButton>
            ) : (
              <Button
                className="h-10 rounded-xl border-orange-300 bg-white font-medium text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                disabled
                variant="outline"
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
