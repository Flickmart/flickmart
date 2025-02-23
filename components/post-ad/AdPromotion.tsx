import React from "react";

const adPlans = [
  { type: "basic", duration: 3, amount: 20, percentage: 20 },
  { type: "premium", duration: 14, amount: 35, percentage: 50 },
  { type: "pro", duration: 30, amount: 100, percentage: 75 },
];

export default function AdPromotion() {
  return (
    <div className="min-h-[50vh] w-full lg:p-5 flex flex-col justify-between space-y-5">
      {adPlans.map((item) => (
        <div
          key={item.type}
          className="h-40  border-gray-200 border-2 duration-200 hover:border-flickmart/70 capitalize flex flex-col justify-between p-5"
        >
          <div className="flex justify-between">
            <span className="font-medium lg:text-xl">{item.type}</span>
            <span className="px-2 py-1 rounded-lg bg-green-500 text-white text-sm">
              {item.percentage}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className=" px-5 py-2 rounded-2xl text-sm text-orange-800 bg-orange-200">
              {item.duration} days
            </span>
            <span className="font-medium lg:text-2xl">
              &#8358;{item.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
