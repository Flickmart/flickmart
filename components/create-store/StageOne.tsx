import Link from "next/link";
import { Dispatch, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const StageOne = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const router = useRouter();
  const userStore = useQuery(api.store.getStoresByUserId);

  useEffect(() => {
    if (userStore?.data) {
      router.push("/post-ad");
    }
  }, [userStore, router]);

  return (
    <div>
      <h2 className="capitalize font-medium text-2xl mb-3 md:text-4xl">
        Create your store
      </h2>
      <p className="text-sm font-light text-flickmart-gray md:text-base">
        Read our{" "}
        <Link href="/privacy-policy" className="text-flickmart font-medium">
          Privacy Policy
        </Link>
        . Tap agree and continue to accept the{" "}
        <Link href="/terms-of-service" className="text-flickmart font-medium">
          Terms of Service
        </Link>{" "}
      </p>
      <button
        type="button"
        onClick={() => {
          setStage(2);
        }}
        className="bg-flickmart text-white w-full max-w-[1000px] rounded-full py-4 text-sm mt-11 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-black/20 cursor-pointer"
      >
        Agree and Continue
      </button>
    </div>
  );
};
export default StageOne;
