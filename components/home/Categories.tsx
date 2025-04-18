'use client';
import React, { useState } from "react";
import CategoryItem from "./CategoryItem";
import Container from "./Container";
import { categories } from "@/lib/data/categories";
import CategorySelector from "../CategorySelector";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const selectedData = categories.find(cat => cat.title === selectedCategory);

  const hidePanel: () => void = () => {
    console.log("Hiding panel");
    setSelectedCategory(null);
  };

  return (
    <Container>
      <div className="lg:w-4/6 grid lg:grid-cols-4 lg:grid-rows-3 grid-cols-3 lg:gap-x-3 lg:gap-y-6  gap-3 cursor-pointer">
        {categories.map((item) => (
          <CategoryItem
            key={item.title}
            categoryName={item.title}
            onClick={() => handleCategoryClick(item.title)}
            image={item.image}
          />
        ))}
        {selectedData && (
          <CategorySelector subcategories={selectedData.subcategories} onClick={hidePanel} />
        )}
      </div>
    </Container>
  );
}