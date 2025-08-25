import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import type { FormType, NameType } from '@/types/form';
import { categoryItems } from '@/utils/constants';
import { FormField } from '../ui/form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import CustomSheetHeader from './CustomSheetHeader';
import SheetItems from './SheetItems';
import SubcategorySheet from './SubcategorySheet';

export default function CategorySheet({
  name,
  form,
}: {
  name: NameType;
  form: FormType;
}) {
  const [open, setOpen] = useState(false);
  const closeSheet = (value: string) => {
    form.setValue('category', value);
    setOpen(false);
  };

  function setSubcategory(value: string) {
    form.setValue('subcategory', value);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger
              className={
                'flex w-full items-center justify-between rounded-lg border border-gray-300 p-3.5 text-gray-500 text-lg capitalize shadow-none outline-none focus:ring-0'
              }
            >
              <span>{field.value || `${name}*`}</span>
              <div className="text-gray-400">
                <ChevronDown size={15} />
              </div>
            </SheetTrigger>
            <SheetContent
              className="mb-20 min-h-screen w-full bg-gray-200 p-0"
              hideCloseButton={true}
              side="left"
            >
              <CustomSheetHeader
                closeSheet={() => setOpen(false)}
                text="Find Category"
              />
              <div className="flex h-[83vh] flex-col overflow-auto">
                {categoryItems.map((item) => {
                  return (
                    <SubcategorySheet
                      category={item.categoryName}
                      closeSheet={() => closeSheet(item.categoryName)}
                      key={item.categoryName}
                      setSubcategory={setSubcategory}
                    >
                      <SheetItems
                        categoryName={item.categoryName}
                        type="categories"
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
