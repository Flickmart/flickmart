import React from "react";
import Container from "./Container";

export default function BestSellers() {
  return (
    <div className="text-center capitalize lg:space-y-10 space-y-5">
      <h2 className=" lg:text-3xl text-2xl text-gray-800 font-semibold">
        best sellers
      </h2>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:w-5/6 w-full grid-rows-2 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-800 h-72 lg:w-5/6 rounded-lg">
              hello
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
