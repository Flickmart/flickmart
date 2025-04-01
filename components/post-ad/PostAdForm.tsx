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
import { FormDataType } from "@/types/form";
import { useMutation as useMutationConvex, useQuery} from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { ClipLoader } from "react-spinners";

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

const categories = ["electronics", "fashion", "beauty"];
const location = ["enugu", "nsukka"];
const returnable = ["yes", "no"];
const condition = ["brand new", "used"];

export default function PostAdForm({clear, setClear}: {
    clear: boolean;
    setClear: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const formSchema = z.object({
    category: z.string(),
    location: z.union([z.literal("enugu"), z.literal("nsukka")]),
    exchange: z.boolean(),
    condition: z.union([z.literal("brand new"), z.literal("used")]),
    title: z
      .string()
      .min(5, { message: "Title length is too short" })
      .max(100, { message: "Maximum character length reached" }),
    description: z.string().min(30, { message: "description is too short" }),
    price: z.union([z.string(), z.number({
      required_error: "Price is required",
    })]),
    store: z.string(),
    phone: z.string(),
    plan: z.union([z.literal("basic"), z.literal("pro"), z.literal("premium")]),
  });
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
  const router= useRouter()
  const createNewAd= useMutationConvex(api.product.create)
  let postToastId: ReturnType<typeof toast.loading>;
  const [allowAdPost, setAllowAdPost]= useState<boolean>(false)
  const userStore =  useQuery(api.store.getStoresByUserId);
  const businessId = userStore?.[0]?._id as Id<"store">
  const [isSubmitted, setIsSubmitted]= useState<boolean>(false)
  const [textAreaLength, setTextAreaLength] = useState<number>(0);

  // Clear Form
  useEffect(()=>{
    if(clear){
      setTextAreaLength(0)
      form.reset()
    }

  }, [clear])

  // Form Submission
  const { mutate: adPostMutate, isPending } = useMutation({
    mutationFn: createNewAd,
    onSuccess: () => {
      // Show success toast
      toast.success("Ad posted successfully...",{ 
        duration: 2000
      })

      // Show a loading toast for redirection
      setTimeout(() => {
        toast.loading("Redirecting to home...", { duration: 3000 });
      }, 2000);

      // Short delay before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 6000);
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => toast.dismiss(postToastId),
  });

  const onSubmit: SubmitType = (e) => {
    try {
      if (!userStore?.[0]?._id) {
        toast.error("Please create a store first");
        return;
      }
      postToastId= toast.loading("Posting Ad...")
      const modifiedObj = {...e, businessId, images, price: +e.price}
      adPostMutate(modifiedObj);
    } finally {
      setIsSubmitted(true)
      setTextAreaLength(0)
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
            form={form} type="textArea" 
            textAreaLength={textAreaLength}
            setTextAreaLength={setTextAreaLength}
           />
          <InputField name="price" form={form} />
        </div>

        <Separator className="h-5 bg-gray-100 w-full" />

        <div className="bg-inherit lg:w-3/4 space-y-3 lg:space-y-6   lg:px-10 w-full p-5  ">
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
            disabled={isPending || !allowAdPost}
            type="submit"
            className="capitalize  bg-flickmart w-full py-7 lg:py-9 lg:rounded-none text-xl"
          >
            {isPending? <ClipLoader/> :"post ad"}
          </Button>
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
