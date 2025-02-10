import React from "react";
import Container from "./Container";

export default function BestSellers() {
  return (
    <div className="text-center capitalize space-y-10">
      <h2 className=" text-3xl text-gray-800 font-semibold">best sellers</h2>
      <Container>
        <div className="grid grid-cols-4 w-5/6 grid-rows-2 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-800 h-72 w-5/6 rounded-lg">
              hello
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
