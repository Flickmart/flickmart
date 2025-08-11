"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

interface SecurityHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function SecurityHeader({ showBackButton = false, onBack }: SecurityHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      {showBackButton && onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="text-sm text-green-600 font-medium">Secure</span>
      </div>
    </div>
  );
}