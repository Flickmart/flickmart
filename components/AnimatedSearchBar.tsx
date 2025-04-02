import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";

const AnimatedSearchBar = ({
  placeholder,
  isExpanded,
  setIsExpanded,
}: {
  placeholder: string;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={clsx(
        "rounded-md flex items-center origin-right sm:h-12 absolute w-full right-0 bg-gray-200",
        {
          expand: isExpanded,
          contract: !isExpanded,
        }
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 origin-right"
      />
    </div>
  );
};
export default AnimatedSearchBar;
