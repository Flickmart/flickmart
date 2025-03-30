import { Dispatch } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import parsePhoneNumberFromString from "libphonenumber-js";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import Selector from "./Selector";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const formSchema = z.object({
  businessName: z
    .string()
    .min(2, {
      message: "Business name must be at least 2 characters",
    })
    .max(50, {
      message: "Business name must be at most 50 characters.",
    }),
  location: z
    .string()
    .refine((value) => value, { message: "Please select a location" }),
  address: z
    .string()
    .min(3, {
      message: "Address must be at least 2 characters",
    })
    .max(50, {
      message: "Address must be at most 50 characters",
    }),
  phoneNumber: z.string().transform((arg, ctx) => {
    const phone = parsePhoneNumberFromString(arg, {
      // set this to use a default country when the phone number omits country code
      defaultCountry: "NG",

      // set to false to require that the whole string is exactly a phone number,
      // otherwise, it will search for a phone number anywhere within the string
      extract: false,
    });

    // when it's good
    if (phone && phone.isValid()) {
      return phone.number;
    }

    // when it's not
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid phone number",
    });
    return z.NEVER;
  }),
});

const StageTwo = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const create = useMutation(api.store.createStore);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      location: "",
      address: "",
      phoneNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const promise = create({
      name: values.businessName,
      location: values.location,
      description: values.address,
    });
    toast.promise(promise, {
      loading: "Saving store details...",
      success: "Details saved  succesfully",
      error: "Failed to create store",
    });
    setStage(3);
    console.log(values);
  }
  const locations: string[] = ["enugu", "nsukka"];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="capitalize font-medium text-3xl mb-1 md:text-4xl">
          Create store
        </h2>
        <p className="text-sm font-light text-flickmart-gray mb-8 md:text-base">
          Fill in the form to create your store
        </p>
        <section className="space-y-2 text-left">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Business Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[56px]"
                    placeholder="Business name*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[56px]"
                    placeholder="Address*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Selector
            name="location"
            options={locations}
            label="location"
            form={form}
            className="text-sm"
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Phone number
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[56px]"
                    placeholder="Phone Number*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <button className="submit-btn text-white rounded-lg capitalize mb-4">
          next
        </button>
      </form>
    </Form>
  );
};
export default StageTwo;
