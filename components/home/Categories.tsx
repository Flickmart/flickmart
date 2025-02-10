import Image from "next/image";
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
    <Container>
      <div className="w-5/6 grid grid-cols-4 grid-rows-3 gap-2 ">
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
