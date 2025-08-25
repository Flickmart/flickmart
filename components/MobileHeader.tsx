"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import SearchOverlay from "./SearchOverlay";

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

  if (pathname.includes("/product")) {
    title = "Products";
  } else if (pathname.includes("/store")) {
    title = "Store";
  } else if (pathname.includes("/vendors")) {
    title = "Vendor";
  }
  const hiddenPaths = [
    "/notifications",
    "/settings",
    "/chat",
    "/search",
    "/wallet",
  ];

  const isHidden = () => {
    if (pathname === "/") {
      return true;
    }
    // Check if the current pathname includes any of the hidden paths
    return hiddenPaths.some((path) => pathname.includes(path));
  };

  const [searchOpen, setSearchOpen] = useState(true);
  function openSearch(val: boolean) {
    setSearchOpen(val);
  }
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

      {/* Add a component at the right side of the header */}
      {rightSlot && <div>{rightSlot}</div>}
      {pathname.includes("/product") && (
        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
          }}
        >
          <Search className="hover:text-flickmart transition-colors" />
        </button>
      )}
      <SearchOverlay openSearch={openSearch} open={searchOpen} />
    </header>
  );
};

export default MobileHeader;
