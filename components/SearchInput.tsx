"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import Link from 'next/link';

export default function SearchInput({query, openSearch, updateAutoSuggest, location, isOverlayOpen}: 
  {
    query?: string;
    openSearch?: (val: boolean)=> void; 
    updateAutoSuggest?: (values: Array<string>)=> void; 
    location?: string; 
    isOverlayOpen?: boolean
  }) {
    const isMobile = useIsMobile()
    const [searchInput, setSearchInput]= useState("")
    const [isTyping, setIsTyping]= useState<boolean>(false)
    const autoSuggest = useQuery(api.product.search, {query: searchInput || "", type: "suggestions"})
    const router = useRouter()
    const searchRef = useRef< HTMLInputElement | null>(null)
    function handleKeyPress<T extends HTMLElement>(event: React.KeyboardEvent<T>) {
        if (event.key === "Enter") {
          // Perform search action
          !isMobile && isOverlayOpen && setSearchInput("")
          setIsTyping(false)
          const locationQuery= location? `?location=${location}` : ""
          router.push(`/search?query=${searchInput}${locationQuery}`)
        }
      }
      function handlePrefetch(){
        router.prefetch("/search")
      }
      useEffect(function (){
        if(autoSuggest){
            updateAutoSuggest && updateAutoSuggest(autoSuggest as Array<string>)
        }
        if (isMobile && isOverlayOpen) {
          searchRef.current?.focus();
        }
      }, [autoSuggest, isMobile, isOverlayOpen])

      useEffect(function (){
        if(query){
          setSearchInput(query)
        }
      }, [])

  return (
    <Command className='bg-inherit'>
      <div className="w-full">
          <CommandInput
            ref={searchRef}
            onClick={()=> isMobile && openSearch && openSearch(true)}
            onFocus={handlePrefetch}
            value={searchInput}
            onKeyDown={(e)=>handleKeyPress(e)}
            onValueChange={(value)=> {
              setIsTyping(true)
              setSearchInput(value)
            }}
            onBlur={()=> setIsTyping(false)}
            className="w-full outline-none ps-4 py-3 rounded-lg text-sm text-flickmart-gray"
            placeholder="What are you looking for?"
            />
        {isTyping && !isOverlayOpen &&
          <CommandList className='z-10 rounded-lg mt-1 bg-white p-2 lg:w-2/4 absolute shadow-md'>
            <CommandGroup heading="Suggestions">
              {autoSuggest?.map((item, index) => 
              <Link key={index} href={`/search?query=${item}`} onMouseDown={(e)=> e.preventDefault()}>
                <CommandItem className='cursor-pointer' onKeyDown={(e)=>{
                  if(e.key === "Enter"){
                    router.push(`/search?query=${item}`)
                    setIsTyping(false)
                  }
                }}>
                  {typeof item === 'string' ? item : null}
                </CommandItem>
              </Link>
                )}
            </CommandGroup>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        }
      </div>
    </Command>
  )
}
