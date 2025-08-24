'use client';

import { AlertCircle, Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import ProductItem from './product-item';

interface ProductSelectionScreenProps {
  products: Doc<'product'>[] | null;
  selectedProducts: Id<'product'>[];
  onProductToggle: (productId: Id<'product'>) => void;
  onSkip: () => void;
  onContinue: () => void;
  calculatedTotal: number;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  loadingMessage?: string;
  errorType?: 'network' | 'server' | 'auth' | 'generic';
  isValidating?: boolean;
}

export default function ProductSelectionScreen({
  products,
  selectedProducts,
  onProductToggle,
  onSkip,
  onContinue,
  calculatedTotal,
  isLoading,
  error,
  onRetry,
  loadingMessage = "Loading seller's products...",
  errorType = 'generic',
  isValidating = false,
}: ProductSelectionScreenProps) {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const selectedCount = selectedProducts.length;
  const hasProducts = products && products.length > 0;

  // Enhanced loading state with better indicators and user feedback
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-semibold text-2xl text-gray-900">
              Select Products
            </h1>
            <div className="mb-2 flex items-center justify-center gap-2 text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-orange-500 border-b-2" />
              <p>{loadingMessage}</p>
            </div>
            <p className="text-gray-500 text-sm">
              This may take a few moments...
            </p>
          </div>

          {/* Enhanced loading skeleton with animation */}
          <div className="mb-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Card className="animate-pulse" key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-16 w-16 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-5 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-3 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading state for action buttons */}
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300" />
            <Skeleton className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300" />
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-800 text-xs">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              Fetching products...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state with specific error handling
  if (error) {
    const getErrorIcon = () => {
      switch (errorType) {
        case 'network':
          return (
            <div className="mx-auto mb-4 h-12 w-12 text-orange-500">📶</div>
          );
        case 'server':
          return <div className="mx-auto mb-4 h-12 w-12 text-red-500">🔧</div>;
        case 'auth':
          return (
            <div className="mx-auto mb-4 h-12 w-12 text-yellow-500">🔒</div>
          );
        default:
          return (
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          );
      }
    };

    const getErrorTitle = () => {
      switch (errorType) {
        case 'network':
          return 'Connection Issue';
        case 'server':
          return 'Server Temporarily Unavailable';
        case 'auth':
          return 'Access Restricted';
        default:
          return 'Unable to Load Products';
      }
    };

    const getErrorActions = () => {
      const canRetry = errorType !== 'auth';

      return (
        <div className="space-y-3">
          {canRetry && onRetry && (
            <Button className="w-full" onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {errorType === 'network'
                ? 'Check Connection & Retry'
                : 'Try Again'}
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-2xl py-4 font-medium text-lg"
              onClick={onSkip}
              variant="outline"
            >
              {errorType === 'auth' ? 'Continue Anyway' : 'Skip & Continue'}
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-semibold text-2xl text-gray-900">
              Select Products
            </h1>
          </div>

          <Card className="mb-6 border-l-4 border-l-red-500">
            <CardContent className="p-6 text-center">
              {getErrorIcon()}
              <h3 className="mb-2 font-medium text-gray-900 text-lg">
                {getErrorTitle()}
              </h3>
              <p className="mb-4 text-gray-600">{error}</p>

              {/* Additional helpful information based on error type */}
              {errorType === 'network' && (
                <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <p className="text-orange-800 text-sm">
                    💡 <strong>Tip:</strong> Check your internet connection and
                    try again. You can also continue with a general transfer.
                  </p>
                </div>
              )}

              {errorType === 'server' && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-blue-800 text-sm">
                    ⏱️ <strong>Note:</strong> This is usually temporary. Please
                    try again in a few moments.
                  </p>
                </div>
              )}

              {errorType === 'auth' && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    🔐 <strong>Info:</strong> You can still proceed with a
                    general transfer to this seller.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {getErrorActions()}
        </div>
      </div>
    );
  }

  // No products state
  if (!hasProducts) {
    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-semibold text-2xl text-gray-900">
              Select Products
            </h1>
            <p className="text-gray-600">Choose products to pay for</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-gray-900 text-lg">
                No Products Available
              </h3>
              <p className="text-gray-600">
                This seller doesn't have any products listed yet.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-2xl py-4 font-medium text-lg"
              onClick={onSkip}
              variant="outline"
            >
              Continue with General Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Products available state
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-semibold text-2xl text-gray-900">
            Select Products
          </h1>
          <p className="text-gray-600">Choose products to pay for</p>
          {selectedCount > 0 && (
            <div className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-800 text-sm">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Selected products total */}
        {selectedCount > 0 && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="font-bold text-orange-600 text-xl">
                  ₦{formatAmount(calculatedTotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products list */}
        <div className="mb-6 max-h-96 space-y-3 overflow-y-auto">
          {products.map((product) => (
            <ProductItem
              isSelected={selectedProducts.includes(product._id)}
              key={product._id}
              onToggle={onProductToggle}
              product={product}
            />
          ))}
        </div>

        {/* Action buttons with enhanced feedback */}
        <div className="flex gap-3">
          <Button
            className="flex-1 rounded-2xl py-4 font-medium text-lg transition-all duration-200 hover:bg-gray-50"
            onClick={onSkip}
            variant="outline"
          >
            Skip
          </Button>
          <Button
            className={`flex-1 rounded-2xl py-4 font-medium text-lg transition-all duration-200 ${
              selectedCount === 0 || isValidating
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'transform bg-orange-500 text-white hover:scale-105 hover:bg-orange-600 hover:shadow-lg'
            }`}
            disabled={selectedCount === 0 || isValidating}
            onClick={onContinue}
          >
            {isValidating ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-gray-400 border-b-2" />
                Validating Products...
              </div>
            ) : selectedCount === 0 ? (
              'Select Products to Continue'
            ) : (
              <>
                Continue with {selectedCount} Product
                {selectedCount !== 1 ? 's' : ''}
                <span className="ml-2 animate-pulse rounded-full bg-orange-600 px-2 py-1 text-white text-xs">
                  {selectedCount}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Additional user guidance */}
        {selectedCount === 0 && (
          <div className="mt-3 text-center">
            <p className="text-gray-500 text-sm">
              💡 Tap on products to select them, or skip to make a general
              transfer
            </p>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="mt-3 text-center">
            <p className="font-medium text-green-600 text-sm">
              ✓ Ready to proceed with selected products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
