import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { FormField } from "../ui/form";
import { FormType, NameType } from "@/types/form";

export default function Selector({
  name,
  options,
  label = "",
  form,
  className = "",
}: {
  name: NameType;
  options: Array<string>;
  label?: string;
  form: FormType;
  className?: string;
}) {
  return (
    <div
      className="border border-gray-300 lg:py-5 py-2.5 rounded-lg"
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          let value= "";
          if (typeof field.value === "string" || typeof field.value === "boolean") {
            value = field.value === true ? "yes" : field.value === false? "no" : field.value;
          }
          return (
            <Select
              required
              onValueChange={(val) => { 
                const modVal  = val === "yes"? true : val === "no"? false : val;
                field.onChange(modVal);
              }}
              {...field}
              defaultValue={value}
              value={value}
            >
              <SelectTrigger className={`w-full  text-lg  capitalize outline-none  border-none shadow-none focus:ring-0 ${className}`}>
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
          );
        }}
      />
    </div>
  );
}
