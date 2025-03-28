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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/auth/CustomInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOthersStore } from "@/store/useOthersStore";
import { SignIn as Login } from '@clerk/nextjs'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false).optional(),
});

export default function SignIn() {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Just redirect to home page without authentication
    router.push("/home");
  };


  return (
    <main className="relative h-screen">
      {/* <Login /> */}
      <AuthHeader />
      <section className="form-grid">
        <Image
          priority
          src="/sign-in-illustration.svg"
          width={563}
          height={618}
          alt="sign in illustration"
          className="w-[450px] hidden lg:block lg:w-[500px]"
        />
        <div className="mt-16 container-px lg:mt-0 space-y-8">
          <h1 className="mb-5">Sign in</h1>
          <div className="bg-yellow-50 p-3 rounded-md text-yellow-700 text-sm">
            Authentication has been removed. You will be redirected to the home page automatically.
          </div>
          <Form {...form}>
            <form
              className="mt-8 space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
                          className="size-6 hover:border-flickmart transition-colors duration-300"
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
              <div className="flex items-center space-y-4 flex-col">
                <Button className="submit-btn" type="submit">
                  Sign In
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
            Don't have an account yet?{" "}
            <Link
              className="capitalize font-medium text-flickmart hover:underline"
              href="/sign-up"
            >
              sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
