import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { SheetHeader, SheetTitle } from '../ui/sheet';

export default function CustomSheetHeader({
  text,
  closeSheet,
}: {
  text: string;
  closeSheet: () => void;
}) {
  return (
    <SheetHeader className="w-full bg-gray-100 shadow-md">
      <div className="flex h-[10vh] flex-row items-center px-3">
        <div
          className="grid place-items-center rounded-full p-2 text-flickmart transition-all duration-500 ease-in-out hover:bg-flickmart/5"
          onClick={() => closeSheet()}
        >
          <ChevronLeft size={30} />
        </div>
        <SheetTitle className="text-left font-normal text-gray-500 text-sm">
          {text}
        </SheetTitle>
      </div>
    </SheetHeader>
  );
}
