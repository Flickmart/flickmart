import { Search } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Input } from '../ui/input';

interface SearchFormProps extends React.ComponentProps<'form'> {
  onSearch?: (query: string) => void;
}

export function SearchForm({ onSearch, ...props }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <form {...props}>
      <div className="relative px-3">
        <Label className="sr-only" htmlFor="search">
          Search
        </Label>
        <Input
          className="h-12 pl-8"
          id="search"
          onChange={handleSearch}
          placeholder="Search for settings..."
          value={searchQuery}
        />
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-5 size-5 select-none opacity-50" />
      </div>
    </form>
  );
}
