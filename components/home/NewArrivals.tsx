import React from "react";
import Container from "./Container";
import NewArrivalItem from "./NewArrivalItem";
import { ArrowRight } from "lucide-react";

export default function NewArrivals() {
  return (
    <Container className="!flex items-center flex-col justify-start py-5 capitalize text-gray-800 space-y-5 ">
      <div className="w-5/6 flex justify-between ">
        <h2 className=" lg:text-3xl text-2xl  font-semibold">new arrivals</h2>
        <p className=" flex  space-x-2 ">
          <span className="pt-1.5 lg:pt-2 underline underline-offset-8 lg:text-base text-xs">
            more products
          </span>
          <ArrowRight className="text-gray-500 text-xs pt-1.5 lg:p-0" />
        </p>
      </div>
      <div className=" flex justify-between   lg:w-5/6 gap-x-5 w-full overflow-x-auto ">
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
