"use client";

import StageOne from "@/components/create-store/StageOne";
import StageTwo from "@/components/create-store/StageTwo";
import StageThree from "@/components/create-store/StageThree";
import StageFour from "@/components/create-store/StageFour";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
const page = () => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [avatar, setAvatar] = useState<string | null>("");
  return (
    <>
      <header className="shadow-lg py-[24px] container-px sticky top-0 bg-white sm:hidden">
        <button className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 text-sm">
          <ChevronLeft size={30} strokeWidth={1.5} />
          Create Store
        </button>
      </header>
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
        {stage === 3 && (
          <StageThree
            avatar={avatar}
            setAvatar={setAvatar}
            setStage={setStage}
          />
        )}
        {stage === 4 && <StageFour avatar={avatar} setStage={setStage} />}
      </main>
    </>
  );
};
export default page;
