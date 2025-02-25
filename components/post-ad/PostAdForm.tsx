"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { Button } from "../auth/ui/button";
import { Form } from "../auth/ui/form";
import Selector from "./Selector";
import AddPhoto from "./AddPhoto";
import { Separator } from "@radix-ui/react-select";
import AdPromotion from "./AdPromotion";
import { uploadImage } from "@/app/post-ad/action";
import { useMutation } from "@tanstack/react-query";

type SubmitType = SubmitHandler<{
  category: string;
  location: string;
  exchange: string;
  condition: string;
  title: string;
  description: string;
  price: string;
  store: string;
  phone: string;
  plan: string;
}>;

type ErrorType = SubmitErrorHandler<{
  category: string;
  location: string;
  exchange: string;
  condition: string;
  title: string;
  description: string;
  price: string;
  store: string;
  phone: string;
  plan: string;
}>;

const categories = ["electronics", "fashion", "beauty"];
const location = ["enugu", "nsukka"];
const exchange = ["bank transfer", "card", "ussd"];
const condition = ["brand new", "used"];

export default function PostAdForm() {
  const formSchema = z.object({
    category: z.string(),
    image: z
      .instanceof(File)
      .refine((file) => file.name, { message: "an image is required" }),
    location: z.string(),
    exchange: z.string(),
    condition: z.string(),
    title: z
      .string()
      .min(5, { message: "Title length is too short" })
      .max(100, { message: "Maximum character length reached" }),
    description: z.string().min(30, { message: "description is too short" }),
    price: z.string(),
    store: z.string(),
    phone: z.string(),
    plan: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      image: undefined,
      location: "",
      title: "",
      exchange: "",
      condition: "",
      description: "",
      price: "",
      store: "",
      phone: "",
      plan: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => console.log("j"),
  });
  const { mutate: postAdMutate } = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => console.log("j"),
  });

  const onSubmit: SubmitType = async (e) => {
    try {
      // mutate();
      alert("submitted");
      console.log(e);
    } catch (err) {
      console.log(err);
    } finally {
      form.reset();
    }
  };
  const onError: ErrorType = (error) => {
    console.log(error);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form
        onKeyDown={handleKeyPress}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="bg-white lg:w-5/6 w-full  grid place-items-center rounded-lg space-y-10"
      >
        <div className="bg-inherit lg:w-3/4 space-y-5 lg:p-10 w-full px-5 py-10   ">
          <Selector form={form} options={categories} name="category" />
          <AddPhoto form={form} />
          <Selector
            options={location}
            form={form}
            name="location"
            label="select location"
          />
          <InputField name="title" form={form} />
          <Selector
            form={form}
            options={exchange}
            name="exchange"
            label="exchange possible"
          />
          <Selector form={form} options={condition} name="condition" />
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
          <AdPromotion form={form} />
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
