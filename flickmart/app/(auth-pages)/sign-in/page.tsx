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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
    <main>
      <LoginHeader />
      <section className="container mt-16">
        <h1 className="pb-5">Sign in</h1>
        <p className="font-light text-flickmart-gray">
          Don't have an account yet?{" "}
          <Link
            className="capitalize text-black font-medium hover:text-flickmart transition-colors duration-300"
            href="/sign-up"
          >
            sign up
          </Link>
        </p>
        <Form {...form}>
          <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-form-label">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="auth-input"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-form-label">password</FormLabel>
                  <FormControl>
                    <Input
                      className="auth-input"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      </section>
    </main>
  );
}
