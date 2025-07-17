"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { SecurityHeader } from "./security-header";

interface TransferCompleteProps {
  displayAmount: string;
  selectedProductsCount: number;
  calculatedTotal: number;
  onBack: () => void;
}

export function TransferComplete({
  displayAmount,
  selectedProductsCount,
  calculatedTotal,
  onBack,
}: TransferCompleteProps) {
  const formatAmount = (value: string | number) => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SecurityHeader showBackButton onBack={onBack} />

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          {/* Animated success icon with orange to green transition */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Background circle with scale animation */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '1s', animationIterationCount: '2' }}>
              {/* Animated checkmark */}
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  strokeDasharray="24"
                  strokeDashoffset="24"
                  style={{
                    animation: 'checkmark-draw 0.8s ease-in-out 0.5s forwards'
                  }}
                />
              </svg>
            </div>
            
            {/* Success particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-0 left-0 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Transfer Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your payment has been processed successfully
          </p>

          {/* Transfer Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-medium text-gray-900 mb-4 text-center">Transfer Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Transferred:</span>
                <span className="font-semibold text-lg">₦{displayAmount}</span>
              </div>
              
              {selectedProductsCount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products Selected:</span>
                    <span className="font-medium">{selectedProductsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Product Total:</span>
                    <span className="font-medium">₦{formatAmount(calculatedTotal)}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg"
            onClick={onBack}
          >
            Make Another Transfer
          </Button>
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