import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-5 lg:h-6 w-24 lg:w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 lg:h-4 w-32 lg:w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function BalanceSkeleton() {
  return (
    <div className="bg-orange-500 text-white p-6 lg:p-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2 lg:mb-3">
          <div className="h-4 lg:h-5 w-24 lg:w-28 bg-orange-400 rounded animate-pulse" />
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-orange-400 rounded animate-pulse" />
        </div>
        <div className="h-8 lg:h-12 w-48 lg:w-64 bg-orange-400 rounded animate-pulse mx-auto mb-6 lg:mb-8" />

        {/* Action Buttons Skeleton */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 mx-4 lg:mx-8">
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="h-12 lg:h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-12 lg:h-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white lg:bg-transparent rounded-lg lg:rounded-none lg:border-b lg:border-gray-100">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 lg:w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-20 lg:w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-1">
        <div className="h-4 w-16 lg:w-20 bg-gray-200 rounded animate-pulse ml-auto" />
      </div>
    </div>
  )
}

export function TransactionHistorySkeleton() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <div className="h-6 lg:h-8 w-48 lg:w-56 bg-gray-200 rounded animate-pulse mb-1 lg:mb-2" />
        <div className="h-4 lg:h-5 w-56 lg:w-64 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Custom Tabs Skeleton */}
      <div className="flex gap-6 lg:gap-8 mb-4 lg:mb-6">
        <div className="relative">
          <div className="h-8 w-8 bg-orange-200 rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-300 rounded-full" />
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Transaction Items Skeleton */}
      <div className="space-y-3 lg:space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <TransactionSkeleton key={index} />
        ))}
      </div>
    </div>
  )
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
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
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
        <div className="max-w-4xl mx-auto p-6">
          <Card className="overflow-hidden">
            {/* Header Skeleton */}
            <CardHeader className="bg-white p-6 border-b">
              <div className="flex items-center justify-between">
                <ProfileSkeleton />
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
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
  )
}
