import React from "react";
import CategoryItem from "./CategoryItem";
import Container from "./Container";

interface CategoryObj {
  categoryName: string;
}
const categoryItems: Array<CategoryObj> = [
  { categoryName: "vehicles" },
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
    <Container>
      <div className="w-full lg:w-full grid lg:grid-cols-5 lg:grid-rows-3 grid-cols-3 lg:gap-x-3 lg:gap-y-6  gap-3 cursor-pointer">
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
