'use client';

import { Button } from '@/components/ui/button';

interface PresetAmountsProps {
  onPresetClick: (value: string) => void;
}

const presetAmounts = [
  { label: '₦500.00', value: '500.00' },
  { label: '₦1,000.00', value: '1000.00' },
  { label: '₦2,000.00', value: '2000.00' },
  { label: '₦3,000.00', value: '3000.00' },
  { label: '₦5,000.00', value: '5000.00' },
  { label: '₦10,000.00', value: '10000.00' },
];

export function PresetAmounts({ onPresetClick }: PresetAmountsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 md:mb-8">
      {presetAmounts.map((preset) => (
        <Button
          className="rounded-full border-gray-300 bg-transparent px-1 py-2 text-gray-700 text-xs hover:bg-gray-50 md:px-4 md:text-sm"
          key={preset.value}
          onClick={() => onPresetClick(preset.value)}
          size="sm"
          variant="outline"
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
