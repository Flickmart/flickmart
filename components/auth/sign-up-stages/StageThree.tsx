import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const StageThree = () => {
  const [redirectTimer, setRedirectTimer] = useState(5);
  const router = useRouter();
  const { user } = useUser();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (redirectTimer <= 0) {
        router.push("/");
      } else {
        setRedirectTimer((prev) => prev - 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [redirectTimer, router]);
  
  const handleGetStarted = () => {
    router.push("/");
  };

  return (
    <main className="container-px text-center fixed abs-center-x abs-center-y w-full max-w-[700px]">
      <Image
        src="/flickmart-logo.svg"
        width={132}
        height={113}
        alt="flickmart-logo"
        className="mx-auto"
      />
      <h3 className="text-3xl mt-10 mb-7 md:text-4xl">
        {user?.firstName ? user.firstName : 'Your'} account has been created
      </h3>
      <h2 className="text-sm font-light mb-32 md:text-base">
        Welcome to flickmart, where possibility meets passion.
      </h2>
      <Button 
        className="submit-btn sm:w-4/5" 
        type="button"
        onClick={handleGetStarted}
      >
        Get started
      </Button>
      <p className="mt-5">
        You will be redirected in{" "}
        <span className="text-flickmart">{redirectTimer} seconds...</span>
      </p>
    </main>
  );
};

export default StageThree;
