import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Dispatch, useEffect } from 'react';
import { api } from '@/convex/_generated/api';

const StageOne = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const router = useRouter();
  const userStore = useQuery(api.store.getStoresByUserId);

  useEffect(() => {
    if (userStore?.data) {
      router.push('/post-ad');
    }
  }, [userStore, router]);

  return (
    <div>
      <h2 className="mb-3 font-medium text-2xl capitalize md:text-4xl">
        Create your store
      </h2>
      <p className="font-light text-flickmart-gray-1 text-sm md:text-base">
        Read our{' '}
        <Link className="font-medium text-flickmart" href="/privacy-policy">
          Privacy Policy
        </Link>
        . Tap agree and continue to accept the{' '}
        <Link className="font-medium text-flickmart" href="/terms-of-service">
          Terms of Service
        </Link>{' '}
      </p>
      <button
        className="mt-11 w-full max-w-[1000px] cursor-pointer rounded-full bg-flickmart py-4 font-bold text-sm text-white transition-all duration-300 hover:shadow-black/20 hover:shadow-lg"
        onClick={() => {
          setStage(2);
        }}
        type="button"
      >
        Agree and Continue
      </button>
    </div>
  );
};
export default StageOne;
