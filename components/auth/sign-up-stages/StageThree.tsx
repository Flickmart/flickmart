import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const StageThree = () => {
  const [redirectTimer, setRedirectTimer] = useState(5);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      if (redirectTimer <= 0) {
        router.push('/');
      } else {
        setRedirectTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [redirectTimer, router]);

  const handleGetStarted = () => {
    router.push('/');
  };

  return (
    <main className="container-px abs-center-x abs-center-y fixed w-full max-w-[700px] text-center">
      <Image
        alt="flickmart-logo"
        className="mx-auto"
        height={113}
        src="/flickmart-logo.svg"
        width={132}
      />
      <h3 className="mt-10 mb-7 text-3xl md:text-4xl">
        {user?.firstName ? user.firstName : 'Your'} account has been created
      </h3>
      <h2 className="mb-32 font-light text-sm md:text-base">
        Welcome to flickmart, where possibility meets passion.
      </h2>
      <Button
        className="submit-btn sm:w-4/5"
        onClick={handleGetStarted}
        type="button"
      >
        Get started
      </Button>
      <p className="mt-5">
        You will be redirected in{' '}
        <span className="text-flickmart">{redirectTimer} seconds...</span>
      </p>
    </main>
  );
};

export default StageThree;
