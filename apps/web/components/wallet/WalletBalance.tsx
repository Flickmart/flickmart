import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { BalanceSkeleton } from './skeleton';

type WalletBalanceProps = {
  balance: number;
  showBalance: boolean;
  isRefreshingBalance: boolean;
  isMobile?: boolean;
  onToggleBalance: () => void;
  onRefreshBalance: () => void;
  children?: ReactNode;
};

export default function WalletBalance({
  balance,
  showBalance,
  isRefreshingBalance,
  isMobile = false,
  onToggleBalance,
  onRefreshBalance,
  children,
}: WalletBalanceProps) {
  if (isRefreshingBalance) {
    return (
      <CardContent className="p-0">
        <BalanceSkeleton />
      </CardContent>
    );
  }

  const containerPadding = isMobile ? 'p-6' : 'p-8';
  const balanceTextSize = isMobile ? 'text-3xl' : 'text-5xl';
  const actionContainerPadding = isMobile ? 'mx-4 p-4' : 'mx-8 p-6';
  const actionContainerRadius = isMobile ? 'rounded-2xl' : 'rounded-3xl';
  const _buttonHeight = isMobile ? 'h-12' : 'h-16';
  const _buttonTextSize = isMobile ? 'text-base' : 'text-lg';
  const iconSize = isMobile ? 'h-4 w-4' : 'h-5 w-5';
  const _buttonGap = isMobile ? 'gap-2' : 'gap-3';

  return (
    <CardContent className="p-0">
      <div className={`bg-orange-500 ${containerPadding} text-white`}>
        <div className="text-center">
          <div
            className={`mb-${isMobile ? '2' : '3'} flex items-center justify-center gap-${isMobile ? '2' : '3'}`}
          >
            <span className={`text-${isMobile ? 'sm' : 'lg'} opacity-90`}>
              Wallet balance
            </span>
            <Button
              className={`h-auto p-${isMobile ? '1' : '2'} text-white hover:bg-orange-600`}
              onClick={onToggleBalance}
              size="sm"
              variant="ghost"
            >
              {showBalance ? (
                <Eye className={iconSize} />
              ) : (
                <EyeOff className={iconSize} />
              )}
            </Button>
            <Button
              className={`ml-${isMobile ? '2' : '3'} h-auto p-${isMobile ? '1' : '2'} text-white hover:bg-orange-600`}
              onClick={onRefreshBalance}
              size="sm"
              variant="ghost"
            >
              <RefreshCw className={iconSize} />
            </Button>
          </div>
          <div
            className={`mb-${isMobile ? '6' : '8'} font-bold ${balanceTextSize}`}
          >
            {showBalance ? `₦${balance.toLocaleString()}.00` : '₦••••••••'}
          </div>

          {/* Action Buttons Container */}
          <div
            className={`${actionContainerPadding} ${actionContainerRadius} bg-white`}
          >
            {children}
          </div>
        </div>
      </div>
    </CardContent>
  );
}
