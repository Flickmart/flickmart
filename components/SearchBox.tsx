"use client";
import { SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchInput from "./SearchInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "./ui/select";

export default function SearchBox({
  openSearch,
  open,
  inNavbar = false,
}: {
  openSearch: (val: boolean) => void;
  open: boolean;
  inNavbar?: boolean;
}) {
  const pathname = usePathname();
  const [location, setLocation] = useState<string>("");

  // Pages where SearchBox should not be shown
  const hiddenPages = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/notifications",
    "/settings",
    "post-ad",
    "/create-store",
    "/saved",
    "/chat",
    "/business",
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }
  return (
    <div
      className={`flex section-px items-center h-[52px] mt-2 justify-between lg:px-0 ${inNavbar ? "flex-row-reverse w-full lg:mt-0" : ""}`}
    >
      <div className="rounded-sm bg-[#FF8100] h-[50px] px-2.5 flex items-center text-white lg:rounded-l-none lg:rounded-md lg:h-auto lg:py-2">
        <Select onValueChange={(val) => setLocation(val)} value={location}>
          <SelectTrigger className="text-nowrap flex items-center gap-1">
            <SelectValue placeholder="All Campuses" />
            <ChevronDown className="size-5 text-white" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="capitalize">
              <SelectLabel>location</SelectLabel>
              <SelectItem value="all">All Campuses</SelectItem>
              <SelectItem value="enugu">Enugu - UNEC</SelectItem>
              <SelectItem value="nsukka">Nsukka - UNN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className=" bg-gray-100 h-[50px] w-[calc(99%-150px)] rounded-sm flex flex-col justify-center lg:h-10 lg:flex lg:items-center lg:rounded-r-none lg:rounded-l-md lg:w-[calc(100%-150px)]">
        <SearchInput
          isOverlayOpen={open}
          loc={location}
          openSearch={openSearch}
        />
      </div>
    </div>
  );
}
