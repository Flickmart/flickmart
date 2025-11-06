'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type ProductItemProps = {
  product: Doc<'product'>;
  isSelected: boolean;
  onToggle: (productId: Id<'product'>) => void;
};

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
      className={cn(
        'relative cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected ? 'bg-orange-50 ring-2 ring-orange-500' : 'hover:bg-gray-50',
        isToggling && 'scale-98 opacity-90'
      )}
      onClick={handleToggle}
    >
      <CardContent className="p-4 pl-2">
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
            <h3 className="truncate font-bold text-gray-900 text-sm capitalize">
              {product.title}
            </h3>
            <p className="font-bold text-lg text-orange-600">
              ₦{formatPrice(product.price)}
            </p>
            {product.condition && (
              <p className="text-xs capitalize">{product.condition}</p>
            )}
          </div>

          {/* Checkbox vertically centered */}
          <div className="relative flex h-16 flex-shrink-0 items-center">
            <div className="relative flex items-center">
              <Checkbox
                aria-label={`Select ${product.title}`}
                checked={isSelected}
                className={cn(
                  'h-5 w-5 rounded-none border-2 transition-all duration-200',
                  { 'opacity-50': isToggling }
                )}
                disabled={isToggling}
                onCheckedChange={handleToggle}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
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
