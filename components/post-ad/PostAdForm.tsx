"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { Button } from "../auth/ui/button";
import { Form } from "../auth/ui/form";
import Selector from "./Selector";
import AddPhoto from "./AddPhoto";
import { Separator } from "@radix-ui/react-select";
import AdPromotion from "./AdPromotion";
import { postAd, uploadImage } from "@/app/post-ad/action";
import { useMutation } from "@tanstack/react-query";
import { useOthersStore } from "@/store/useOthersStore";
import toast from "react-hot-toast";
import { FormDataType } from "@/types/form";

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
  const { image, setLoadingStatus } = useOthersStore((state) => state);
  const [formData, setFormData] = useState<FormDataType | null>(null);

  // Form Submission
  const { mutate: imgUploadMutate } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
      const imgUrl = `https://tbgmruevxeutwcbwmvup.supabase.co/storage/v1/object/public/${data?.fullPath}`;

      // The full object to be inserted
      if (typeof formData?.title === "string") {
        const modifiedObj = { ...formData, image: imgUrl };
        postAdMutate(modifiedObj);
      }
    },
    onError: (err) => {
      toast.error(err.message);
      setLoadingStatus(false);
    },
  });

  const { mutate: postAdMutate } = useMutation({
    mutationFn: postAd,
    onSettled: () => setLoadingStatus(false),
  });

  const onSubmit: SubmitType = (e) => {
    try {
      setLoadingStatus(true);

      // store form data in state because we first need to upload image
      setFormData(e);
      imgUploadMutate(image);
    } finally {
      form.reset();
    }
  };

  const onError: ErrorType = (error) => {
    console.log(error);
  };

  // Prevent Default KeyPress Behavior
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
          <AddPhoto />
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
