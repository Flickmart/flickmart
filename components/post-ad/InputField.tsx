import React, { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../auth/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../auth/ui/input";
import { Textarea } from "../ui/textarea";

type NameType = "title" | "description" | "price" | "store" | "phone";

type FieldType = {
  name: NameType;
  form: UseFormReturn<{
    title: string;
    description: string;
    price: string;
    store: string;
    phone: string;
  }>;
  type?: "textField" | "textArea";
};

export default function InputField({
  name,
  form,
  type = "textField",
}: FieldType) {
  const [textAreaLength, setTextAreaLength] = useState<number>(0);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className={`${type === "textArea" && "mt-5"}`}>
          {type === "textArea" && (
            <span className="text-xs text-gray-500  w-full flex justify-end">
              {textAreaLength}/300
            </span>
          )}
          <FormItem className={` border  border-gray-300 rounded-lg `}>
            <FormControl>
              {type === "textField" ? (
                <Input
                  className="w-full placeholder:capitalize border-none py-9 text-lg placeholder:text-gray-400"
                  placeholder={`${name}*`}
                  {...field}
                />
              ) : (
                <Textarea
                  placeholder={`${name}*`}
                  className="placeholder:capitalize placeholder:text-lg h-48 placeholder:text-gray-400 lg:!text-lg"
                />
              )}
            </FormControl>
          </FormItem>
        </div>
      )}
    />
  );
}
