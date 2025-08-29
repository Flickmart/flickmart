'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecurityHeader } from './security-header';

interface TransferCompleteProps {
  displayAmount: string;
  selectedProductsCount: number;
  calculatedTotal: number;
  onBack: () => void;
  orderId?: string;
}

export function TransferComplete({
  displayAmount,
  selectedProductsCount,
  calculatedTotal,
  onBack,
  orderId,
}: TransferCompleteProps) {
  const formatAmount = (value: string | number) => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SecurityHeader onBack={onBack} showBackButton />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          {/* Animated success icon with orange to green transition */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            {/* Background circle with scale animation */}
            <div className="absolute inset-0 h-24 w-24 animate-ping rounded-full bg-gradient-to-br from-green-100 to-green-50 opacity-75" />
            <div
              className="relative flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
              style={{ animationDuration: '1s', animationIterationCount: '2' }}
            >
              {/* Animated checkmark */}
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeDasharray="24"
                  strokeDashoffset="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  style={{
                    animation: 'checkmark-draw 0.8s ease-in-out 0.5s forwards',
                  }}
                />
              </svg>
            </div>

            {/* Success particles */}
            <div
              className="-top-2 -right-2 absolute h-3 w-3 animate-ping rounded-full bg-orange-400"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="-bottom-2 -left-2 absolute h-2 w-2 animate-ping rounded-full bg-green-400"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-0 left-0 h-2 w-2 animate-ping rounded-full bg-orange-300"
              style={{ animationDelay: '1.5s' }}
            />
          </div>

          <h1 className="mb-2 font-semibold text-2xl text-gray-900">
            Transfer Successful!
          </h1>

          <p className="mb-8 text-gray-600">
            Your payment has been processed successfully
          </p>

          {/* Transfer Details */}
          <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left">
            <h3 className="mb-4 text-center font-medium text-gray-900">
              Transfer Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount Transferred:</span>
                <span className="font-semibold text-lg">₦{displayAmount}</span>
              </div>

              {selectedProductsCount > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Products Selected:</span>
                    <span className="font-medium">{selectedProductsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Product Total:</span>
                    <span className="font-medium">
                      ₦{formatAmount(calculatedTotal)}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between border-gray-200 border-t pt-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600"
            onClick={onBack}
          >
            Make Another Transfer
          </Button>
          {orderId && (
            <div className="mt-4">
              <Link href={`/orders/${orderId}`}>
                <Button
                  className="w-full rounded-lg py-3 font-medium"
                  variant="outline"
                  type="button"
                >
                  Check now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
