"use client";

import { Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import ProductItem from "./product-item";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useMemo } from "react";

// Levenshtein distance function for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity percentage
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
}

// Check if text contains similar words
function hasSimilarWords(text: string, query: string, threshold: number = 0.7): boolean {
  const textWords = text.toLowerCase().split(/\s+/);
  const queryWords = query.toLowerCase().split(/\s+/);
  
  return queryWords.some(queryWord => 
    textWords.some(textWord => 
      calculateSimilarity(queryWord, textWord) >= threshold
    )
  );
}

interface ProductSelectionScreenProps {
  products: Doc<"product">[] | null;
  selectedProducts: Id<"product">[];
  onProductToggle: (productId: Id<"product">) => void;
  onSkip: () => void;
  onContinue: () => void;
  calculatedTotal: number;
  seller: Doc<"users"> | null;
}

export default function ProductSelectionScreen({
  products,
  selectedProducts,
  onProductToggle,
  onSkip,
  onContinue,
  calculatedTotal,
  seller,
}: ProductSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const selectedCount = selectedProducts.length;
  const hasProducts = products && products.length > 0;

  // Filter products based on search query with fuzzy matching
  const filteredProducts = useMemo(() => {
    if (!products || !searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/);
    
    return products.filter((product) => {
      const title = product.title?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      
      // Exact match (highest priority)
      if (title.includes(query) || description.includes(query) || category.includes(query)) {
        return true;
      }
      
      // Fuzzy matching for similar spellings
      const titleSimilarity = hasSimilarWords(title, query, 0.6);
      const descriptionSimilarity = hasSimilarWords(description, query, 0.6);
      const categorySimilarity = hasSimilarWords(category, query, 0.6);
      
      return titleSimilarity || descriptionSimilarity || categorySimilarity;
    });
  }, [products, searchQuery]);

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
        <div className="">
          <div className="flex max-w-lg items-center justify-start gap-2  pb-2 ">
            <Avatar className="h-14 w-14 border border-flickmart">
              <AvatarImage
                alt={seller?.name || "User"}
                src={seller?.imageUrl}
              />
              <AvatarFallback>
                {seller?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <p className="flex flex-col">
              <span className=" text-xl font-bold">{seller?.name} Stores</span>
              <span className="text-gray-500 text-sm font-light">
                Select Products to Continue
              </span>
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              {filteredProducts?.length || 0} product{(filteredProducts?.length || 0) !== 1 ? 's' : ''} found
            </p>
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
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem
                isSelected={selectedProducts.includes(product._id)}
                key={product._id}
                onToggle={onProductToggle}
                product={product}
              />
            ))
          ) : searchQuery ? (
            <Card className="p-6 text-center">
              <Search className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-600">No products found matching "{searchQuery}"</p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-orange-500 hover:text-orange-600"
              >
                Clear search
              </Button>
            </Card>
          ) : null}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 rounded-2xl py-4 font-medium text-lg"
            onClick={onSkip}
            variant="outline"
          >
            Skip
          </Button>
          <Button
            className={`flex-1 rounded-2xl py-4 font-medium text-lg ${
              selectedCount === 0
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
            disabled={selectedCount === 0}
            onClick={onContinue}
          >
            {selectedCount === 0
              ? "Select Products to Continue"
              : `Continue with ${selectedCount} Product${selectedCount !== 1 ? "s" : ""}`}
          </Button>
        </div>

        {/* User guidance */}
        {selectedCount === 0 && (
          <div className="mt-3 text-center">
            <p className="text-gray-500 text-sm">
              💡 Tap on products to select them, or skip to make a general
              transfer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
