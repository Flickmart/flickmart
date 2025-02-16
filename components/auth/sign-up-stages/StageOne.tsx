"use client";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/auth/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/auth/ui/form";
import { Checkbox } from "@/components/auth/ui/checkbox";
import CustomInput from "@/components/auth/CustomInput";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import useUserStore from "@/store/useUserStore";
import { createUser } from "@/app/(auth-pages)/auth";

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
    createUser({ email: values.email, password: values.password }, "admin");
    setStage(2);
    updateEmail(values.email);
    console.log(values);
  };
  return (
    <main className="relative h-screen">
      <AuthHeader />
      <section className="form-grid">
        <Image
          src="/sign-up-illustration.svg"
          width={563}
          height={618}
          alt="sign in illustration"
          className="hidden lg:block lg:w-[550px]"
        />
        <div className="mt-16 container-px lg:mt-0">
          <h1 className="pb-5">Sign up</h1>
          <p className="font-light text-flickmart-gray">
            Already have an account?{" "}
            <Link
              className="capitalize font-medium text-flickmart hover:underline"
              href="/sign-in"
            >
              sign in
            </Link>
          </p>
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
              <Button className="submit-btn" type="submit">
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
