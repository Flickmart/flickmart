'use client';
import { SelectTrigger } from '@radix-ui/react-select';
import { MapPin } from 'lucide-react';
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
}: {
  openSearch: (val: boolean) => void;
  open: boolean;
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
    <div className="flex w-full justify-center bg-flickmartLight pt-16 pb-8 text-base">
      <div className="flex w-11/12 flex-col items-center justify-center gap-5 lg:w-6/12">
        <div className="flex w-full items-center justify-center gap-2">
          <span className="font-medium">Find anything on</span>
          <div className="flex items-center gap-1 rounded-md bg-black px-4 py-2 text-white">
            <MapPin className="h-4 w-4" />
            <Select onValueChange={(val) => setLocation(val)} value={location}>
              <SelectTrigger>
                <SelectValue placeholder="All Campuses" />
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
        </div>
        <div className="w-11/12 rounded-lg bg-gray-100 lg:w-[40vw]">
          <SearchInput
            isOverlayOpen={open}
            loc={location}
            openSearch={openSearch}
          />
        </div>
      </div>
    </div>
  );
}
