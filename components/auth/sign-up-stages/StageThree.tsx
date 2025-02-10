import { Button } from "@/components/ui/button";
import Image from "next/image";

const StageThree = () => {
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
        Mbah, your account has been created
      </h3>
      <h2 className="text-sm font-light mb-32 md:text-base">
        Welcome to flickmart, where possibility meets passion.
      </h2>
      <Button className="submit-btn sm:w-4/5" type="button">
        Get started
      </Button>
      <p className="mt-5">
        You will be redirected in{" "}
        <span className="text-flickmart">5 seconds...</span>
      </p>
    </main>
  );
};
export default StageThree;
