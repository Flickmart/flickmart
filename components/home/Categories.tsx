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
    <Container className={"!min-h-0 pt-8 pb-4"}>
      <div className="grid grid-cols-4 cursor-pointer w-full justify-between max-w-[370px] sm:max-w-none sm:w-auto gap-x-4 gap-y-3 sm:gap-x-7 lg:gap-y-6 lg:gap-x-10">
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
