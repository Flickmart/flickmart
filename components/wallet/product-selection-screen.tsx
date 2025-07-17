"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { AlertCircle, Package, RefreshCw } from "lucide-react";
import ProductItem from "./product-item";

interface ProductSelectionScreenProps {
  products: Doc<"product">[] | null;
  selectedProducts: Id<"product">[];
  onProductToggle: (productId: Id<"product">) => void;
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
    return amount.toLocaleString("en-NG", {
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Select Products
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              <p>{loadingMessage}</p>
            </div>
            <p className="text-sm text-gray-500">
              This may take a few moments...
            </p>
          </div>

          {/* Enhanced loading skeleton with animation */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-16 h-16 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-5 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-3 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded bg-gradient-to-r from-gray-200 to-gray-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading state for action buttons */}
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300" />
            <Skeleton className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300" />
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
              <div className="animate-pulse w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
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
          return <div className="w-12 h-12 text-orange-500 mx-auto mb-4">📶</div>;
        case 'server':
          return <div className="w-12 h-12 text-red-500 mx-auto mb-4">🔧</div>;
        case 'auth':
          return <div className="w-12 h-12 text-yellow-500 mx-auto mb-4">🔒</div>;
        default:
          return <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />;
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
            <Button
              variant="outline"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {errorType === 'network' ? 'Check Connection & Retry' : 'Try Again'}
            </Button>
          )}
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 py-4 rounded-2xl text-lg font-medium"
              onClick={onSkip}
            >
              {errorType === 'auth' ? 'Continue Anyway' : 'Skip & Continue'}
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Select Products
            </h1>
          </div>

          <Card className="mb-6 border-l-4 border-l-red-500">
            <CardContent className="p-6 text-center">
              {getErrorIcon()}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getErrorTitle()}
              </h3>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              
              {/* Additional helpful information based on error type */}
              {errorType === 'network' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-orange-800">
                    💡 <strong>Tip:</strong> Check your internet connection and try again. You can also continue with a general transfer.
                  </p>
                </div>
              )}
              
              {errorType === 'server' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    ⏱️ <strong>Note:</strong> This is usually temporary. Please try again in a few moments.
                  </p>
                </div>
              )}
              
              {errorType === 'auth' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    🔐 <strong>Info:</strong> You can still proceed with a general transfer to this seller.
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Select Products
            </h1>
            <p className="text-gray-600">
              Choose products to pay for
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                This seller doesn't have any products listed yet.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 py-4 rounded-2xl text-lg font-medium"
              onClick={onSkip}
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
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Select Products
          </h1>
          <p className="text-gray-600">
            Choose products to pay for
          </p>
          {selectedCount > 0 && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Selected products total */}
        {selectedCount > 0 && (
          <Card className="mb-4 bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-orange-600">
                  ₦{formatAmount(calculatedTotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products list */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              isSelected={selectedProducts.includes(product._id)}
              onToggle={onProductToggle}
            />
          ))}
        </div>

        {/* Action buttons with enhanced feedback */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-4 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-all duration-200"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            className={`flex-1 font-medium py-4 rounded-2xl text-lg transition-all duration-200 ${
              selectedCount === 0 || isValidating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg transform hover:scale-105'
            }`}
            onClick={onContinue}
            disabled={selectedCount === 0 || isValidating}
          >
            {isValidating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                Validating Products...
              </div>
            ) : selectedCount === 0 ? (
              'Select Products to Continue'
            ) : (
              <>
                Continue with {selectedCount} Product{selectedCount !== 1 ? 's' : ''}
                <span className="ml-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                  {selectedCount}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Additional user guidance */}
        {selectedCount === 0 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">
              💡 Tap on products to select them, or skip to make a general transfer
            </p>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-green-600 font-medium">
              ✓ Ready to proceed with selected products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}