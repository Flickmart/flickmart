"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Id } from "@/convex/_generated/dataModel";

// TypeScript interfaces
type Product = {
  _id: Id<"product">;
  title: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  condition: "brand new" | "used";
};

type ProductsListProps = {
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: string;
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  const value = amount / 100;
  return `₦${value.toLocaleString()}`;
};

// Error state component
const ProductsError = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) => (
  <Card>
    <CardContent className="px-4 py-8 text-center sm:px-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">
        Failed to Load Products
      </h3>
      <p className="mb-4 text-gray-500 text-sm">{error}</p>
      {onRetry && (
        <button
          className="font-medium text-flickmart text-sm hover:text-flickmart/80"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </CardContent>
  </Card>
);

// Loading state component
const ProductsLoading = () => (
  <Card>
    <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
    </CardHeader>
    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div className="flex space-x-4" key={i}>
            <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Empty state component
const ProductsEmpty = () => (
  <Card>
    <CardContent className="px-4 py-8 text-center sm:px-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">
        No Products Found
      </h3>
      <p className="text-gray-500 text-sm">
        This order doesn't contain any products or they may have been removed.
      </p>
    </CardContent>
  </Card>
);

// Individual product card component
const ProductCard = ({ product }: { product: Product }) => {
  const productImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link
      className="-m-2 block rounded-lg p-2 transition-colors hover:bg-gray-50"
      href={`/product/${product._id}`}
    >
      <div className="flex space-x-3 sm:space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20">
            {productImage ? (
              <Image
                alt={product.title}
                className="h-full w-full object-cover"
                height={80}
                src={productImage}
                width={80}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 font-medium text-gray-900 text-sm sm:text-base">
                {product.title}
              </h4>
              <p className="mt-1 text-gray-500 text-xs capitalize sm:text-sm">
                {product.condition} • {product.category}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="font-semibold text-flickmart text-sm sm:text-base">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-gray-600 text-xs sm:text-sm">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Main ProductsList component
export const ProductsList = ({
  products,
  isLoading = false,
  error,
}: ProductsListProps) => {
  // Handle loading state
  if (isLoading) {
    return <ProductsLoading />;
  }

  // Handle error state
  if (error) {
    return <ProductsError error={error} />;
  }

  // Handle empty state
  if (!products || products.length === 0) {
    return <ProductsEmpty />;
  }

  return (
    <Card>
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
        <CardTitle className="text-base sm:text-lg">
          Products ({products.length} item{products.length !== 1 ? "s" : ""})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product._id}>
              <ProductCard product={product} />
              {index < products.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
