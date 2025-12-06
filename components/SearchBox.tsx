'use client';
import { SelectTrigger } from '@radix-ui/react-select';
import { ChevronDown, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SearchInput from './SearchInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from './ui/select';

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
  const [location, setLocation] = useState<string>('');

  // Pages where SearchBox should not be shown
  const hiddenPages = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/notifications',
    '/settings',
    'post-ad',
    '/create-store',
    '/saved',
    '/chat',
    '/business',
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }
  return (
    <div
      className={`section-px mt-2 flex h-[52px] items-center justify-between lg:px-0 ${inNavbar ? 'w-full flex-row-reverse lg:mt-0' : ''}`}
    >
      <div className="flex h-[50px] items-center rounded-sm bg-[#FF8100] px-2.5 text-white lg:h-auto lg:rounded-md lg:rounded-l-none lg:py-2">
        <Select onValueChange={(val) => setLocation(val)} value={location}>
          <SelectTrigger className="flex items-center gap-1 text-nowrap">
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
      <div className="flex h-[50px] w-[calc(99%-150px)] flex-col justify-center rounded-sm bg-gray-100 lg:flex lg:h-10 lg:w-[calc(100%-150px)] lg:items-center lg:rounded-r-none lg:rounded-l-md">
        <SearchInput
          isOverlayOpen={open}
          loc={location}
          openSearch={openSearch}
        />
      </div>
    </div>
  );
}
