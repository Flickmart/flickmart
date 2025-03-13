import { Dispatch } from "react";
import Link from "next/link";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import Selector from "../post-ad/Selector";
import InputField from "../post-ad/InputField";

const formSchema = z.object({
  businessName: z
    .string()
    .min(2, {
      message: "Business name must be at least 2 characters",
    })
    .max(50, {
      message: "Business name must be at most 50 characters.",
    }),
  location: z.string(),
});

const StageTwo = ({ setStage }: { setStage: Dispatch<number> }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
        <section className="space-y-2">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Username
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
          <Selector
            name="location"
            options={locations}
            label="location"
            form={form}
            className="text-sm"
          />
        </section>

        <button onClick={()=>{setStage(3)}} className="submit-btn text-white rounded-lg capitalize mb-4">
          next
        </button>
        <p className="font-light text-flickmart-gray text-center text-sm">
          Don't have an account yet?{" "}
          <Link
            className="capitalize font-medium text-flickmart hover:underline"
            href="/sign-up"
          >
            sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};
export default StageTwo;
