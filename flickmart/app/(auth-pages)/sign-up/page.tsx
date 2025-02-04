"use client";
import StageOne from "@/components/auth/sign-up-stages/StageOne";
import StageTwo from "@/components/auth/sign-up-stages/StageTwo";
import StageThree from "@/components/auth/sign-up-stages/StageThree";
import { useState } from "react";

export default function SignUp() {
  const [stage, setStage] = useState(1);
  return (
    <>
      {stage === 1 && <StageOne setStage={setStage} />}
      {stage === 2 && <StageTwo setStage={setStage} />}
      {stage === 3 && <StageThree />}
    </>
  );
}
