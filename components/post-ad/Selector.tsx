import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { FormField } from "../auth/ui/form";
import { FormType, NameType } from "@/types/form";

export default function Selector({
  name,
  options,
  label = "",
  form,
}: {
  name: NameType;
  options: Array<string>;
  label?: string;
  form: FormType;
}) {
  return (
    <div className="border border-gray-300 py-5 rounded-lg ">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          let value = "";
          if (typeof field.value === "string") {
            value = field.value;
          }
          return (
            <Select
              required
              onValueChange={field.onChange}
              {...field}
              defaultValue={value}
              value={value}
            >
              <SelectTrigger className="w-full flex text-lg justify-between capitalize outline-none  border-none shadow-none focus:ring-0">
                <SelectValue placeholder={`${label || name}*`} />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                align="center"
                className=" py-3  capitalize  rounded-lg shadow-lg "
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
