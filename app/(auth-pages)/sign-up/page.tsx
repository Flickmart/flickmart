"use client";
import StageOne from "@/components/auth/sign-up-stages/StageOne";
import StageTwo from "@/components/auth/sign-up-stages/StageTwo";
import StageThree from "@/components/auth/sign-up-stages/StageThree";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOthersStore } from "@/store/useOthersStore";

export default function SignUp() {
  const [stage, setStage] = useState(1);
  const router = useRouter();
  const setLoadingStatus = useOthersStore((state) => state.setLoadingStatus);

  // Automatically redirect to home page
  useEffect(() => {
    setLoadingStatus(true);
    // Short delay to show loading state
    const timer = setTimeout(() => {
      router.push("/home");
      setLoadingStatus(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router, setLoadingStatus]);

  return (
    <>
      <div className="p-4 bg-yellow-50 text-yellow-700 text-sm m-4 rounded-md">
        Authentication has been removed. You will be redirected to the home page automatically.
      </div>
      {stage === 1 && <StageOne setStage={setStage} />}
      {stage === 2 && <StageTwo setStage={setStage} />}
      {stage === 3 && <StageThree />}
    </>
  );
}
