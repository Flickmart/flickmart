"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { CheckCircle } from "lucide-react";

interface ProductItemProps {
  product: Doc<"product">;
  isSelected: boolean;
  onToggle: (productId: Id<"product">) => void;
}

export default function ProductItem({ product, isSelected, onToggle }: ProductItemProps) {
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
    return price.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md relative ${
        isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
      } ${isToggling ? 'scale-98 opacity-90' : ''}`}
      onClick={handleToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Product Image */}
          <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 && !imageError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            )}
            
            {/* Loading indicator during toggle */}
            {isToggling && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate capitalize">
              {product.title}
            </h3>
            <p className="text-lg font-semibold text-orange-600 mt-1">
              ₦{formatPrice(product.price)}
            </p>
            {product.condition && (
              <p className="text-xs text-gray-500 capitalize mt-1">
                {product.condition}
              </p>
            )}
            
            {/* Selection feedback */}
            {showFeedback && isSelected && (
              <div className="flex items-center mt-1 text-xs text-green-600 animate-fade-in">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Added to selection</span>
              </div>
            )}
            
            {showFeedback && !isSelected && (
              <div className="flex items-center mt-1 text-xs text-gray-500 animate-fade-in">
                <span>Removed from selection</span>
              </div>
            )}
          </div>

          {/* Enhanced Checkbox with loading state */}
          <div className="flex-shrink-0 relative">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggle}
              className={`h-5 w-5 transition-all duration-200 ${
                isToggling ? 'opacity-50' : ''
              }`}
              aria-label={`Select ${product.title}`}
              disabled={isToggling}
            />
            
            {/* Success indicator */}
            {isSelected && !isToggling && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Selection pulse effect */}
      {showFeedback && (
        <div className="absolute inset-0 border-2 border-orange-400 rounded-lg animate-pulse opacity-50 pointer-events-none"></div>
      )}
    </Card>
  );
}