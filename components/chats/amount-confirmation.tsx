'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SecurityHeader } from './security-header';

interface AmountConfirmationProps {
  initialAmount: string;
  selectedProductsCount: number;
  calculatedTotal: number;
  onBack: () => void;
  onSelectInitialAmount: () => void;
  onSelectProductTotal: () => void;
}

export function AmountConfirmation({
  initialAmount,
  selectedProductsCount,
  calculatedTotal,
  onBack,
  onSelectInitialAmount,
  onSelectProductTotal,
}: AmountConfirmationProps) {
  const formatAmount = (value: string | number) => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const initialAmountNum = Number.parseFloat(initialAmount);
  const difference = calculatedTotal - initialAmountNum;
  const isDifferent = Math.abs(difference) > 0.01; // Account for floating point precision

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SecurityHeader onBack={onBack} showBackButton />

      <div className="flex flex-1 flex-col justify-center p-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-semibold text-2xl text-gray-900">
              Choose Transfer Amount
            </h1>
            <p className="text-gray-600">
              You selected {selectedProductsCount} product
              {selectedProductsCount !== 1 ? 's' : ''}. Which amount would you
              like to transfer?
            </p>
          </div>

          <div className="mb-6 space-y-4">
            {/* Initial Amount Option */}
            <Card
              className="cursor-pointer border-2 transition-all duration-200 hover:border-orange-200 hover:shadow-md"
              onClick={onSelectInitialAmount}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-gray-900">
                      Your Initial Amount
                    </h3>
                    <p className="text-gray-600 text-sm">
                      The amount you originally entered
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-xl">
                      ₦{formatAmount(initialAmount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Total Option */}
            <Card
              className="cursor-pointer border-2 transition-all duration-200 hover:border-orange-200 hover:shadow-md"
              onClick={onSelectProductTotal}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-gray-900">
                      Selected Products Total
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Total cost of {selectedProductsCount} selected product
                      {selectedProductsCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600 text-xl">
                      ₦{formatAmount(calculatedTotal)}
                    </div>
                    {isDifferent && (
                      <div className="text-gray-500 text-xs">
                        {difference > 0 ? '+' : ''}₦
                        {formatAmount(Math.abs(difference))} difference
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Difference Notice */}
          {isDifferent && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start">
                <div className="mr-2 text-blue-500">ℹ️</div>
                <div>
                  <p className="mb-1 font-medium text-blue-800 text-sm">
                    Amount Difference Notice
                  </p>
                  <p className="text-blue-700 text-sm">
                    {difference > 0
                      ? `The selected products cost ₦${formatAmount(Math.abs(difference))} more than your initial amount.`
                      : `The selected products cost ₦${formatAmount(Math.abs(difference))} less than your initial amount.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full rounded-2xl bg-orange-500 py-4 font-medium text-lg text-white hover:bg-orange-600"
              onClick={onSelectInitialAmount}
            >
              Transfer ₦{formatAmount(initialAmount)}
            </Button>

            <Button
              className="w-full rounded-2xl border-orange-200 py-4 font-medium text-lg hover:bg-orange-50"
              onClick={onSelectProductTotal}
              variant="outline"
            >
              Transfer ₦{formatAmount(calculatedTotal)}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              You can change this selection by going back to product selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
