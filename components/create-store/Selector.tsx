import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { UseFormReturn } from "react-hook-form";

interface FormType {
  businessName: string;
  location: string;
  address: string;
  phoneNumber: string & { __tag: "E164Number" };
}

export default function Selector({
  name,
  options,
  label = "",
  form,
  className = "",
}: {
  name: "businessName" | "location" | "address" | "phoneNumber";
  options: Array<string>;
  label?: string;
  form: UseFormReturn<FormType>;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        let value = "";
        if (typeof field.value === "string") {
          value = field.value;
        }
        return (
          <FormItem>
            <div className="border border-gray-300 lg:py- py-2.5 rounded-lg">
              <Select
                required
                onValueChange={field.onChange}
                {...field}
                defaultValue={value}
                value={value}
              >
                <SelectTrigger
                  className={`w-full  text-lg  capitalize outline-none  border-none shadow-none focus:ring-0 ${className}`}
                >
                  <SelectValue placeholder={`${label || name}*`} />
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  align="center"
                  className=" py-3  capitalize  rounded-lg shadow-lg"
                >
                  {options.map((item) => (
                    <SelectItem
                      className="hover:bg-slate-100 px-5 py-3 rounded-lg"
                      value={item}
                      key={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
