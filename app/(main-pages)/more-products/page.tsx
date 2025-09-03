"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

export default function MoreProducts() {
  const newProducts = useQuery(api.product.getNewProducts);
  console.log(newProducts);
  return (
    <div className="bg-orange-500 h-screen">
      {newProducts?.map((item) => (
        <div key={item._id}>
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
