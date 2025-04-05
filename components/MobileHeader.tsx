"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const MobileHeader = ({ children }: { children?: ReactNode }) => {
  const router = useRouter();

  const pathname = usePathname();

  let title = (pathname.split("/").at(-1) as string).split("-").join(" ");

  if (pathname.includes("/product")) {
    title = "Products";
  }
  const hiddenPaths = ["/notifications", "/settings"];

  const isHidden = () => {
    if (pathname === "/") {
      return true;
    }
    // Check if the current pathname includes any of the hidden paths
    return hiddenPaths.some((path) => pathname.includes(path));
  };
  return (
    <header
      className={cn(
        "shadow-lg sticky top-0 h-[77px] flex items-center z-50 bg-white pl-2 pr-5 justify-between text-sm sm:hidden",
        { hidden: isHidden() }
      )}
    >
      <button
        onClick={() => router.back()}
        className="flex items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 text-sm capitalize"
      >
        <ChevronLeft size={30} strokeWidth={1.5} />
        {title}
      </button>
      {children}
    </header>
  );
};
export default MobileHeader;
