"use client";

import { Button } from "@/components/ui/button";

interface PresetAmountsProps {
  onPresetClick: (value: string) => void;
}

const presetAmounts = [
  { label: "₦500.00", value: "500.00" },
  { label: "₦1,000.00", value: "1000.00" },
  { label: "₦2,000.00", value: "2000.00" },
  { label: "₦3,000.00", value: "3000.00" },
  { label: "₦5,000.00", value: "5000.00" },
];

export function PresetAmounts({ onPresetClick }: PresetAmountsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {presetAmounts.map((preset) => (
        <Button
          key={preset.value}
          variant="outline"
          size="sm"
          className="rounded-full text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          onClick={() => onPresetClick(preset.value)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}