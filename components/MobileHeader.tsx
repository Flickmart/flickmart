"use client";

import { ChevronLeft, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import SearchOverlay from "./SearchOverlay";

interface MobileHeaderProps {
  rightSlot?: ReactNode;
}

const MobileHeader = ({ rightSlot }: MobileHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryString = useSearchParams();
  const action = queryString.get("action");
  const [searchOpen, setSearchOpen] = useState(false);

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

  } else if (action === "edit") {
    title = "Edit Ad";
  }else if(pathname.includes("/business")){
    title = "Profile"
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

  function openSearch(val: boolean) {
    setSearchOpen(val);
  }
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[77px] items-center justify-between bg-white px-4 text-sm shadow-lg sm:hidden",
        { hidden: isHidden() }
      )}
    >
      <button
        className="flex items-center text-flickmart-gray text-sm capitalize transition-colors duration-300 hover:text-flickmart"
        onClick={() =>
          pathname.includes("/categories") ||
          pathname.includes("/post-ad") ||
          pathname.includes("/sign-in") ||
          pathname.includes("/business")
            ? router.push("/")
            : router.back()
        }
      >
        <ChevronLeft size={30} strokeWidth={1.5} />
        {title}
      </button>

      {/* Add a component at the right side of the header */}
      {rightSlot && <div>{rightSlot}</div>}
      {pathname.includes("/product") && (
        <button
          onClick={() => {
            setSearchOpen(true);
          }}
          type="button"
          className="font-bold pr-2"
        >
          <Search
            size={23}
            strokeWidth={2.5}
            className=" text-gray-500 mt-1 transition-all duration-300  hover:text-flickmart"
          />
        </button>
      )}
      <SearchOverlay open={searchOpen} openSearch={openSearch} />
    </header>
  );
};

export default MobileHeader;
