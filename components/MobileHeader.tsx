"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MobileHeaderProps {
  rightSlot?: ReactNode;
}

const MobileHeader = ({ rightSlot }: MobileHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // If the pathname is one where a custom MobileHeader is rendered, return null
  const overrideRoutes = ["/notifications"];
  if (overrideRoutes.includes(pathname) && !rightSlot) {
    return null;
  }

  let title = (pathname.split("/").at(-1) as string).split("-").join(" ");
  if (pathname.includes("/product")) title = "Products";

  const hiddenPaths = ["/settings", "/chats", "/search"];
  const isHidden = () =>
    pathname === "/" || hiddenPaths.some((p) => pathname.includes(p));

  return (
    <header
      className={cn(
        "shadow-lg sticky top-0 h-[77px] flex items-center z-50 bg-white px-4 justify-between text-sm sm:hidden",
        { hidden: isHidden() }
      )}
    >
      <button
        onClick={() =>
          pathname.includes("/categories") ||
          pathname.includes("/post-ad") ||
          pathname.includes("/sign-in")
            ? router.push("/")
            : router.back()
        }
        className="flex items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 text-sm capitalize"
      >
        <ChevronLeft size={30} strokeWidth={1.5} />
        {title}
      </button>

      {/* Right slot */}
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
};

export default MobileHeader;