'use client';
import { useMutation, useQuery } from 'convex/react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

const MotionCommandList = motion.create(CommandList);

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
  updateAutoSuggest?: (values: string[], searchValue: string) => void;
  loc?: string;
  isOverlayOpen?: boolean;
  ref?: React.ForwardedRef<HTMLInputElement>;
}) {
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const saveSearchInput = useMutation(api.search.insertSearchHistory);
  const deleteSearchInput = useMutation(api.search.deleteSearchHistory);
  const retrievePreviousInputs = useQuery(api.search.getSearchHistory, {});
  const autoSuggest = useQuery(api.product.search, {
    query: searchInput || '',
    type: 'suggestions',
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
    if (event.key === 'Enter') {
      const locationQuery = !loc || loc === 'all' ? '' : `?location=${loc}`;
      router.push(`/search?query=${searchInput}${locationQuery}`);
      openSearch?.(false);
      saveSearchInput({
        search: searchInput,
      });
      // Perform search action
      !isMobile && isOverlayOpen && setSearchInput('');
      setIsTyping(false);
    }
  }
  function handlePrefetch() {
    router.prefetch('/search');
    if (searchInput) {
      setFocus(false);
      return;
    }
    if (!isMobile) {
      setFocus(true);
    }
  }
  useEffect(() => {
    if (autoSuggest || searchInput) {
      updateAutoSuggest?.(autoSuggest as string[], searchInput);
    }
  }, [autoSuggest, isMobile, isOverlayOpen, searchInput]);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
    }
  }, []);

  return (
    <Command className="bg-inherit h-full">
      <div className="h-full">
        {isMobile && !isOverlayOpen ? (
          <div
            className="flex cursor-pointer items-center gap-2 bg-gray-100 px-3 text-gray-500 lg:p-2.5 h-full"
            onClick={() => openSearch && openSearch(true)}
          >
            <Search className="size-5" />
            <span className="text-sm text-nowrap sm:text-base">
              {searchInput || "Search for products..."}
            </span>
          </div>
        ) : (
          <CommandInput
            className="w-full rounded-lg py-3 ps-4 text-flickmart-gray-1 text-sm outline-none sm:text-base"
            inputMode="search"
            onBlur={() => {
              setFocus(false);
              setIsTyping(false);
            }}
            onFocus={handlePrefetch}
            onKeyDown={(e) => handleKeyPress(e)}
            onSubmit={(e) => {
              e.preventDefault();
            }}
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
            placeholder="Search for products..."
            ref={ref}
            value={searchInput}
          />
        )}
        {isTyping && !isOverlayOpen ? (
          <MotionCommandList
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="absolute z-10 mt-1.5 rounded-lg bg-white p-2 shadow-md lg:w-[40vw]"
            initial={{
              opacity: 0,
              y: -10,
            }}
            transition={{ duration: 0.2 }}
          >
            <CommandGroup heading="Suggestions">
              {autoSuggest?.map((item, index) => (
                <Link
                  href={`/search?query=${item}`}
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CommandItem
                    className="cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`/search?query=${item}`);
                        setIsTyping(false);
                      }
                    }}
                  >
                    {typeof item === 'string' ? item : null}
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
          <CommandList className="absolute z-10 mt-1.5 rounded-lg bg-white p-2 shadow-md lg:w-[30vw]">
            <CommandGroup heading="Recent Searches">
              {retrievePreviousInputs?.data?.map((item, index) => (
                <div
                  className="flex items-center justify-between rounded-lg px-1 hover:bg-gray-50"
                  key={index}
                  onClick={() => {
                    setFocus(false);
                    searchRef.current?.blur();
                    router.push(`/search?query=${item.search}`);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CommandItem className="!bg-inherit flex-grow cursor-pointer">
                    {/* {typeof item.search === "string" ? item.search : null} */}
                    {item.search}
                  </CommandItem>
                  <X
                    className="cursor-pointer text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();

                      deleteSearchInput({
                        searchId: item._id,
                      });
                    }}
                    size={20}
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
