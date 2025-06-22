import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
const StageFour = () => {
  const router = useRouter(); 
  const userStore = useQuery(api.store.getStoresByUserId);
  return (
    <div className="fixed w-5/6 abs-center-x abs-center-y md:static md:translate-x-0 md:translate-y-0">
      <div className="mx-auto size-32 relative cursor-pointer mb-7 md:mb-10">
        <Image
          src={userStore?.[0]?.image || "/default-profile.png"}
          className="w-full h-full object-cover inline-block rounded-full hover:outline hover:outline-2 hover:outline-offset-2"
          height={60}
          width={60}
          alt="default profile"
        />
        <Image
          className="w-7 absolute right-1 bottom-1"
          src="/check.svg"
          width={15}
          height={15}
          alt="check"
        />
      </div>
      <p className="text-sm mb-16 md:text-base md:mb-0">
        Welcome to Flickmart {userStore?.[0]?.name}, your biggest business
        platform yet
      </p>
      <button
        onClick={() => {
          router.push(`/post-ad`);
        }}
        className="submit-btn text-white rounded-full capitalize"
      >
        Sell
      </button>
    </div>
  );
};
export default StageFour;
