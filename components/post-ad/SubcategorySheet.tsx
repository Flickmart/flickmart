import { useQuery } from 'convex/react';
import type React from 'react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import Loader from '../multipage/Loader';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import CustomSheetHeader from './CustomSheetHeader';
import SheetItems from './SheetItems';

export default function SubcategorySheet({
  children,
  category,
  closeSheet,
  setSubcategory,
}: {
  children: React.ReactNode;
  category: string;
  closeSheet: () => void;
  setSubcategory: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  
  const subcategories = useQuery(api.categories.getCategory, {
    category,
  });

  console.log(subcategories?.items[0]?.image);
  
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger className="capitalize">{children}</SheetTrigger>
      <SheetContent
        className="min-h-screen w-full p-0 pb-20 capitalize"
        hideCloseButton={true}
        side="left"
      >
        <CustomSheetHeader
          closeSheet={() => {
            setOpen(false);
          }}
          text={category}
        />
        {subcategories ? (
          <div className="flex h-[83vh] flex-col overflow-auto">
            {subcategories.items.map((item) => {
              return (
                <SheetItems
                  categoryName={item.title}
                  closeSheet={() => {
                    setOpen(false);
                    closeSheet();
                    setSubcategory(item.title);
                  }}
                  imageUrl={item.image}
                  key={item.title}
                  type="subcategories"
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-[83vh] items-center justify-center">
            <Loader />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
