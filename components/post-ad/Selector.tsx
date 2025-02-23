import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

export default function Selector({
  options,
  label,
}: {
  options: Array<string>;
  label: string;
}) {
  return (
    <div className="border border-gray-300 p-5 rounded-lg ">
      <Select>
        <SelectTrigger className="w-full flex text-lg justify-between capitalize outline-none text-gray-400">
          <SelectValue placeholder={`${label}*`} />
          <ChevronRightIcon />
        </SelectTrigger>
        <SelectContent className=" w-full bg-white p-5 space-y-5 capitalize  rounded-lg shadow-lg ">
          {options.map((item) => (
            <SelectItem value="item" key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
