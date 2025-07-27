"use client";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function getLastPathSegment(pathname: string): string {
  return pathname.substring(pathname.lastIndexOf("/") + 1);
}

const NavigationBar = () => {
  const router = useRouter();
  const cPath = usePathname();
  // an array of paths where the styles should be applied
  const activePaths = [`/saved`];
  const pagesWithoutTitle = [`/saves`, `/categories`];
  // Check if the current pathname is in the array
  const isActive = activePaths.includes(cPath);
  const isPage = pagesWithoutTitle.includes(cPath);
  return (
    <header
      className={
        isActive ? "w-full shadow-lg py-3" : "w-full shadow-lg py-3 mt-14"
      }
    >
      <div className="w-[98%] mx-auto">
        <button
          onClick={() => router.back()}
          className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 capitalize text-sm"
        >
          <ChevronLeft size={35} strokeWidth={1.5} />
          <span className={isPage ? "block" : "hidden"}>Find&nbsp;</span>{" "}
          {getLastPathSegment(cPath)}
          <span className="hidden lg:block">&nbsp;In Nigeria.</span>
        </button>
      </div>
    </header>
  );
};
export default NavigationBar;
