'use client';

import { PinInput } from './pin-input';
import { SecurityHeader } from './security-header';

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
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SecurityHeader onBack={onBack} showBackButton />

      {/* Content area that takes remaining space */}
      <div className="flex flex-1 flex-col">
        {/* Top content */}
        <div className="flex flex-1 flex-col justify-start pt-4">
          <div className="mx-auto mb-6 max-w-md text-center">
            <h1 className="mb-4 font-semibold text-2xl text-gray-900">
              Enter Your PIN
            </h1>
            <p className="mb-4 text-gray-600">
              Enter your 6-digit PIN to complete the transfer
            </p>

            {/* Transfer Summary */}
            <div className="mb-6 rounded-lg bg-gray-50 py-4 text-left md:p-0">
              <h3 className="mb-2 font-medium text-gray-900">
                Transfer Summary
              </h3>
              <div className="space-y-1 text-gray-600 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">₦{displayAmount}</span>
                </div>
                {selectedProductsCount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Products Selected:</span>
                      <span className="font-medium">
                        {selectedProductsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product Total:</span>
                      <span className="font-medium">
                        ₦{formatAmount(calculatedTotal)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mx-auto mb-6 max-w-md rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          {securityState.isLocked && (
            <div className="mx-auto mb-6 max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="font-medium text-sm text-yellow-800">
                Wallet is temporarily locked due to multiple failed attempts.
                Please try again later.
              </p>
            </div>
          )}
          {securityState.pinAttempts > 0 && !securityState.isLocked && (
            <div className="mb-4 text-center text-orange-600 text-sm">
              {securityState.maxPinAttempts - securityState.pinAttempts}{' '}
              attempts remaining
            </div>
          )}

          {isLoading && (
            <div className="mx-auto mb-6 max-w-md">
              <div className="flex flex-col items-center space-y-6 py-8">
                {/* Orange-branded circular progress animation */}
                <div className="relative h-24 w-24">
                  {/* Background circle */}
                  <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-orange-100" />

                  {/* Animated progress circle */}
                  <svg
                    className="-rotate-90 h-24 w-24 transform"
                    viewBox="0 0 96 96"
                  >
                    <circle
                      className="text-orange-500"
                      cx="48"
                      cy="48"
                      fill="none"
                      r="44"
                      stroke="currentColor"
                      strokeDasharray="276"
                      strokeDashoffset="276"
                      strokeLinecap="round"
                      strokeWidth="4"
                      style={{
                        animation: 'orange-progress 2.5s ease-in-out infinite',
                      }}
                    />
                  </svg>

                  {/* Center icon with orange branding */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                      <svg
                        className="h-6 w-6 animate-pulse text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Clean text animation with orange accents */}
                <div className="space-y-3 text-center">
                  <h3 className="font-semibold text-2xl text-gray-900">
                    Processing Transfer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Securing your ₦{displayAmount} transaction
                  </p>
                </div>

                {/* Orange-branded progress steps */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 shadow-sm" />
                    <span className="font-medium text-orange-600 text-xs">
                      Verifying
                    </span>
                  </div>
                  <div className="h-px w-12 animate-pulse bg-orange-200" />
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className="h-3 w-3 animate-pulse rounded-full bg-orange-300"
                      style={{ animationDelay: '0.7s' }}
                    />
                    <span className="font-medium text-orange-500 text-xs">
                      Processing
                    </span>
                  </div>
                  <div
                    className="h-px w-12 animate-pulse bg-orange-200"
                    style={{ animationDelay: '0.7s' }}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className="h-3 w-3 animate-pulse rounded-full bg-orange-200"
                      style={{ animationDelay: '1.4s' }}
                    />
                    <span className="font-medium text-orange-400 text-xs">
                      Completing
                    </span>
                  </div>
                </div>

                {/* Security badge */}
                <div className="flex items-center justify-center space-x-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="font-medium text-orange-700 text-xs">
                    256-bit Encrypted
                  </span>
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
            disabled={isLoading || securityState.isLocked}
            isError={isPinError}
            onPinChange={onPinChange}
            onPinComplete={onPinComplete}
          />
        </div>
      </div>
    </div>
  );
}
