'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOthersStore } from '@/store/useOthersStore';

export default function ForgotPassword() {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  // Automatically redirect to home page
  useEffect(() => {
    setLoadingStatus(true);
    // Short delay to show loading state
    const timer = setTimeout(() => {
      router.push('/');
      setLoadingStatus(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, setLoadingStatus]);

  return (
    <>
      <section className="form-grid">
        <Image
          alt="forgot password illustration"
          className="hidden lg:block lg:w-[450px]"
          height={486}
          src="/forgot-password.svg"
          width={520}
        />
        <form className="container-px mx-auto mt-14 flex w-full min-w-64 flex-1 flex-col gap-2 text-foreground [&>input]:mb-6">
          <div>
            <h1 className="font-medium text-[32px]">Forgot Password?</h1>
            <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
              Authentication has been removed. You will be redirected to the
              home page automatically.
            </div>
            <p className="mt-8 text-flickmart-gray">
              Enter your email to reset password.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
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
