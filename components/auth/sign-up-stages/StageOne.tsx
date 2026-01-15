'use client';
import { useSignUp } from '@clerk/nextjs';
import type { OAuthStrategy } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomInput from '@/components/auth/CustomInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useUserStore from '@/store/useUserStore';

export const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  agreeWithPrivacyPolicyAndTermsOfUse: z.boolean().refine((val) => val, {
    message: 'Please check the field above',
  }),
});

export default function StageOne({
  setStage,
}: {
  setStage: Dispatch<SetStateAction<number>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeWithPrivacyPolicyAndTermsOfUse: false,
    },
  });

  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp
      ?.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sign-up/sso-callback',
        redirectUrlComplete: '/',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err);
        console.error(err, null, 2);
      });
  };

  const setEmail = useUserStore((state) => state.updateUserInfo);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoading(true);

      // Start the sign-up process with Clerk
      await signUp.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.email,
        password: values.password,
      });

      // Update email in the user store
      setEmail({
        email: values.email,
      });

      // Send the user an email with the verification code
      setIsSending(true);
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // Move to the next stage
      setStage(2);
    } catch (err: any) {
      toast.error(
        err.errors?.[0]?.message || 'An error occurred during sign up'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <section className="form-grid">
        <Image
          alt="sign in illustration"
          className="hidden lg:block lg:w-[550px]"
          height={618}
          src="/sign-up-illustration.svg"
          width={563}
        />
        <div className="container-px mt-16 lg:mt-0 lg:h-[95vh] lg:overflow-x-auto">
          <h1 className="pt-5">Sign up</h1>

          <Form {...form}>
            <form
              className="mt-8 space-y-8 pb-20 lg:pb-0"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CustomInput
                control={form.control}
                name="firstName"
                placeholder="First Name"
              />
              <CustomInput
                control={form.control}
                name="lastName"
                placeholder="Last Name"
              />
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Email address"
              />
              <CustomInput
                control={form.control}
                name="password"
                placeholder="Password"
              />
              <FormField
                control={form.control}
                name="agreeWithPrivacyPolicyAndTermsOfUse"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <div className="flex items-center gap-3 text-flickmart-gray-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          className="size-6 transition-colors duration-300 hover:border-flickmart"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0 font-light text-flickmart-gray-1 text-xs">
                        I agree with{' '}
                        <Link
                          className="font-semibold text-flickmart hover:underline"
                          href="/privacy-policy"
                        >
                          Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link
                          className="font-semibold text-flickmart hover:underline"
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
              <div className="flex flex-col items-center space-y-4 pb-3">
                {/* captcha to protect from bots */}
                <div id="clerk-captcha" />
                <Button
                  className="submit-btn"
                  disabled={isLoading || isSending}
                  type="submit"
                >
                  {isLoading
                    ? 'Processing...'
                    : isSending
                      ? 'Sending...'
                      : 'Sign Up'}
                </Button>
                <Button
                  className="!bg-white mt-8 h-12 w-full border-2 border-flickmart font-medium text-base text-flickmart duration-300 hover:bg-flickmart"
                  onClick={() => signUpWith('oauth_google')}
                  type="button"
                  variant="secondary"
                >
                  <Image
                    alt="google"
                    className="hover h-10 w-10 cursor-pointer rounded-full object-cover duration-300 hover:bg-black/5"
                    height={500}
                    src="/icons/google.png"
                    width={500}
                  />
                  Sign in with Google
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-center font-light text-flickmart-gray-1">
            Already have an account?{' '}
            <Link
              className="font-medium text-flickmart capitalize hover:underline"
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
