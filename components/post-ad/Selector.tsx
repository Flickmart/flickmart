import React from 'react';
import type { FormType, NameType } from '@/types/form';
import { FormField } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function Selector({
  name,
  options,
  label = '',
  form,
  className = '',
}: {
  name: NameType;
  options: Array<string>;
  label?: string;
  form: FormType;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-300 py-2.5 lg:py-5">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          let value = '';
          if (
            typeof field.value === 'string' ||
            typeof field.value === 'boolean'
          ) {
            value =
              field.value === true
                ? 'yes'
                : field.value === false
                  ? 'no'
                  : field.value;
          }
          return (
            <Select
              onValueChange={(val) => {
                const modVal =
                  val === 'yes' ? true : val === 'no' ? false : val;
                field.onChange(modVal);
              }}
              required
              {...field}
              defaultValue={value}
              value={value}
            >
              <SelectTrigger
                className={`w-full border-none text-lg capitalize shadow-none outline-none focus:ring-0 ${className}`}
              >
                <SelectValue placeholder={`${label || name}*`} />
              </SelectTrigger>
              <SelectContent
                align="center"
                className="rounded-lg py-3 capitalize shadow-lg"
                side="bottom"
              >
                {options.map((item) => (
                  <SelectItem
                    className="rounded-lg px-5 py-3 hover:bg-slate-100"
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
}
