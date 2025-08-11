import { MobileFilterType } from "@/types/filters";
import { useState } from "react";

export function useFilters() {
  const [filterState, setFilterState] = useState<MobileFilterType>({
    category: "",
    location: "",
    minPrice: 0,
  });
  return {
    filterState,
    handleFilterState(val: string, label: string) {
      const value = val === "all" ? "" : val;
      switch (label) {
        case "category":
          return setFilterState({
            ...filterState,
            category: value,
          });
        case "location":
          return setFilterState({ ...filterState, location: value });
        default:
          let minPrice = 0;
          let maxPrice = 0;
          if (value === "below 100k") {
            minPrice = 0;
            maxPrice = 10 ** 5 - 1;
          } else if (value === "100k - 500k") {
            minPrice = 10 ** 5;
            maxPrice = 5 * 10 ** 5 - 1;
          } else if (value === "500k - 1.5m") {
            minPrice = 5 * 10 ** 5;
            maxPrice = 1.5 * 10 ** 6 - 1;
          } else if (value === "1.5m - 3.5m") {
            minPrice = 1.5 * 10 ** 6;
            maxPrice = 3.5 * 10 ** 6;
          }
          const filter: MobileFilterType = {
            ...filterState,
            minPrice,
            maxPrice,
          };
          !maxPrice && delete filter.maxPrice;

          return setFilterState(filter);
      }
    },
  };
}
