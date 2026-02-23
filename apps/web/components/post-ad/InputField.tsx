'use client';
import type React from 'react';
import type { FormType, NameType } from '@/types/form';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type FieldType = {
  name: NameType;
  form: FormType;
  type?: 'textField' | 'textArea' | 'numberField';
};

const priceType = {
  originalPrice: 'Original price*',
  targetPrice: 'First Bargain Price*',
  targetPriceSecond: 'Second Bargain Price (Optional)',
};
export default function InputField({
  val,
  disabled,
  textAreaLength,
  setTextAreaLength,
  name,
  form,
  type = 'textField',
}: FieldType & {
  val?: string;
  disabled?: boolean;
  textAreaLength?: number;
  setTextAreaLength?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    formState: { errors },
  } = form;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        let value: string | number = '';

        if (
          typeof field.value === 'string' ||
          typeof field.value === 'number'
        ) {
          value = val || field.value;
        }

        return (
          <div className={`${type === 'textArea' && 'mt-5'}`}>
            {type === 'textArea' && (
              <span className="flex w-full justify-end text-gray-500 text-xs">
                <span
                  className={`${(textAreaLength ?? 0) > 900 ? 'text-red-500' : ''}`}
                >
                  {textAreaLength}
                </span>
                /900
              </span>
            )}
            <FormItem className={' '}>
              <FormControl>
                {type === 'textField' || type === 'numberField' ? (
                  <div>
                    <Input
                      className="lg:!text-lg w-full rounded-lg border border-gray-300 py-7 text-lg placeholder:text-gray-500 placeholder:capitalize lg:py-9"
                      disabled={disabled}
                      placeholder={`${name === 'phone' ? '08123456789' : Object.entries(priceType).find(([key, _value]) => key === name)?.[1] || `${name}*`}`}
                      required
                      type={type === 'numberField' ? 'number' : undefined}
                      {...field}
                      value={value}
                    />
                    <p className="py-3 font-medium text-red-500">
                      {errors[name]?.message}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Textarea
                      className="lg:!text-lg placeholder:text-gray-500 placeholder:text-lg placeholder:capitalize"
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        setTextAreaLength?.(target.value.length);
                      }}
                      placeholder={`${name}*`}
                      required
                      rows={8}
                      {...field}
                      value={val || value}
                    />
                    <p className="py-3 font-medium text-red-500">
                      {errors[name]?.message}
                    </p>
                  </div>
                )}
              </FormControl>
            </FormItem>
          </div>
        );
      }}
    />
  );
}
