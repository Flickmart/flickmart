"use client";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "./ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import SearchInput from "./SearchInput";

export default function SearchBox({openSearch, open}: {openSearch: (val: boolean)=> void; open: boolean}) {
  const pathname = usePathname();
  const [location, setLocation]= useState<string>("")

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
    "/chats",
    "/business",
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }

  return (
      <div className="w-full bg-flickmartLight pt-36 pb-24 flex justify-center text-base">
        <div className="w-11/12 lg:w-6/12 flex flex-col justify-center items-center gap-5">
          <div className="w-full flex items-center justify-center gap-2">
            <span className="font-medium">Find anything in</span>
            <div className="flex items-center gap-1 rounded-md py-2 px-4 bg-black text-white">
              <MapPin className="h-4 w-4" />
              <Select onValueChange={(val)=>setLocation(val)} value={location}>
                <SelectTrigger>
                  <SelectValue placeholder="All Nigeria"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="capitalize">
                    <SelectLabel>location</SelectLabel>
                    <SelectItem value="enugu">Enugu</SelectItem>
                    <SelectItem value="nsukka">Nsukka</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-gray-100 w-full rounded-lg">
            <SearchInput location={location} isOverlayOpen={open} openSearch={openSearch}/>
          </div>
        </div>
      </div>
  );
}
