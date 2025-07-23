"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/Spinner";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";

// TypeScript interfaces
interface Product {
    _id: Id<"product">;
    title: string;
    description: string;
    images: string[];
    price: number;
    category: string;
    condition: "brand new" | "used";
}

interface ProductsListProps {
    products: Product[] | undefined;
    isLoading?: boolean;
    error?: string;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
    const value = amount / 100;
    return `₦${value.toLocaleString()}`;
};

// Error state component
const ProductsError = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
    <Card>
        <CardContent className="px-4 sm:px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Products</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-flickmart hover:text-flickmart/80 text-sm font-medium"
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
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/4 h-3 bg-gray-200 rounded animate-pulse"></div>
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
        <CardContent className="px-4 sm:px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-sm text-gray-500">
                This order doesn't contain any products or they may have been removed.
            </p>
        </CardContent>
    </Card>
);

// Individual product card component
const ProductCard = ({ product }: { product: Product }) => {
    const productImage = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <Link href={`/product/${product._id}`} className="block hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2">
            <div className="flex space-x-3 sm:space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {productImage ? (
                            <Image
                                src={productImage}
                                alt={product.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                                {product.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 capitalize">
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
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

// Main ProductsList component
export const ProductsList = ({ products, isLoading = false, error }: ProductsListProps) => {
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
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-base sm:text-lg">
                    Products ({products.length} item{products.length !== 1 ? 's' : ''})
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <div key={product._id}>
                            <ProductCard product={product} />
                            {index < products.length - 1 && (
                                <Separator className="mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};