import React from "react";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { ChevronLeft } from "lucide-react";

export default function CustomSheetHeader({
  text,
  closeSheet,
}: {
  text: string;
  closeSheet: () => void;
}) {
  return (
    <SheetHeader className="shadow-md  bg-gray-100  w-full  ">
      <div className="h-[10vh] px-3 flex flex-row items-center  ">
        <div
          onClick={() => closeSheet()}
          className="p-2 text-flickmart hover:bg-flickmart/5 transition-all duration-500 ease-in-out rounded-full grid place-items-center"
        >
          <ChevronLeft size={30} />
        </div>
        <SheetTitle className="text-left  text-gray-500 font-normal text-sm">
          {text}
        </SheetTitle>
      </div>
    </SheetHeader>
  );
}
