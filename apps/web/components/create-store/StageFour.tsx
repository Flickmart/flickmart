import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from 'backend/convex/_generated/api';

const StageFour = () => {
  const router = useRouter();
  const userStore = useQuery(api.store.getStoresByUserId);
  return (
    <div className="abs-center-x abs-center-y fixed w-5/6 md:static md:translate-x-0 md:translate-y-0">
      <div className="relative mx-auto mb-7 size-32 cursor-pointer md:mb-10">
        <Image
          alt="default profile"
          className="inline-block h-full w-full rounded-full object-cover hover:outline hover:outline-2 hover:outline-offset-2"
          height={60}
          src={userStore?.data?.image || '/default-profile.png'}
          width={60}
        />
        <Image
          alt="check"
          className="absolute right-1 bottom-1 w-7"
          height={15}
          src="/check.svg"
          width={15}
        />
      </div>
      <p className="mb-16 text-sm md:mb-0 md:text-base">
        Welcome to Flickmart {userStore?.data?.image}, your biggest business
        platform yet
      </p>
      <button
        className="submit-btn rounded-full text-white capitalize"
        onClick={() => {
          router.push('/post-ad');
        }}
      >
        Sell
      </button>
    </div>
  );
};
export default StageFour;
