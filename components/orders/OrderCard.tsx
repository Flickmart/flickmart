"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

// TypeScript interface for order data
interface OrderDisplay {
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
    userRole: "buyer" | "seller";
}

// Helper function to format date
const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Helper function to get status badge variant and color
const getStatusBadgeProps = (status: OrderDisplay["status"]) => {
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

// Helper function to format currency
const formatCurrency = (amount: number): string => {
    const value = amount / 100
    return `₦${value.toLocaleString()}`;
};

// OrderCard component props
interface OrderCardProps {
    order: OrderDisplay;
    onClick?: () => void;
}

// OrderCard component
export const OrderCard = ({ order, onClick }: OrderCardProps) => {
    const statusProps = getStatusBadgeProps(order.status);
    const otherPartyName = order.userRole === "buyer" ? order.sellerName : order.buyerName;
    const otherPartyRole = order.userRole === "buyer" ? "Seller" : "Buyer";

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const cardContent = (
        <Card className="hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98] transition-transform" onClick={handleClick}>
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">
                            Order #{order._id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                            {formatDate(order.createdAt)}
                        </CardDescription>
                    </div>
                    <Badge className={`${statusProps.className} text-xs px-2 py-1 flex-shrink-0`}>
                        {statusProps.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Amount</span>
                        <span className="font-semibold text-flickmart text-sm sm:text-base">
                            {formatCurrency(order.amount)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">{otherPartyRole}</span>
                        <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none text-right">
                            {otherPartyName || "Unknown"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Products</span>
                        <span className="text-xs sm:text-sm">{order.productIds.length} item(s)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // If no custom onClick handler, wrap with Link for navigation
    if (!onClick) {
        return (
            <Link href={`/orders/${order._id}`}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};