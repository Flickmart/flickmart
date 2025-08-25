'use client';

import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Doc, Id } from '@/convex/_generated/dataModel';

interface ProductItemProps {
  product: Doc<'product'>;
  isSelected: boolean;
  onToggle: (productId: Id<'product'>) => void;
}

export default function ProductItem({
  product,
  isSelected,
  onToggle,
}: ProductItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleToggle = () => {
    setIsToggling(true);
    setShowFeedback(true);

    // Provide immediate visual feedback
    setTimeout(() => {
      onToggle(product._id);
      setIsToggling(false);
    }, 150); // Small delay for visual feedback
  };

  // Reset feedback after selection change
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback, isSelected]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'bg-orange-50 ring-2 ring-orange-500' : 'hover:bg-gray-50'
      } ${isToggling ? 'scale-98 opacity-90' : ''}`}
      onClick={handleToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Product Image */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {product.images && product.images.length > 0 && !imageError ? (
              <Image
                alt={product.title}
                className="object-cover"
                fill
                onError={() => setImageError(true)}
                sizes="64px"
                src={product.images[0]}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <div className="h-8 w-8 rounded bg-gray-300" />
              </div>
            )}

            {/* Loading indicator during toggle */}
            {isToggling && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-gray-900 text-sm capitalize">
              {product.title}
            </h3>
            <p className="mt-1 font-semibold text-lg text-orange-600">
              ₦{formatPrice(product.price)}
            </p>
            {product.condition && (
              <p className="mt-1 text-gray-500 text-xs capitalize">
                {product.condition}
              </p>
            )}

            {/* Selection feedback */}
            {showFeedback && isSelected && (
              <div className="mt-1 flex animate-fade-in items-center text-green-600 text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                <span>Added to selection</span>
              </div>
            )}

            {showFeedback && !isSelected && (
              <div className="mt-1 flex animate-fade-in items-center text-gray-500 text-xs">
                <span>Removed from selection</span>
              </div>
            )}
          </div>

          {/* Enhanced Checkbox with loading state */}
          <div className="relative flex-shrink-0">
            <Checkbox
              aria-label={`Select ${product.title}`}
              checked={isSelected}
              className={`h-5 w-5 transition-all duration-200 ${
                isToggling ? 'opacity-50' : ''
              }`}
              disabled={isToggling}
              onCheckedChange={handleToggle}
            />

            {/* Success indicator */}
            {isSelected && !isToggling && (
              <div className="-top-1 -right-1 absolute flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                <CheckCircle className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Selection pulse effect */}
      {showFeedback && (
        <div className="pointer-events-none absolute inset-0 animate-pulse rounded-lg border-2 border-orange-400 opacity-50" />
      )}
    </Card>
  );
}
