"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function SearchInput({openSearch, updateAutoSuggest}: {openSearch?: (val: boolean)=> void; updateAutoSuggest?: (values: Array<string>)=> void}) {
    const isMobile = useIsMobile()
    const [searchInput, setSearchInput]= useState("")
    const search = useQuery(api.product.search, {query: searchInput || ""})
    const autoSuggest= useMemo(() => search?.map(item => item.title) ?? [], [search]);
    const router = useRouter()
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
          // Perform search action
          console.log(`Searching for: ${searchInput}`);
          setSearchInput("")
          router.push(`/search?query=${searchInput}`)
        }
      }
      function handlePrefetch(){
        router.prefetch("/search")
      }
      useEffect(function (){
        if(autoSuggest){
            updateAutoSuggest && updateAutoSuggest(autoSuggest)
        }
      }, [autoSuggest])
  return (
    <div className="w-full">
    {/* <PopoverTrigger asChild> */}
      <div className="w-full flex items-center gap-1 rounded-md bg-inherit text-black" onClick={()=>isMobile && openSearch && openSearch(true)}>
        <input
          onFocus={handlePrefetch}
          value={searchInput}
          onKeyDown={handleKeyPress}
          onChange={(e)=> setSearchInput(e.target.value)}
          type="text"
          className="w-11/12 bg-inherit outline-none ps-4 py-3 rounded-md text-sm text-flickmart-gray"
          placeholder="What are you looking for?"
          />
        <button className="hover:bg-black/5 duration-500 py-2 rounded-md w-1/12 flex justify-center items-center me-2">
          <Search className="h-5 w-5 text-flickmart-gray " />
        </button>
      </div>
    {/* </PopoverTrigger> */}
    {/* <PopoverContent className="!w-11/12">
      hello
    </PopoverContent> */}
  </div>
  )
}
