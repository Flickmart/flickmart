"use client";



import { SubmitButton } from "@/components/submit-button";
import CustomInput from "@/components/auth/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import AuthHeader from "@/components/auth/AuthHeader";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOthersStore } from "@/store/useOthersStore";

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
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Automatically redirect to home page
  useEffect(() => {
    setLoadingStatus(true);
    // Short delay to show loading state
    const timer = setTimeout(() => {
      router.push("/");
      setLoadingStatus(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router, setLoadingStatus]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    router.push("/");
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
              <div className="bg-yellow-50 p-3 rounded-md text-yellow-700 text-sm mb-4">
                Authentication has been removed. You will be redirected to the home page automatically.
              </div>
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
