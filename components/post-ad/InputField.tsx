"use client";
import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FormType, NameType } from "@/types/form";

type FieldType = {
  name: NameType;
  form: FormType;
  type?: "textField" | "textArea";
};

export default function InputField({
  val,
  disabled,
  textAreaLength,
  setTextAreaLength,
  name,
  form,
  type = "textField",
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
        let value ="";
        if (typeof field.value === "string") {
          value =val || field.value;
        }
        return (
          <div className={`${type === "textArea" && "mt-5"}`}>
            {type === "textArea" && (
              <span className="text-xs text-gray-500  w-full flex justify-end">
                {textAreaLength}/300
              </span>
            )}
            <FormItem className={` `}>
              <FormControl>
                {type === "textField" ? (
                  <div>
                    <Input
                      disabled={disabled}
                      required
                      className="w-full placeholder:capitalize  border lg:!text-lg  border-gray-300 rounded-lg  py-7 lg:py-9 text-lg placeholder:text-gray-500"
                      placeholder={`${name === "phone" ? "08123456789" : `${name}*`}`}
                      {...field}
                      value={value}
                    />
                    <p className="py-3 font-medium  text-red-500">
                      {errors[name]?.message}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Textarea
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        setTextAreaLength?.(target.value.length);
                      }}
                      placeholder={`${name}*`}
                      className="placeholder:capitalize placeholder:text-lg h-48 placeholder:text-gray-500 lg:!text-lg"
                      {...field}
                      value={val || value}
                    />
                    <p className="capitalize py-3 font-medium  text-red-500">
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
