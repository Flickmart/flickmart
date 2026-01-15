'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomInput from '@/components/auth/CustomInput';
import { SubmitButton } from '@/components/submit-button';
import { Form } from '@/components/ui/form';
import { useOthersStore } from '@/store/useOthersStore';

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

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

  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    router.push('/');
  };

  return (
    <main>
      <section className="form-grid">
        <Image
          alt="sign in illustration"
          className="hidden w-[450px] lg:block lg:w-[500px]"
          height={618}
          src="/reset-password.svg"
          width={563}
        />
        <Form {...form}>
          <form
            className="container-px mt-8 w-full [&>input]:mb-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="mb-12">
              <h1 className="mb-5 font-medium text-4xl">Reset password</h1>
              <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
                Authentication has been removed. You will be redirected to the
                home page automatically.
              </div>
              <p className="text-flickmart-gray-1 text-sm">
                Password must be different from the last one
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <CustomInput
                control={form.control}
                name="newPassword"
                placeholder="New Password"
              />
              <CustomInput
                control={form.control}
                name="confirmPassword"
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
