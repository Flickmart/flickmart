'use client';
import { useState } from 'react';
import type { FormType } from '@/types/form';

const adStructure = [
  { type: 'basic', duration: [3, 7], amount: 200 },
  { type: 'pro', duration: [14], amount: 1000 },
  { type: 'premium', duration: [1], amount: 5000 },
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
    let plan: 'free' | 'basic' | 'pro' | 'premium' = 'pro';
    if (index === 0) {
      plan = 'free';
    }
    if (index === 1) {
      plan = 'basic';
    }
    if (index === 2) {
      plan = 'pro';
    }
    if (index === 3) {
      plan = 'premium';
    }

    if (activePlan === plan) {
      setActivePlan(null);
      onBasicChange(0);
      form.setValue('plan', '' as 'basic');
    } else {
      setActivePlan(plan);
      onBasicChange(plan === 'basic' ? 3 : 0);
      form.setValue('plan', plan);
    }
  };

  return (
    <div className="flex min-h-[50vh] w-full flex-col justify-between space-y-5 lg:p-5">
      <div
        className={`flex h-16 items-center justify-between rounded-xl border-2 p-4 capitalize ${values.plan === 'free' ? 'border-flickmart/70' : 'border-gray-300'}`}
        onClick={() => handlePlan(0)}
      >
        <span className="font-bold text-lg">free</span>
        <span className="font-medium text-gray-400 text-sm">no promo</span>
      </div>
      {adPlans.map((item, i) => (
        <div
          className={`flex h-32 justify-between rounded-xl border-2 px-4 py-3 capitalize duration-200 ${values.plan === item.type ? 'border-flickmart/70' : 'border-gray-300'}
            `}
          id={item.type}
          key={item.type}
          onClick={() => handlePlan(i + 1)}
        >
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between">
              <span className="font-bold text-lg lg:text-xl">{item.type}</span>
            </div>
            <div className="flex gap-3">
              {item.duration.map((duration, index) => {
                return (
                  <span
                    className={`cursor-pointer rounded-2xl border border-flickmartLight px-5 py-2 text-sm ${basicDuration === duration || (values.plan === item.type && item.type !== 'basic') ? 'border-none bg-flickmart text-white transition-all duration-300' : ''}`}
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'basic') {
                        setActivePlan('basic');
                        form.setValue('plan', 'basic');
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
                  >
                    {duration} {item.type === 'premium' ? 'month' : 'days'}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="font-bold text-xl lg:text-2xl">
              &#8358;{item.amount.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
