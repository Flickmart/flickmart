import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

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
        'absolute right-0 flex w-full origin-right scale-x-0 items-center rounded-md bg-gray-200 sm:h-12',
        {
          expand: isExpanded,
          contract: !isExpanded && userInteractionOccurred,
        }
      )}
    >
      <Input
        className="flex h-10 w-full origin-right rounded-md bg-transparent px-3 py-2 text-sm outline-none ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
};
export default AnimatedSearchBar;
