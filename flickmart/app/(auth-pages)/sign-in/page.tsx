"use client";
import LoginHeader from "@/components/auth/LoginHeader";
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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/auth/CustomInput";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false).optional(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <main className="relative h-screen">
      <LoginHeader />
      <section className="lg:grid lg:grid-cols-2 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:px-8 lg:max-w-[1140px] lg:items-center">
        <Image
          src="/sign-in-illustration.svg"
          width={563}
          height={618}
          alt="sign in illustration"
          className="w-[450px] hidden lg:block lg:w-[500px]"
        />
        <div className="mt-16 container-px lg:mt-0">
          <h1 className="pb-5">Sign in</h1>
          <p className="font-light text-flickmart-gray">
            Don't have an account yet?{" "}
            <Link
              className="capitalize font-medium text-flickmart hover:underline"
              href="/sign-up"
            >
              sign up
            </Link>
          </p>
          <Form {...form}>
            <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-3 text-flickmart-gray">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="size-6"
                        />
                      </FormControl>
                      <FormLabel className="font-light text-base !m-0">
                        Remember me
                      </FormLabel>
                    </div>
                    <Link
                      className="!m-0 text-sm font-semibold hover:text-flickmart duration-300"
                      href="forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </FormItem>
                )}
              />
              <Button
                className="w-full border-2 border-flickmart h-12 mt-8 bg-flickmart text-base font-medium hover:text-flickmart hover:bg-white duration-300"
                type="submit"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
