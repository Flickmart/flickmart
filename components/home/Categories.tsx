import React from "react";
import CategoryItem from "./CategoryItem";
import Container from "./Container";

interface CategoryObj {
  categoryName: string;
}
const categoryItems: Array<CategoryObj> = [
  { categoryName: "vehicles" },
  { categoryName: "homes" },
  { categoryName: "food" },
  { categoryName: "mobiles" },
  { categoryName: "appliances" },
  { categoryName: "fashion" },
  { categoryName: "electronics" },
  { categoryName: "pets" },
  { categoryName: "beauty" },
  { categoryName: "services" },
];

export default function Categories() {
  return (
    <Container className={"pt-4 sm:pt-8 pb-4 !min-h-[35vh] sm:!min-h-[50vh]"}>
      <div className="grid grid-cols-4 grid-rows-3 w-full gap-x-[10px] gap-y-2 lg:w-4/6">
        {categoryItems.map((item) => (
          <CategoryItem
            key={item.categoryName}
            categoryName={item.categoryName}
          />
        ))}
      </div>
    </Container>
  );
}
