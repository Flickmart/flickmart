"use client";

import { resetPasswordAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import CustomInput from "@/components/auth/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import AuthHeader from "@/components/auth/AuthHeader";
import { Form } from "@/components/ui/form";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <main>
      <AuthHeader />
      <section className="form-grid">
        <Image
          src="/reset-password.svg"
          width={563}
          height={618}
          alt="sign in illustration"
          className="w-[450px] hidden lg:block lg:w-[500px]"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-full [&>input]:mb-4 container-px mt-8"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-medium mb-5">Reset password</h1>
              <p className="text-sm text-flickmart-gray">
                Password must be different from the last one
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <CustomInput
                name="newPassword"
                control={form.control}
                placeholder="New Password"
              />
              <CustomInput
                name="confirmPassword"
                control={form.control}
                placeholder="Confirm Password"
              />
            </div>
            <SubmitButton
              className="submit-btn !mt-20"
              // formAction={resetPasswordAction}
            >
              Reset password
            </SubmitButton>
          </form>
        </Form>
      </section>
    </main>
  );
}
