import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { categoryItems } from "@/utils/constants";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SubcategorySheet from "./SubcategorySheet";
import CustomSheetHeader from "./CustomSheetHeader";
import SheetItems from "./SheetItems";
import { FormField } from "../ui/form";
import { FormType, NameType } from "@/types/form";

export default function CategorySheet({
  name,
  form,
}: {
  name: NameType;
  form: FormType;
}) {
  const [open, setOpen] = useState(false);
  const closeSheet = (value: string) => {
    form.setValue("category", value);
    setOpen(false);
  };

  function setSubcategory(value: string) {
    form.setValue("subcategory", value);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={`w-full flex justify-between text-gray-500 p-3.5 items-center text-lg rounded-lg    capitalize outline-none  border border-gray-300 shadow-none focus:ring-0`}
            >
              <span>{field.value || `${name}*`}</span>
              <div className="text-gray-400">
                <ChevronDown size={15} />
              </div>
            </SheetTrigger>
            <SheetContent
              hideCloseButton={true}
              side="left"
              className="w-full min-h-screen  bg-gray-200 p-0 mb-20 "
            >
              <CustomSheetHeader
                closeSheet={() => setOpen(false)}
                text="Find Category"
              />
              <div className="h-[83vh] flex flex-col  overflow-auto">
                {categoryItems.map((item) => {
                  return (
                    <SubcategorySheet
                      closeSheet={() => closeSheet(item.categoryName)}
                      key={item.categoryName}
                      category={item.categoryName}
                      setSubcategory={setSubcategory}
                    >
                      <SheetItems
                        type="categories"
                        categoryName={item.categoryName}
                      />
                    </SubcategorySheet>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    />
  );
}
