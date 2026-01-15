import { useSignUp } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import useUserStore from '@/store/useUserStore';

const formSchema = z.object({
  otp: z
    .string()
    .min(6, { message: 'Your verification code must be 6 digits' }),
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
  const [isSending, setIsSending] = useState(false);
  const email = useUserStore((state) => state.user.email);

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
      otp: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoading(true);

      // Attempt to verify the email with the provided code
      const completeVerification = await signUp.attemptEmailAddressVerification(
        {
          code: data.otp,
        }
      );

      if (completeVerification.status !== 'complete') {
        toast.error('Verification failed. Please try again.');
        return;
      }

      // Set the user session
      await setActive({ session: completeVerification.createdSessionId });

      // Move to success page
      setStage(3);
    } catch (err: any) {
      toast.error(
        err.errors?.[0]?.message || 'Verification failed. Please try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsSending(true);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCountdown(30);
      toast.success('A new verification code has been sent to your email');
    } catch (err: any) {
      toast.error(
        err.errors?.[0]?.message || 'Failed to send verification code'
      );
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="relative h-screen">
      <Form {...form}>
        <form
          className="container-px lg:abs-center-x lg:abs-center-y lg:abs-center-x mx-auto max-w-[600px] text-center lg:absolute lg:w-[700px] lg:max-w-none"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="mt-14 mb-3 text-[26px] sm:text-4xl lg:mt-0 lg:text-[44px]">
            Verify your email address
          </h1>
          <p className="mb-20 text-flickmart-gray-1 text-sm lg:text-base">
            We sent a verification code to{' '}
            <span className="font-medium text-flickmart">{email}</span>
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
                          className="rounded-lg"
                          index={index}
                          key={index}
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
            className="submit-btn lg:mt-20 lg:w-4/5"
            disabled={isLoading || isSending}
            type="submit"
          >
            {isLoading ? 'Verifying...' : isSending ? 'Sending...' : 'Verify'}
          </Button>
          <p className="mt-8 font-light">
            Didn't receive any code?{' '}
            {countdown > 0 ? (
              <span className="text-flickmart">
                You can resend the code in {countdown} seconds
              </span>
            ) : (
              <button
                className="font-medium text-flickmart hover:underline disabled:opacity-50"
                disabled={isSending}
                onClick={resendCode}
                type="button"
              >
                {isSending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </p>
        </form>
      </Form>
    </main>
  );
};
export default StageTwo;
