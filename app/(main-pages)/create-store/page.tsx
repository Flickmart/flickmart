"use client";
import StageOne from "@/components/create-store/StageOne";
import StageTwo from "@/components/create-store/StageTwo";
import StageThree from "@/components/create-store/StageThree";
import StageFour from "@/components/create-store/StageFour";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/multipage/Loader";
import useCheckUser from "@/hooks/useCheckUser";

const page = () => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const loading = useCheckUser();

  if (loading) return <Loader />;
  return (
    <>
      <main
        className={`px-4 pb-10 text-center max-w-[500px] mt-[56px] mx-auto ${stage >= 2 ? "md:grid md:grid-cols-2 md:max-w-[900px] w-full md:gap-16 md:items-center md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2" : ""}`}
      >
        <Image
          src="/create-store.png"
          width={836}
          height={780}
          alt="create store"
          className={`w-4/5 mx-auto mb-14 md:w-full ${stage >= 2 ? "w-3/5" : ""} ${stage >= 3 ? "hidden md:block" : ""}`}
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
