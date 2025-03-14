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
import { Dispatch, SetStateAction, useState } from "react";

import useUserStore from "@/store/useUserStore";

const formSchema = z.object({
  otp: z
    .string()
    .min(4, { message: "Your one-time password must be 6 digits" }),
});

const StageTwo = ({
  setStage,
}: {
  setStage: Dispatch<SetStateAction<number>>;
}) => {
  const { email } = useUserStore((state) => state.user);
  const [otpMaxLength] = useState(6);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setStage(3);
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
            We sent a verification code to henrymadueke@gmail.com
          </p>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  One-Time Password
                </FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={otpMaxLength}
                    {...field}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="w-full justify-between gap-4">
                      {Array.from({ length: otpMaxLength }).map((_, index) => (
                        <InputOTPSlot index={index} key={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="submit-btn lg:w-4/5 lg:mt-20" type="submit">
            Verify
          </Button>
          <p className="font-light mt-8">
            Didn't recieve any code? You will recieve a new code in the next{" "}
            <span className="text-flickmart">30 seconds</span>
          </p>
        </form>
      </Form>
    </main>
  );
};
export default StageTwo;
