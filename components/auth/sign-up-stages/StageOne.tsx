"use client";
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
import React, { Dispatch, SetStateAction, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from '@clerk/types'
import { toast } from "sonner";
import MobileHeader from "@/components/MobileHeader";

export const formSchema = z.object({
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
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp } = useSignUp();

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

  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp?.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/home',
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors)
        console.error(err, null, 2)
      })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      // Start the sign-up process with Clerk
      await signUp.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.email,
        password: values.password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Update email in the store for use in next stage
      updateEmail(values.email);

      // Move to the next stage
      setStage(2);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "An error occurred during sign up");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="relative min-h-screen">
      <MobileHeader/>
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
                {/* captcha to protect from bots */}
              <div id="clerk-captcha"></div>
                <Button
                  className="submit-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Sign Up"}
                </Button>
                <Button
                  className="w-full border-2 border-flickmart h-12 mt-8 hover:bg-flickmart text-base font-medium text-flickmart !bg-white duration-300"
                  variant="secondary"
                  type="button"
                  onClick={() => signUpWith('oauth_google')}
                >
                  <Image
                    src="/icons/google.png"
                    alt="google"
                    width={500}
                    height={500}
                    className="h-10 w-10 object-cover rounded-full hover cursor-pointer hover:bg-black/5 duration-300"
                  />
                  Sign in with Google
                </Button>
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
