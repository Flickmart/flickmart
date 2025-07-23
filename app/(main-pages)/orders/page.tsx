"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

// Types
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
  buyerName?: string;
  sellerName?: string;
  userRole: "buyer" | "seller";
}

// Helper functions
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  const value = amount / 100;
  return `₦${value.toLocaleString()}`;
};

const getStatusBadgeProps = (status: OrderDisplay["status"]) => {
  switch (status) {
    case "in_escrow":
      return {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        text: "In Escrow"
      };
    case "completed":
      return {
        className: "bg-green-100 text-green-800 hover:bg-green-200",
        text: "Completed"
      };
    case "cancelled":
      return {
        className: "bg-red-100 text-red-800 hover:bg-red-200",
        text: "Cancelled"
      };
    case "disputed":
      return {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        text: "Disputed"
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800",
        text: status
      };
  }
};

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-sm">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500 mb-6">
        You haven't made any purchases or sales yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-2 bg-flickmart text-white rounded-md hover:bg-flickmart/90 transition-colors font-medium"
      >
        Browse Products
      </Link>
    </div>
  </div>
);

// Orders Table Component
const OrdersTable = ({ orders }: { orders: OrderDisplay[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusProps = getStatusBadgeProps(order.status);
              return (
                <TableRow key={order._id} className="cursor-pointer">
                  <Link href={`/orders/${order._id}`} className="contents">
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userRole === "buyer" ? `Seller: ${order.sellerName || "Unknown"}` : `Buyer: ${order.buyerName || "Unknown"}`}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={statusProps.className}>
                        {statusProps.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-semibold text-flickmart">
                        {formatCurrency(order.amount)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.productIds.length} item{order.productIds.length !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                  </Link>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {orders.map((order) => {
          const statusProps = getStatusBadgeProps(order.status);
          return (
            <Link key={order._id} href={`/orders/${order._id}`}>
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      Order #{order._id.slice(-8)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <Badge className={statusProps.className}>
                    {statusProps.text}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {order.productIds.length} item{order.productIds.length !== 1 ? 's' : ''}
                  </div>
                  <div className="font-semibold text-flickmart">
                    {formatCurrency(order.amount)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {order.userRole === "buyer" ? `Seller: ${order.sellerName || "Unknown"}` : `Buyer: ${order.buyerName || "Unknown"}`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Main Orders page component
export default function OrdersPage() {
  const orders = useQuery(api.orders.getUserOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    let filtered = orders.filter((order: OrderDisplay) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesRole = roleFilter === "all" || order.userRole === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort orders
    filtered.sort((a: OrderDisplay, b: OrderDisplay) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, roleFilter, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track your buying and selling activities
                </p>
              </div>
              {Array.isArray(orders) && orders.length > 0 && (
                <div className="text-sm text-gray-500">
                  {filteredAndSortedOrders.length} of {orders.length} orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders === undefined ? (
          // Loading state
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : Array.isArray(orders) && orders.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in_escrow">In Escrow</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Role Filter */}
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="buyer">As Buyer</SelectItem>
                      <SelectItem value="seller">As Seller</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">Highest Amount</SelectItem>
                      <SelectItem value="amount-low">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            {filteredAndSortedOrders.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <OrdersTable orders={filteredAndSortedOrders} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}