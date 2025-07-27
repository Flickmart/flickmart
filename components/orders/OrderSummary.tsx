"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

// TypeScript interfaces
interface Product {
    _id: Id<"product">;
    name: string;
    price: number;
    images?: string[];
    description?: string;
}

interface OrderWithDetails {
    _id: Id<"orders">;
    productIds: Id<"product">[];
    buyerId: Id<"users">;
    sellerId: Id<"users">;
    amount: number;
    status: "in_escrow" | "completed" | "cancelled" | "disputed";
    buyerConfirmedCompletion: boolean;
    sellerConfirmedCompletion: boolean;
    createdAt: number;
    completedAt?: number;
    // Enriched data
    buyerName?: string;
    sellerName?: string;
    buyerImageUrl?: string;
    sellerImageUrl?: string;
    userRole: "buyer" | "seller";
}

interface OrderSummaryProps {
    order: OrderWithDetails;
    products: Product[];
}

// Helper functions
const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (amount: number): string => {
    const value = amount / 100;
    return `₦${value.toLocaleString()}`;
};

const getStatusBadgeProps = (status: OrderWithDetails["status"]) => {
    switch (status) {
        case "in_escrow":
            return {
                className: "bg-flickmart text-white hover:bg-flickmart/90",
                text: "In Escrow"
            };
        case "completed":
            return {
                className: "bg-green-500 text-white hover:bg-green-600",
                text: "Completed"
            };
        case "cancelled":
            return {
                className: "bg-red-500 text-white hover:bg-red-600",
                text: "Cancelled"
            };
        case "disputed":
            return {
                className: "bg-yellow-500 text-black hover:bg-yellow-600",
                text: "Disputed"
            };
        default:
            return {
                className: "bg-gray-500 text-white",
                text: status
            };
    }
};

const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

// OrderSummary component
export const OrderSummary = ({ order, products }: OrderSummaryProps) => {
    const statusProps = getStatusBadgeProps(order.status);
    const otherPartyName = order.userRole === "buyer" ? order.sellerName : order.buyerName;
    const otherPartyImageUrl = order.userRole === "buyer" ? order.sellerImageUrl : order.buyerImageUrl;
    const otherPartyRole = order.userRole === "buyer" ? "Seller" : "Buyer";

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Order Header */}
            <Card>
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg sm:text-xl truncate">
                                Order #{order._id.slice(-8)}
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base mt-1">
                                Placed on {formatDate(order.createdAt)}
                            </CardDescription>
                        </div>
                        <Badge className={`${statusProps.className} text-xs sm:text-sm px-2 py-1 flex-shrink-0`}>
                            {statusProps.text}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Order Details */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {/* Transaction Details */}
                <Card>
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="text-base sm:text-lg">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Amount</span>
                            <span className="font-semibold text-flickmart text-base sm:text-lg">
                                {formatCurrency(order.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge className={`${statusProps.className} text-xs px-2 py-1`}>
                                {statusProps.text}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Your Role</span>
                            <span className="capitalize font-medium text-sm">{order.userRole}</span>
                        </div>
                        {order.completedAt && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="text-sm">{formatDate(order.completedAt)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Other Party Details */}
                <Card>
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="text-base sm:text-lg">{otherPartyRole} Information</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                <AvatarImage src={otherPartyImageUrl} alt={otherPartyName} />
                                <AvatarFallback>
                                    {getInitials(otherPartyName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm sm:text-base truncate">{otherPartyName || "Unknown User"}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{otherPartyRole}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products */}
            <Card>
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="text-base sm:text-lg">
                        Products ({products.length} item{products.length !== 1 ? 's' : ''})
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-3 sm:space-y-4">
                        {products.map((product, index) => (
                            <div key={product._id}>
                                <div className="flex space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400"
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
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                            {formatCurrency(product.price)}
                                        </p>
                                        {product.description && (
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {index < products.length - 1 && <Separator className="mt-3 sm:mt-4" />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation Status (for in_escrow orders) */}
            {order.status === "in_escrow" && (
                <Card>
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="text-base sm:text-lg">Completion Confirmation</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Buyer Confirmation</span>
                                <div className="flex items-center space-x-2">
                                    {order.buyerConfirmedCompletion ? (
                                        <>
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span className="text-green-600 font-medium text-xs sm:text-sm">Confirmed</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0"></div>
                                            <span className="text-gray-500 text-xs sm:text-sm">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Seller Confirmation</span>
                                <div className="flex items-center space-x-2">
                                    {order.sellerConfirmedCompletion ? (
                                        <>
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span className="text-green-600 font-medium text-xs sm:text-sm">Confirmed</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0"></div>
                                            <span className="text-gray-500 text-xs sm:text-sm">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};