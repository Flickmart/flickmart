"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-select";
import { useMutation } from "@tanstack/react-query";
import { useMutation as useMutationConvex, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useOthersStore } from "@/store/useOthersStore";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import AdCharges from "./AdCharges";
import AddPhoto from "./AddPhoto";
import AdPromotion from "./AdPromotion";
import CategorySheet from "./CategorySheet";
import InputField from "./InputField";
import Selector from "./Selector";

type SubmitType = SubmitHandler<{
  category: string;
  subcategory: string;
  location: "enugu" | "nsukka";
  negotiable: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number | string;
  store: string;
  phone: string;
  plan: "free" | "basic" | "pro" | "premium";
}>;

type ErrorType = SubmitErrorHandler<{
  category: string;
  subcategory: string;
  location: "enugu" | "nsukka";
  exchange: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number | string;
  store: string;
  phone: string;
  plan: "free" | "basic" | "pro" | "premium";
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
  subcategory: z.string(),
  location: z.union([z.literal("enugu"), z.literal("nsukka")]),
  negotiable: z.boolean(),
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
  plan: z.union([
    z.literal("free"),
    z.literal("basic"),
    z.literal("pro"),
    z.literal("premium"),
  ]),
});

export default function PostAdForm({
  clear,
  setClear,
}: {
  clear: boolean;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [basicDuration, setBasicDuration] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      location: undefined,
      title: "",
      negotiable: undefined,
      condition: undefined,
      description: "",
      price: 0,
      store: "",
      phone: "",
      plan: "pro",
    },
  });
  const { images } = useOthersStore((state) => state);
  const router = useRouter();
  const createNewAd = useMutationConvex(api.product.create);
  let postToastId: ReturnType<typeof toast.loading>;
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
        className="grid w-full place-items-center space-y-10 rounded-lg bg-white lg:w-5/6"
        onKeyDown={handleKeyPress}
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <div className="w-full space-y-5 bg-inherit px-5 py-10 lg:w-3/4 lg:p-10">
          <CategorySheet form={form} name="category" />
          <CategorySheet form={form} name="subcategory" />
          <AddPhoto
            clear={clear}
            isSubmitted={isSubmitted}
            setClear={setClear}
            setIsSubmitted={setIsSubmitted}
          />
          <Selector
            form={form}
            label="select location"
            name="location"
            options={location}
          />
          <InputField form={form} name="title" />
          <Selector
            form={form}
            label="negotiable"
            name="negotiable"
            options={returnable}
          />
          <Selector form={form} name="condition" options={condition} />
          <InputField
            form={form}
            name="description"
            setTextAreaLength={setTextAreaLength}
            textAreaLength={textAreaLength}
            type="textArea"
          />
          <InputField form={form} name="price" type="numberField" />
        </div>

        <Separator className="h-5 w-full bg-gray-100" />

        <div className="w-full space-y-3 bg-inherit p-5 lg:w-3/4 lg:space-y-6 lg:px-10">
          <InputField
            disabled={true}
            form={form}
            name="store"
            val={userStore?.name}
          />
          <InputField
            disabled={true}
            form={form}
            name="phone"
            val={userStore?.phone}
          />
        </div>

        <Separator className="h-5 w-full bg-gray-100" />

        <div className="flex w-full flex-col items-center justify-between space-y-5 p-5 lg:p-10 lg:pt-0">
          <div className="w-full space-y-2 capitalize">
            <h2 className="lg:text-xl font-bold">promote your ad</h2>
            <p className="font-light text-gray-400 text-sm">
              select a visibility rate and promote your ad
            </p>
          </div>
          <AdPromotion
            form={form}
            basicDuration={basicDuration}
            onBasicChange={(days: number) => setBasicDuration(days)}
          />
          <AdCharges
            basicDuration={basicDuration}
            adId={adId}
            formSubmit={() => form.handleSubmit(onSubmit, onError)()}
            formTrigger={form.trigger}
            images={images}
            isPending={isPending}
            plan={form.watch("plan") || "basic"}
          />
          <p className="text-center font-light text-xs capitalize leading-relaxed lg:w-2/4 lg:text-sm">
            By clicking on Post Ad you accepted the{" "}
            <span className="cursor-pointer text-flickmart">Sell Policy </span>
            confirm that you will abide by the safety tips and other terms and
            conditions
          </p>
        </div>
      </form>
    </Form>
  );
}
