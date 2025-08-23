'use client';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StageFour from '@/components/create-store/StageFour';
import StageOne from '@/components/create-store/StageOne';
import StageThree from '@/components/create-store/StageThree';
import StageTwo from '@/components/create-store/StageTwo';
import Loader from '@/components/multipage/Loader';
import { api } from '@/convex/_generated/api';
import { useAuthUser } from '@/hooks/useAuthUser';

const page = () => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const { user, isLoading, isAuthenticated } = useAuthUser();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null; // Will be redirected by useAuthUser
  return (
    <>
      <main
        className={`mx-auto mt-[56px] max-w-[500px] px-4 pb-10 text-center ${stage >= 2 ? 'md:-translate-x-1/2 md:-translate-y-1/2 w-full md:fixed md:top-1/2 md:left-1/2 md:grid md:max-w-[900px] md:grid-cols-2 md:items-center md:gap-16' : ''}`}
      >
        <Image
          alt="create store"
          className={`mx-auto mb-14 w-4/5 md:w-full ${stage >= 2 ? 'w-3/5' : ''} ${stage >= 3 ? 'hidden md:block' : ''}`}
          height={780}
          src="/create-store.png"
          width={836}
        />
        {stage === 1 && <StageOne setStage={setStage} />}
        {stage === 2 && <StageTwo setStage={setStage} />}
        {stage === 3 && <StageThree setStage={setStage} />}
        {stage === 4 && <StageFour />}
      </main>
    </>
  );
};
export default page;
