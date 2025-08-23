'use client';

import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function SecurityHeader({
  showBackButton = false,
  onBack,
}: SecurityHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      {showBackButton && onBack && (
        <Button className="p-2" onClick={onBack} size="sm" variant="ghost">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <div className="ml-auto flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="font-medium text-green-600 text-sm">Secure</span>
      </div>
    </div>
  );
}
