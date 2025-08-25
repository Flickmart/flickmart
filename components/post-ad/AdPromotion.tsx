'use client';
import React, { useState } from 'react';
import type { FormType } from '@/types/form';

const adPlans = [
  { type: 'basic', duration: 3, amount: 20, percentage: 20 },
  { type: 'premium', duration: 14, amount: 50, percentage: 50 },
  { type: 'pro', duration: 30, amount: 100, percentage: 75 },
];

export default function AdPromotion({ form }: { form: FormType }) {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { getValues } = form;
  const values = getValues();

  const handlePlan = (index: number) => {
    const plan = index ? (index === 1 ? 'premium' : 'pro') : 'basic';

    if (activePlan === plan) {
      setActivePlan(null);
      form.setValue('plan', '' as 'basic');
    } else {
      setActivePlan(plan);
      form.setValue('plan', plan);
    }
  };

  return (
    <div className="flex min-h-[50vh] w-full flex-col justify-between space-y-5 lg:p-5">
      {adPlans.map((item, i) => (
        <div
          className={`flex h-40 flex-col justify-between border-2 p-5 capitalize duration-200 ${values.plan === item.type && 'border-flickmart/70'}
            `}
          id={item.type}
          key={item.type}
          onClick={() => handlePlan(i)}
        >
          <div className="flex justify-between">
            <span className="font-medium lg:text-xl">{item.type}</span>
            <span className="rounded-lg bg-green-500 px-2 py-1 text-sm text-white">
              {item.percentage}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="rounded-2xl bg-orange-200 px-5 py-2 text-orange-800 text-sm">
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
