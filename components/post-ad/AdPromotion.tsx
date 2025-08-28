"use client";
import React, { useState } from "react";
import type { FormType } from "@/types/form";

const adStructure = [
  { type: "basic", duration: [3, 7], amount: 200 },
  { type: "pro", duration: [14], amount: 1000 },
  { type: "premium", duration: [1], amount: 5000 },
];

export default function AdPromotion({
  form,
  basicDuration,
  onBasicChange,
}: {
  form: FormType;
  basicDuration: number;
  onBasicChange: (days: number) => void;
}) {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { getValues } = form;
  const values = getValues();
  const [adPlans, setAdPlans] = useState(adStructure);

  const handlePlan = (index: number) => {
    let plan: "free" | "basic" | "pro" | "premium" = "pro";
    if (index === 0) plan = "free";
    if (index === 1) plan = "basic";
    if (index === 2) plan = "pro";
    if (index === 3) plan = "premium";

    if (activePlan === plan) {
      setActivePlan(null);
      onBasicChange(0);
      form.setValue("plan", "" as "basic");
    } else {
      setActivePlan(plan);
      onBasicChange(plan === "basic" ? 3 : 0);
      form.setValue("plan", plan);
    }
  };

  return (
    <div className="flex min-h-[50vh] w-full flex-col justify-between space-y-5 lg:p-5">
      <div
        onClick={() => handlePlan(0)}
        className={`flex justify-between   border-2 rounded-xl h-16 items-center p-4 capitalize  ${values.plan === "free" ? "border-flickmart/70" : "border-gray-300"}`}
      >
        <span className="font-bold text-lg">free</span>
        <span className="text-sm text-gray-400 font-medium">no promo</span>
      </div>
      {adPlans.map((item, i) => (
        <div
          className={`flex h-32  justify-between rounded-xl  border-2 py-3 px-4 capitalize duration-200 ${values.plan === item.type ? "border-flickmart/70" : "border-gray-300"}
            `}
          id={item.type}
          key={item.type}
          onClick={() => handlePlan(i + 1)}
        >
          <div className=" flex flex-col justify-between flex-1">
            <div className="flex justify-between">
              <span className="font-bold text-lg lg:text-xl">{item.type}</span>
            </div>
            <div className="flex gap-3">
              {item.duration.map((duration, index) => {
                return (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === "basic") {
                        setActivePlan("basic");
                        form.setValue("plan", "basic");
                        onBasicChange(duration);
                        setAdPlans((prev) =>
                          [...prev].map((plan, idx) => {
                            if (idx === 0) {
                              return {
                                ...plan,
                                amount: duration === 3 ? 200 : 300,
                              };
                            }
                            return plan;
                          })
                        );
                      }
                    }}
                    key={index}
                    className={`rounded-2xl cursor-pointer   px-5 py-2 border-flickmartLight border text-sm ${basicDuration === duration || (values.plan === item.type && item.type !== "basic") ? "transition-all duration-300 bg-flickmart text-white border-none" : ""}`}
                  >
                    {duration} {item.type === "premium" ? "month" : "days"}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <span className="font-bold text-xl lg:text-2xl">
              &#8358;{item.amount.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
