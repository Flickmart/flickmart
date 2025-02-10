import React from "react";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";

export default function NewArrivals() {
  return (
    <Container className="!flex items-center flex-col justify-start py-5 capitalize text-gray-800 space-y-5 ">
      <div className="w-5/6 flex justify-between ">
        <h2 className=" text-3xl  font-semibold">new arrivals</h2>
        <span className="font-light pt-2 underline underline-offset-8">
          more products
        </span>
      </div>
      <div className=" flex justify-between flex-grow w-5/6 gap-x-5">
        <NewArrivalItem image="sofa" name="loveseat sofa" price={199.0} />
        <NewArrivalItem image="generic-lamp" name="table lamp" price={24.99} />
        <NewArrivalItem
          image="beige-lamp"
          name="beige table lamp"
          price={124.99}
        />
        <NewArrivalItem image="toaster" name="toaster" price={224.99} />
      </div>
    </Container>
  );
}
