import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import CustomSheetHeader from "./CustomSheetHeader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SheetItems from "./SheetItems";
import Loader from "../multipage/Loader";

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
  console.log(subcategories?.items[0].image);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="capitalize">{children}</SheetTrigger>
      <SheetContent
        hideCloseButton={true}
        side="left"
        className="w-full capitalize min-h-screen p-0 pb-20 "
      >
        <CustomSheetHeader
          text={category}
          closeSheet={() => {
            setOpen(false);
          }}
        />
        {!subcategories ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div className="h-[83vh] flex flex-col  overflow-auto">
            {subcategories.items.map((item) => {
              return (
                <SheetItems
                  closeSheet={() => {
                    setOpen(false);
                    closeSheet();
                    setSubcategory(item.title);
                  }}
                  type="subcategories"
                  imageUrl={item.image}
                  key={item.title}
                  categoryName={item.title}
                />
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
