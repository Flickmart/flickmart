"use client";
import React, { useState } from "react";
import { FormType } from "./InputField";

const adPlans = [
  { type: "basic", duration: 3, amount: 20, percentage: 20 },
  { type: "premium", duration: 14, amount: 35, percentage: 50 },
  { type: "pro", duration: 30, amount: 100, percentage: 75 },
];

export default function AdPromotion({ form }: { form: FormType }) {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { getValues } = form;
  const values = getValues();

  const handlePlan = (index: number) => {
    const plan = !index ? "basic" : index === 1 ? "premium" : "pro";

    if (activePlan === plan) {
      setActivePlan(null);
      form.setValue("plan", "");
    } else {
      setActivePlan(plan);
      form.setValue("plan", plan);
    }
  };

  return (
    <div className="min-h-[50vh] w-full lg:p-5 flex flex-col justify-between space-y-5">
      {adPlans.map((item, i) => (
        <div
          id={item.type}
          onClick={() => handlePlan(i)}
          key={item.type}
          className={`h-40 border-2 duration-200 capitalize flex flex-col justify-between p-5
            ${values.plan === item.type && "border-flickmart/70"}
            `}
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
