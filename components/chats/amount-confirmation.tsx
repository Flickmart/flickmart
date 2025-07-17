"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SecurityHeader } from "./security-header";

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
        if (isNaN(num)) return "0.00";
        return num.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const initialAmountNum = Number.parseFloat(initialAmount);
    const difference = calculatedTotal - initialAmountNum;
    const isDifferent = Math.abs(difference) > 0.01; // Account for floating point precision

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SecurityHeader showBackButton onBack={onBack} />

            <div className="flex-1 flex flex-col justify-center p-6">
                <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Choose Transfer Amount
                        </h1>
                        <p className="text-gray-600">
                            You selected {selectedProductsCount} product{selectedProductsCount !== 1 ? 's' : ''}. 
                            Which amount would you like to transfer?
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        {/* Initial Amount Option */}
                        <Card 
                            className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-orange-200"
                            onClick={onSelectInitialAmount}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            Your Initial Amount
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            The amount you originally entered
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-900">
                                            ₦{formatAmount(initialAmount)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Total Option */}
                        <Card 
                            className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-orange-200"
                            onClick={onSelectProductTotal}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            Selected Products Total
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Total cost of {selectedProductsCount} selected product{selectedProductsCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-orange-600">
                                            ₦{formatAmount(calculatedTotal)}
                                        </div>
                                        {isDifferent && (
                                            <div className="text-xs text-gray-500">
                                                {difference > 0 ? '+' : ''}₦{formatAmount(Math.abs(difference))} difference
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Difference Notice */}
                    {isDifferent && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start">
                                <div className="text-blue-500 mr-2">ℹ️</div>
                                <div>
                                    <p className="text-sm text-blue-800 font-medium mb-1">
                                        Amount Difference Notice
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        {difference > 0 
                                            ? `The selected products cost ₦${formatAmount(Math.abs(difference))} more than your initial amount.`
                                            : `The selected products cost ₦${formatAmount(Math.abs(difference))} less than your initial amount.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            className="w-full py-4 rounded-2xl text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={onSelectInitialAmount}
                        >
                            Transfer ₦{formatAmount(initialAmount)}
                        </Button>
                        
                        <Button
                            variant="outline"
                            className="w-full py-4 rounded-2xl text-lg font-medium hover:bg-orange-50 border-orange-200"
                            onClick={onSelectProductTotal}
                        >
                            Transfer ₦{formatAmount(calculatedTotal)}
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            You can change this selection by going back to product selection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}