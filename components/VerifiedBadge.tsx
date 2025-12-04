'use client';

import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * VerifiedBadge - Displays a verified seller badge
 *
 * Verified sellers are trusted vendors who:
 * - Maintain active product listings (2+ products per week)
 * - Have priority in search and recommendation algorithms
 * - Can post unlimited products
 */
export default function VerifiedBadge({
  size = 'md',
  showTooltip = true,
  className = '',
}: VerifiedBadgeProps) {
  const dimensions = sizeConfig[size];

  const badge = (
    <Image
      alt="Verified Seller"
      className={className}
      height={dimensions}
      src="/Vector.png"
      width={dimensions}
    />
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">{badge}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified Seller</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
