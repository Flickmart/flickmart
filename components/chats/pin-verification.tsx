"use client";

import { SecurityHeader } from "./security-header";
import { PinInput } from "./pin-input";

interface SecurityState {
    pinAttempts: number;
    maxPinAttempts: number;
    isLocked: boolean;
    lockoutTime?: number;
}

interface PinVerificationProps {
    displayAmount: string;
    selectedProductsCount: number;
    calculatedTotal: number;
    pin: string;
    isPinError: boolean;
    errorMessage: string;
    isLoading: boolean;
    securityState: SecurityState;
    onBack: () => void;
    onPinChange: (pin: string) => void;
    onPinComplete: (pin: string) => void;
}

export function PinVerification({
    displayAmount,
    selectedProductsCount,
    calculatedTotal,
    pin,
    isPinError,
    errorMessage,
    isLoading,
    securityState,
    onBack,
    onPinChange,
    onPinComplete,
}: PinVerificationProps) {
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

            {/* Content area that takes remaining space */}
            <div className="flex-1 flex flex-col ">
                {/* Top content */}
                <div className="flex-1 flex flex-col justify-start pt-4">
                    <div className="text-center mb-6 mx-auto max-w-md">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                            Enter Your PIN
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Enter your 6-digit PIN to complete the transfer
                        </p>

                        {/* Transfer Summary */}
                        <div className="bg-gray-50 rounded-lg py-4 md:p-0 mb-6 text-left">
                            <h3 className="font-medium text-gray-900 mb-2">Transfer Summary</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-medium">₦{displayAmount}</span>
                                </div>
                                {selectedProductsCount > 0 && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Products Selected:</span>
                                            <span className="font-medium">{selectedProductsCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Product Total:</span>
                                            <span className="font-medium">₦{formatAmount(calculatedTotal)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-md">
                            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}

                    {securityState.isLocked && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mx-auto max-w-md">
                            <p className="text-yellow-800 text-sm font-medium">
                                Wallet is temporarily locked due to multiple failed attempts. Please try again later.
                            </p>
                        </div>
                    )}
                    {securityState.pinAttempts > 0 && !securityState.isLocked && (
                        <div className="text-center text-sm text-orange-600 mb-4">
                            {securityState.maxPinAttempts - securityState.pinAttempts} attempts remaining
                        </div>
                    )}

                    {isLoading && (
                        <div className="mb-6 mx-auto max-w-md">
                            <div className="flex flex-col items-center space-y-6 py-8">
                                {/* Orange-branded circular progress animation */}
                                <div className="relative w-24 h-24">
                                    {/* Background circle */}
                                    <div className="absolute inset-0 w-24 h-24 border-4 border-orange-100 rounded-full"></div>
                                    
                                    {/* Animated progress circle */}
                                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="44"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            className="text-orange-500"
                                            strokeLinecap="round"
                                            strokeDasharray="276"
                                            strokeDashoffset="276"
                                            style={{
                                                animation: 'orange-progress 2.5s ease-in-out infinite'
                                            }}
                                        />
                                    </svg>
                                    
                                    {/* Center icon with orange branding */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Clean text animation with orange accents */}
                                <div className="text-center space-y-3">
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        Processing Transfer
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Securing your ₦{displayAmount} transaction
                                    </p>
                                </div>

                                {/* Orange-branded progress steps */}
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-sm"></div>
                                        <span className="text-xs text-orange-600 font-medium">Verifying</span>
                                    </div>
                                    <div className="w-12 h-px bg-orange-200 animate-pulse"></div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                                        <span className="text-xs text-orange-500 font-medium">Processing</span>
                                    </div>
                                    <div className="w-12 h-px bg-orange-200 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-3 h-3 bg-orange-200 rounded-full animate-pulse" style={{ animationDelay: '1.4s' }}></div>
                                        <span className="text-xs text-orange-400 font-medium">Completing</span>
                                    </div>
                                </div>

                                {/* Security badge */}
                                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-orange-700 font-medium">256-bit Encrypted</span>
                                </div>
                            </div>

                            <style jsx>{`
                                @keyframes orange-progress {
                                    0% {
                                        stroke-dashoffset: 276;
                                        opacity: 0.8;
                                    }
                                    25% {
                                        stroke-dashoffset: 207;
                                        opacity: 1;
                                    }
                                    50% {
                                        stroke-dashoffset: 138;
                                        opacity: 1;
                                    }
                                    75% {
                                        stroke-dashoffset: 69;
                                        opacity: 1;
                                    }
                                    100% {
                                        stroke-dashoffset: 0;
                                        opacity: 0.9;
                                    }
                                }
                            `}</style>
                        </div>
                    )}
                </div>

                {/* Pin input at bottom */}
                <div className="">
                    <PinInput
                        onPinChange={onPinChange}
                        onPinComplete={onPinComplete}
                        isError={isPinError}
                        disabled={isLoading || securityState.isLocked}
                    />
                </div>
            </div>
        </div>
    );
}