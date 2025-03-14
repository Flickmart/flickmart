"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/auth/CustomInput";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import useUserStore from "@/store/useUserStore";


const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  agreeWithPrivacyPolicyAndTermsOfUse: z.boolean().refine((val) => val, {
    message: "Please check the field above",
  }),
});

export default function StageOne({
  setStage,
}: {
  setStage: Dispatch<SetStateAction<number>>;
}) {
  const updateEmail = useUserStore((state) => state.updateEmail);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeWithPrivacyPolicyAndTermsOfUse: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setStage(2);
    updateEmail(values.email);
    console.log(values);
  };

  return (
    <main className="relative min-h-screen">
      <AuthHeader />
      <section className="form-grid">
        <Image
          src="/sign-up-illustration.svg"
          width={563}
          height={618}
          alt="sign in illustration"
          className="hidden lg:block lg:w-[550px]"
        />
        <div className="mt-16 container-px lg:mt-0 lg:overflow-x-auto lg:h-[95vh]">
          <h1 className="pt-5">Sign up</h1>

          <Form {...form}>
            <form
              className="mt-8 space-y-8 pb-20 lg:pb-0"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CustomInput
                name="firstName"
                control={form.control}
                placeholder="First Name"
              />
              <CustomInput
                name="lastName"
                control={form.control}
                placeholder="Last Name"
              />
              <CustomInput
                name="email"
                control={form.control}
                placeholder="Email address"
              />
              <CustomInput
                name="password"
                control={form.control}
                placeholder="Password"
              />
              <FormField
                control={form.control}
                name="agreeWithPrivacyPolicyAndTermsOfUse"
                render={({ field }) => (
                  <FormItem className=" mt-8">
                    <div className="flex items-center gap-3 text-flickmart-gray">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="size-6 hover:border-flickmart transition-colors duration-300"
                        />
                      </FormControl>
                      <FormLabel className="font-light !m-0 text-xs text-flickmart-gray">
                        I agree with{" "}
                        <Link
                          className="text-flickmart font-semibold hover:underline"
                          href=""
                        >
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          className="text-flickmart font-semibold hover:underline"
                          href=""
                        >
                          Terms of Use
                        </Link>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-y-4 flex-col pb-3">
                <Button className="submit-btn" type="submit">
                  Sign Up
                </Button>
                <Image
                  onClick={()=>{}}
                  src="/icons/google.png"
                  alt="google"
                  width={500}
                  height={500}
                  className="h-10 w-10  object-cover rounded-full hover cursor-pointer hover:bg-black/5 duration-300"
                />
              </div>
            </form>
          </Form>
          <p className="font-light text-flickmart-gray text-center">
            Already have an account?{" "}
            <Link
              className="capitalize font-medium text-flickmart hover:underline"
              href="/sign-in"
            >
              sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
