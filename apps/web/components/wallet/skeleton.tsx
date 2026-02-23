import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 lg:h-16 lg:w-16" />
      <div className="space-y-2">
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200 lg:h-6 lg:w-32" />
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200 lg:h-4 lg:w-40" />
      </div>
    </div>
  );
}

export function BalanceSkeleton() {
  return (
    <div className="bg-orange-500 p-6 text-white lg:p-8">
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2 lg:mb-3 lg:gap-3">
          <div className="h-4 w-24 animate-pulse rounded bg-orange-400 lg:h-5 lg:w-28" />
          <div className="h-4 w-4 animate-pulse rounded bg-orange-400 lg:h-5 lg:w-5" />
        </div>
        <div className="mx-auto mb-6 h-8 w-48 animate-pulse rounded bg-orange-400 lg:mb-8 lg:h-12 lg:w-64" />

        {/* Action Buttons Skeleton */}
        <div className="mx-4 rounded-2xl bg-white p-4 lg:mx-8 lg:rounded-3xl lg:p-6">
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="h-12 animate-pulse rounded-full bg-gray-200 lg:h-16" />
            <div className="h-12 animate-pulse rounded-full bg-gray-200 lg:h-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 lg:gap-4 lg:rounded-none lg:border-gray-100 lg:border-b lg:bg-transparent lg:p-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 lg:w-40" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200 lg:w-24" />
      </div>
      <div className="space-y-1">
        <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200 lg:w-20" />
      </div>
    </div>
  );
}

export function TransactionHistorySkeleton() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <div className="mb-1 h-6 w-48 animate-pulse rounded bg-gray-200 lg:mb-2 lg:h-8 lg:w-56" />
        <div className="h-4 w-56 animate-pulse rounded bg-gray-200 lg:h-5 lg:w-64" />
      </div>

      {/* Custom Tabs Skeleton */}
      <div className="mb-4 flex gap-6 lg:mb-6 lg:gap-8">
        <div className="relative">
          <div className="h-8 w-8 animate-pulse rounded-full bg-orange-200" />
          <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-300" />
        </div>
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Transaction Items Skeleton */}
      <div className="space-y-3 lg:space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <TransactionSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function WalletPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden">
        <Card className="rounded-none border-0 shadow-none">
          {/* Header Skeleton */}
          <CardHeader className="bg-white p-4">
            <div className="flex items-center justify-between">
              <ProfileSkeleton />
              <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
            </div>
          </CardHeader>

          {/* Balance Section Skeleton */}
          <CardContent className="p-0">
            <BalanceSkeleton />
          </CardContent>
        </Card>

        {/* Transaction History Skeleton */}
        <TransactionHistorySkeleton />
      </div>

      {/* Desktop Layout Skeleton */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-4xl p-6">
          <Card className="overflow-hidden">
            {/* Header Skeleton */}
            <CardHeader className="border-b bg-white p-6">
              <div className="flex items-center justify-between">
                <ProfileSkeleton />
                <div className="h-7 w-7 animate-pulse rounded bg-gray-200" />
              </div>
            </CardHeader>

            {/* Content Skeleton */}
            <CardContent className="p-0">
              <BalanceSkeleton />
              <TransactionHistorySkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
