"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import Selector from "./Selector";
import AddPhoto from "./AddPhoto";
import { Separator } from "@radix-ui/react-select";
import AdPromotion from "./AdPromotion";
import { useOthersStore } from "@/store/useOthersStore";
import { useMutation as useMutationConvex, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import AdCharges from "./AdCharges";

type SubmitType = SubmitHandler<{
  category: string;
  location: "enugu" | "nsukka";
  exchange: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number | string;
  store: string;
  phone: string;
  plan: "basic" | "pro" | "premium";
}>;

type ErrorType = SubmitErrorHandler<{
  category: string;
  location: "enugu" | "nsukka";
  exchange: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number | string;
  store: string;
  phone: string;
  plan: "basic" | "pro" | "premium";
}>;

const categories = [
  "vehicles",
  "homes",
  "food",
  "mobiles",
  "appliances",
  "fashion",
  "electronics",
  "pets",
  "beauty",
  "services",
];
const location = ["enugu", "nsukka"];
const returnable = ["yes", "no"];
const condition = ["brand new", "used"];

const formSchema = z.object({
  category: z.string(),
  location: z.union([z.literal("enugu"), z.literal("nsukka")]),
  exchange: z.boolean(),
  condition: z.union([z.literal("brand new"), z.literal("used")]),
  title: z
    .string()
    .min(5, { message: "Title length is too short" })
    .max(100, { message: "Maximum character length reached" }),
  description: z
    .string()
    .min(30, { message: "Description is too short" })
    .max(900, { message: "Description cannot exceed 900 characters" }),
  price: z.union([
    z.string(),
    z.number({
      required_error: "Price is required",
    }),
  ]),
  store: z.string(),
  phone: z.string(),
  plan: z.union([z.literal("basic"), z.literal("pro"), z.literal("premium")]),
});

export default function PostAdForm({
  clear,
  setClear,
}: {
  clear: boolean;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      location: undefined,
      title: "",
      exchange: undefined,
      condition: undefined,
      description: "",
      price: 0,
      store: "",
      phone: "",
      plan: undefined,
    },
  });
  const { images } = useOthersStore((state) => state);
  const router = useRouter();
  const createNewAd = useMutationConvex(api.product.create);
  let postToastId: ReturnType<typeof toast.loading>;
  const [allowAdPost, setAllowAdPost] = useState<boolean>(false);
  const userStore = useQuery(api.store.getStoresByUserId)?.data;
  const businessId = userStore?._id as Id<"store">;
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [textAreaLength, setTextAreaLength] = useState<number>(0);
  const [adId, setAdId] = useState<Id<"product"> | undefined>();

  // Clear Form
  useEffect(() => {
    userStore?.name && form.setValue("store", userStore.name);
    userStore?.phone && form.setValue("phone", userStore.phone);
    // clear form
    if (clear) {
      setTextAreaLength(0);
      form.reset();
    }
  }, [clear, userStore]);

  // Form Submission
  const { mutate: adPostMutate, isPending } = useMutation({
    mutationFn: createNewAd,
    onSuccess: async (data) => {
      // Show success toast
      setAdId(data);

      // Show a loading toast for redirection
      toast.info("Redirecting to product page...");
      console.log("Ad ID:", data);
      router.push(`/product/${data}`);
    },
    onError: (err) => {
      toast.dismiss(postToastId);
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitType = async (formData) => {
    try {
      if (!userStore?._id) {
        toast.error("Please create a store first");
        return;
      }

      postToastId = toast.info("Posting Ad...");
      const modifiedObj = {
        ...formData,
        businessId,
        images,
        price: +formData.price,
      };
      adPostMutate(modifiedObj);

      // Only reset if everything was successful
      setIsSubmitted(true);
      setTextAreaLength(0);
      form.reset();
      toast.success("Ad posted successfully!");
    } catch (error) {
      toast.error("Failed to post ad");
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
          <AddPhoto
            setAllowAdPost={setAllowAdPost}
            setIsSubmitted={setIsSubmitted}
            isSubmitted={isSubmitted}
            clear={clear}
            setClear={setClear}
          />
          <Selector
            options={location}
            form={form}
            name="location"
            label="select location"
          />
          <InputField name="title" form={form} />
          <Selector
            form={form}
            options={returnable}
            name="exchange"
            label="exchange possible"
          />
          <Selector form={form} options={condition} name="condition" />
          <InputField
            name="description"
            form={form}
            type="textArea"
            textAreaLength={textAreaLength}
            setTextAreaLength={setTextAreaLength}
          />
          <InputField type="numberField" name="price" form={form} />
        </div>

        <Separator className="h-5 bg-gray-100 w-full" />

        <div className="bg-inherit lg:w-3/4 space-y-3 lg:space-y-6   lg:px-10 w-full p-5  ">
          <InputField
            name="store"
            form={form}
            disabled={true}
            val={userStore?.name}
          />
          <InputField
            name="phone"
            form={form}
            disabled={true}
            val={userStore?.phone}
          />
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
          <AdCharges
            plan={form.watch("plan") || "basic"}
            isPending={isPending}
            formTrigger={form.trigger}
            formSubmit={() => form.handleSubmit(onSubmit, onError)()}
            allowAdPost={allowAdPost}
            adId={adId}
          />
          <p className="lg:w-2/4 text-center font-light capitalize leading-relaxed lg:text-sm text-xs">
            By clicking on Post Ad you accepted the{" "}
            <span className="text-flickmart cursor-pointer">Sell Policy </span>
            confirm that you will abide by the safety tips and other terms and
            conditions
          </p>
        </div>
      </form>
    </Form>
  );
}
