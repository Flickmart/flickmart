'use client';
import { useSignIn, useUser } from '@clerk/nextjs';
import type { OAuthStrategy } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().default(false).optional(),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useUser();
  const { isLoaded, signIn, setActive } = useSignIn();

  // If user is already signed in, redirect to home
  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const callbackURL = useSearchParams().get('callback') || '/';
  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      ?.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sign-up/sso-callback',
        redirectUrlComplete: callbackURL,
      })
      .then((_res) => {})
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(err, null, 2);
      });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoading(true);

      // Start the sign-in process using email and password
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === 'complete') {
        // Set the user session active
        await setActive({ session: result.createdSessionId });
        router.replace(callbackURL);
      } else {
        toast.error('Sign in failed. Please check your credentials.');
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || 'Sign in failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-screen">
      <section className="form-grid">
        <Image
          alt="sign in illustration"
          className="hidden w-[450px] lg:block lg:w-[500px]"
          height={618}
          priority
          src="/sign-in-illustration.svg"
          width={563}
        />
        <div className="container-px mt-16 space-y-8 lg:mt-0">
          <h1 className="mb-5">Sign in</h1>
          <Form {...form}>
            <form
              className="mt-8 space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-flickmart-gray">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          className="size-6 transition-colors duration-300 hover:border-flickmart"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0 font-light text-base">
                        Remember me
                      </FormLabel>
                    </div>
                    <Link
                      className="!m-0 font-semibold text-sm duration-300 hover:text-flickmart"
                      href="forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center space-y-4">
                <Button
                  className="submit-btn"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button
                  className="!bg-white mt-8 h-12 w-full border-2 border-flickmart font-medium text-base text-flickmart duration-300 hover:bg-flickmart"
                  onClick={() => signInWith('oauth_google')}
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
          <p className="text-center font-light text-flickmart-gray">
            Don't have an account yet?{' '}
            <Link
              className="font-medium text-flickmart capitalize hover:underline"
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
