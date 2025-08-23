'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StageOne from '@/components/auth/sign-up-stages/StageOne';
import StageThree from '@/components/auth/sign-up-stages/StageThree';
import StageTwo from '@/components/auth/sign-up-stages/StageTwo';

export default function SignUp() {
  const [stage, setStage] = useState(1);
  const router = useRouter();
  const { isSignedIn } = useUser();

  // If the user is already signed in, redirect to home
  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  return (
    <>
      {stage === 1 && <StageOne setStage={setStage} />}
      {stage === 2 && <StageTwo setStage={setStage} />}
      {stage === 3 && <StageThree />}
    </>
  );
}
