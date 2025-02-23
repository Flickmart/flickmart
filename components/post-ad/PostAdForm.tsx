"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { Button } from "../auth/ui/button";
import { Form } from "../auth/ui/form";
import Selector from "./Selector";
import AddPhoto from "./AddPhoto";
import { Separator } from "@radix-ui/react-select";
import AdPromotion from "./AdPromotion";

const categories = ["electronics", "fashion", "beauty"];
const location = ["nigeria", "ghana", "south africa", "niger", "kenya"];

export default function PostAdForm() {
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Title length is too short" })
      .max(100, { message: "Maximum character length reached" }),
    description: z.string().min(30, { message: "description is too short" }),
    price: z.string(),
    store: z.string(),
    phone: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      store: "",
      phone: "",
    },
  });

  function onSubmit() {
    console.log("Form Submitted");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white lg:w-5/6 w-full  grid place-items-center rounded-lg space-y-10"
      >
        <div className="bg-inherit lg:w-3/4 space-y-5 lg:p-10 w-full px-5 py-10   ">
          <Selector options={categories} label="category" />
          <AddPhoto />
          <Selector options={location} label="select location" />
          <InputField name="title" form={form} />
          <Selector options={location} label="exchange possible" />
          <Selector options={location} label="condition" />
          <InputField name="description" form={form} type="textArea" />
          <InputField name="price" form={form} />
        </div>

        <Separator className="h-5 bg-gray-100 w-full" />

        <div className="bg-inherit lg:w-3/4  space-y-6   lg:px-10 w-full p-5  ">
          <InputField name="store" form={form} />
          <InputField name="phone" form={form} />
        </div>

        <Separator className="h-5 bg-gray-100 w-full" />

        <div className="w-full lg:p-10 lg:pt-0 p-5 flex justify-between items-center flex-col space-y-5">
          <div className="space-y-2 w-full capitalize">
            <h2 className="lg:text-xl">promote your ad</h2>
            <p className="text-sm text-gray-400 font-light">
              select a visibility rate and promote your ad
            </p>
          </div>
          <AdPromotion />
          <Button
            type="submit"
            className="capitalize  bg-flickmart w-full py-9 lg:rounded-none text-xl"
          >
            post ad
          </Button>
          <p className="lg:w-2/4 text-center font-light capitalize leading-relaxed lg:text-sm text-xs">
            By clicking on Post Ad you accepted the{" "}
            <span className="text-flickmart">Sell Policy </span>
            confirm that you will abide by the safety tips and other terms and
            conditions
          </p>
        </div>
      </form>
    </Form>
  );
}
