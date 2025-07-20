import { Search } from "lucide-react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";

interface SearchFormProps extends React.ComponentProps<"form"> {
  onSearch?: (query: string) => void;
}

export function SearchForm({ onSearch, ...props }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <form {...props}>
      <div className="relative px-3">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for settings..."
          className="pl-8 h-12"
        />
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  );
}
