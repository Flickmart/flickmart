import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const AnimatedSearchBar = ({
  handleSearch,
  placeholder,
  isExpanded,
}: {
  handleSearch: (textInput: string) => void;
  placeholder: string;
  isExpanded: boolean;
}) => {
  const [userInteractionOccurred, setUserInteractionOccurred] = useState(false);
  useEffect(() => {
    if (isExpanded) {
      setUserInteractionOccurred(true);
    }
  }, [isExpanded]);
  return (
    <div
      className={cn(
        "rounded-md flex items-center origin-right sm:h-12 absolute w-full right-0 bg-gray-200 scale-x-0",
        {
          expand: isExpanded,
          contract: !isExpanded && userInteractionOccurred,
        }
      )}
    >
      <Input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 origin-right"
      />
    </div>
  );
};
export default AnimatedSearchBar;
