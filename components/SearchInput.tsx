"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";
const MotionCommandList = motion(CommandList);

export default function SearchInput({
  query,
  openSearch,
  updateAutoSuggest,
  loc,
  isOverlayOpen,
  ref,
}: {
  query?: string;
  openSearch?: (val: boolean) => void;
  updateAutoSuggest?: (values: Array<string>, searchValue: string) => void;
  loc?: string;
  isOverlayOpen?: boolean;
  ref?: React.ForwardedRef<HTMLInputElement>;
}) {
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const saveSearchInput = useMutation(api.search.insertSearchHistory);
  const deleteSearchInput = useMutation(api.search.deleteSearchHistory);
  const retrievePreviousInputs = useQuery(api.search.getSearchHistory, {});
  const autoSuggest = useQuery(api.product.search, {
    query: searchInput || "",
    type: "suggestions",
  });
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (retrievePreviousInputs?.error) {
      console.log(retrievePreviousInputs.error);
    }
  }, [retrievePreviousInputs]);

  function handleKeyPress<T extends HTMLElement>(
    event: React.KeyboardEvent<T>
  ) {
    if (event.key === "Enter") {
      const locationQuery = !loc || loc === "all" ? "" : `?location=${loc}`;
      router.push(`/search?query=${searchInput}${locationQuery}`);
      openSearch && openSearch(false);
      saveSearchInput({
        search: searchInput,
      });
      // Perform search action
      !isMobile && isOverlayOpen && setSearchInput("");
      setIsTyping(false);
    }
  }
  function handlePrefetch() {
    router.prefetch("/search");
    if (searchInput) {
      setFocus(false);
      return;
    }
    if (!isMobile) setFocus(true);
  }
  useEffect(
    function () {
      if (autoSuggest || searchInput) {
        updateAutoSuggest &&
          updateAutoSuggest(autoSuggest as Array<string>, searchInput);
      }
    },
    [autoSuggest, isMobile, isOverlayOpen, searchInput]
  );

  useEffect(function () {
    if (query) {
      setSearchInput(query);
    }
  }, []);

  return (
    <Command className="bg-inherit">
      <div className="w-full ">
        {isMobile && !isOverlayOpen ? (
          <div
            onClick={() => openSearch && openSearch(true)}
            className="flex cursor-pointer h-full bg-gray-100  text-gray-500 p-2 lg:p-2.5 px-4 gap-5 items-center mb-2"
          >
            <Search className="size-4" />
            <span className="text-sm lg:text-lg">
              {searchInput || "What are you looking for?"}
            </span>
          </div>
        ) : (
          <CommandInput
            inputMode="search"
            ref={ref}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onFocus={handlePrefetch}
            value={searchInput}
            onKeyDown={(e) => handleKeyPress(e)}
            onValueChange={(value) => {
              setSearchInput(value);
              if (!value) {
                setIsTyping(false);
                setFocus(true);
                return;
              }
              setIsTyping(true);
              setFocus(false);
            }}
            onBlur={() => {
              setFocus(false);
              setIsTyping(false);
            }}
            className="w-full outline-none ps-4 py-3 rounded-lg text-sm text-flickmart-gray"
            placeholder="What are you looking for?"
          />
        )}
        {isTyping && !isOverlayOpen ? (
          <MotionCommandList
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 0.2 }}
            className="z-10 rounded-lg mt-1.5 bg-white p-2 lg:w-[40vw] absolute shadow-md"
          >
            <CommandGroup heading="Suggestions">
              {autoSuggest?.map((item, index) => (
                <Link
                  key={index}
                  href={`/search?query=${item}`}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CommandItem
                    className="cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        router.push(`/search?query=${item}`);
                        setIsTyping(false);
                      }
                    }}
                  >
                    {typeof item === "string" ? item : null}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            {autoSuggest?.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandEmpty>Loading...</CommandEmpty>
            )}
          </MotionCommandList>
        ) : focus &&
          !isOverlayOpen &&
          retrievePreviousInputs?.data &&
          retrievePreviousInputs.data?.length > 0 ? (
          <CommandList className="z-10 rounded-lg mt-1.5 bg-white p-2 lg:w-[40vw] absolute shadow-md">
            <CommandGroup heading="Recent Searches">
              {retrievePreviousInputs?.data?.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex justify-between items-center hover:bg-gray-50 px-1 rounded-lg"
                  onClick={() => {
                    setFocus(false);
                    searchRef.current?.blur();
                    router.push(`/search?query=${item.search}`);
                  }}
                >
                  <CommandItem className="cursor-pointer flex-grow !bg-inherit">
                    {/* {typeof item.search === "string" ? item.search : null} */}
                    {item.search}
                  </CommandItem>
                  <X
                    className="text-gray-600 cursor-pointer"
                    size={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("deleted");
                      deleteSearchInput({
                        searchId: item._id,
                      });
                    }}
                  />
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        ) : null}
      </div>
    </Command>
  );
}
