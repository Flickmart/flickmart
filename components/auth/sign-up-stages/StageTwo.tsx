import AuthHeader from "../AuthHeader";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";

const formSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your verification code must be 6 digits" }),
});

const StageTwo = ({
  setStage,
}: {
  setStage: Dispatch<SetStateAction<number>>;
}) => {
  const [otpMaxLength] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { isLoaded, signUp, setActive } = useSignUp();
  const email = useUserStore((state) => state.user?.email);

  // Countdown timer for resending code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      // Attempt to verify the email with the provided code
      const completeVerification = await signUp.attemptEmailAddressVerification({
        code: data.otp,
      });

      if (completeVerification.status !== "complete") {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Set the user session
      await setActive({ session: completeVerification.createdSessionId });

      // Move to success page
      setStage(3);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Verification failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setCountdown(30);
      toast.success("A new verification code has been sent to your email");
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Failed to send verification code");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-screen">
      <AuthHeader />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container-px text-center max-w-[600px] mx-auto lg:absolute lg:abs-center-x lg:abs-center-y lg:abs-center-x lg:max-w-none lg:w-[700px]"
        >
          <h1 className="mb-3 text-[26px] mt-14 sm:text-4xl lg:mt-0 lg:text-[44px]">
            Verify your email address
          </h1>
          <p className="text-sm text-flickmart-gray mb-20 lg:text-base">
            We sent a verification code to{" "}
            <span className="text-flickmart font-medium">{email}</span>
          </p>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={otpMaxLength}
                    {...field}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="w-full justify-between gap-4">
                      {Array.from({ length: otpMaxLength }).map((_, index) => (
                        <InputOTPSlot
                          index={index}
                          key={index}
                          className="rounded-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="submit-btn lg:w-4/5 lg:mt-20"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <p className="font-light mt-8">
            Didn't receive any code?{" "}
            {countdown > 0 ? (
              <span className="text-flickmart">
                You will receive a new code in the next {countdown} seconds
              </span>
            ) : (
              <button
                type="button"
                onClick={resendCode}
                className="text-flickmart font-medium hover:underline"
              >
                Resend code
              </button>
            )}
          </p>
        </form>
      </Form>
    </main>
  );
};
export default StageTwo;
