'use client';

import { useQuery } from 'convex/react';
import { ArrowUpDown, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

// Types
type OrderDisplay = {
  _id: Id<'orders'>;
  productIds: Id<'product'>[];
  buyerId: Id<'users'>;
  sellerId: Id<'users'>;
  amount: number;
  status: 'in_escrow' | 'completed' | 'cancelled' | 'disputed';
  buyerConfirmedCompletion: boolean;
  sellerConfirmedCompletion: boolean;
  createdAt: number;
  completedAt?: number;
  buyerName?: string;
  sellerName?: string;
  userRole: 'buyer' | 'seller';
};

// Helper functions
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  const value = amount / 100;
  return `₦${value.toLocaleString()}`;
};

const getStatusBadgeProps = (status: OrderDisplay['status']) => {
  switch (status) {
    case 'in_escrow':
      return {
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        text: 'In Escrow',
      };
    case 'completed':
      return {
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
        text: 'Completed',
      };
    case 'cancelled':
      return {
        className: 'bg-red-100 text-red-800 hover:bg-red-200',
        text: 'Cancelled',
      };
    case 'disputed':
      return {
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        text: 'Disputed',
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-800',
        text: status,
      };
  }
};

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center px-4 py-12">
    <div className="max-w-sm text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">No orders yet</h3>
      <p className="mb-6 text-gray-500">
        You haven't made any purchases or sales yet.
      </p>
      <Link
        className="inline-flex items-center rounded-md bg-flickmart px-6 py-2 font-medium text-white transition-colors hover:bg-flickmart/90"
        href="/"
      >
        Browse Products
      </Link>
    </div>
  </div>
);

// Orders Table Component
const OrdersTable = ({ orders }: { orders: OrderDisplay[] }) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Order ID
              </TableHead>
              <TableHead className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Total
              </TableHead>
              <TableHead className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Products
              </TableHead>
              <TableHead className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusProps = getStatusBadgeProps(order.status);
              return (
                <TableRow className="cursor-pointer" key={order._id}>
                  <Link className="contents" href={`/orders/${order._id}`}>
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">
                        #{order._id.slice(-8)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {order.userRole === 'buyer'
                          ? `Seller: ${order.sellerName || 'Unknown'}`
                          : `Buyer: ${order.buyerName || 'Unknown'}`}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={statusProps.className}>
                        {statusProps.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="font-semibold text-flickmart text-sm">
                        {formatCurrency(order.amount)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-gray-900 text-sm">
                        {order.productIds.length} item
                        {order.productIds.length !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-gray-900 text-sm">
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
      <div className="divide-y divide-gray-200 md:hidden">
        {orders.map((order) => {
          const statusProps = getStatusBadgeProps(order.status);
          return (
            <Link href={`/orders/${order._id}`} key={order._id}>
              <div className="p-4 transition-colors hover:bg-gray-50">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      Order #{order._id.slice(-8)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <Badge className={statusProps.className}>
                    {statusProps.text}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 text-sm">
                    {order.productIds.length} item
                    {order.productIds.length !== 1 ? 's' : ''}
                  </div>
                  <div className="font-semibold text-flickmart">
                    {formatCurrency(order.amount)}
                  </div>
                </div>
                <div className="mt-1 text-gray-500 text-sm">
                  {order.userRole === 'buyer'
                    ? `Seller: ${order.sellerName || 'Unknown'}`
                    : `Buyer: ${order.buyerName || 'Unknown'}`}
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
  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();
  const orders = useQuery(api.orders.getUserOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    if (!(orders && Array.isArray(orders))) {
      return [];
    }

    const filtered = orders.filter((order: OrderDisplay) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      const matchesRole = roleFilter === 'all' || order.userRole === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort orders
    filtered.sort((a: OrderDisplay, b: OrderDisplay) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, roleFilter, sortBy]);

  // Handle authentication loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-semibold text-2xl text-gray-900">
                  My Orders
                </h1>
                <p className="mt-1 text-gray-500 text-sm">
                  Track your buying and selling activities
                </p>
              </div>
              {Array.isArray(orders) && orders.length > 0 && (
                <div className="text-gray-500 text-sm">
                  {filteredAndSortedOrders.length} of {orders.length} orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {orders === undefined ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                    <Input
                      className="pl-10"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search orders..."
                      value={searchTerm}
                    />
                  </div>

                  {/* Status Filter */}
                  <Select onValueChange={setStatusFilter} value={statusFilter}>
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
                  <Select onValueChange={setRoleFilter} value={roleFilter}>
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
                  <Select onValueChange={setSortBy} value={sortBy}>
                    <SelectTrigger>
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">
                        Highest Amount
                      </SelectItem>
                      <SelectItem value="amount-low">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            {filteredAndSortedOrders.length === 0 ? (
              <div className="py-12 text-center">
                <Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 font-medium text-gray-900 text-lg">
                  No orders found
                </h3>
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
