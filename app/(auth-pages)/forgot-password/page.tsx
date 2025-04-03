"use client";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOthersStore } from "@/store/useOthersStore";
import MobileHeader from "@/components/MobileHeader";

export default function ForgotPassword() {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  // Automatically redirect to home page
  useEffect(() => {
    setLoadingStatus(true);
    // Short delay to show loading state
    const timer = setTimeout(() => {
      router.push("/home");
      setLoadingStatus(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, setLoadingStatus]);

  return (
    <>
      <MobileHeader />
      <section className="form-grid">
        <Image
          src="/forgot-password.svg"
          width={520}
          height={486}
          alt="forgot password illustration"
          className="hidden lg:block lg:w-[450px]"
        />
        <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 container-px mt-14 mx-auto">
          <div>
            <h1 className="text-[32px] font-medium">Forgot Password?</h1>
            <div className="bg-yellow-50 p-3 rounded-md text-yellow-700 text-sm mt-4">
              Authentication has been removed. You will be redirected to the
              home page automatically.
            </div>
            <p className="text-flickmart-gray mt-8">
              Enter your email to reset password.
            </p>
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label className="auth-form-label" htmlFor="email">
              Email address
            </Label>
            <Input
              className="auth-input"
              name="email"
              placeholder="Email address"
              required
            />
            <Button> Next</Button>
          </div>
        </form>
      </section>
    </>
  );
}
