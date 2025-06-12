import { ArrowLeft, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { motion } from "motion/dist/react";

export default function SearchOverlay({
  open,
  openSearch,
  query,
}: {
  query?: string;
  open: boolean;
  openSearch: (val: boolean) => void;
}) {
  const [autoSuggest, setAutoSuggest] = useState<Array<string>>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const retrievePreviousInputs = useQuery(api.search.getSearchHistory, {});
  const deleteSearchInput = useMutation(api.search.deleteSearchHistory);
  const router = useRouter();
  const focusRef = useRef<HTMLInputElement>(null);
  function updateAutoSuggest(values: Array<string>, search: string) {
    setAutoSuggest(values);
    setSearchValue(search);
  }
  useEffect(
    function () {
      focusRef.current?.focus();
    },
    [open]
  );
  return (
    <>
      {open && (
        <div className="py-3  flex flex-col bg-white min-h-screen fixed z-40 inset-0 ">
          <div className="flex shadow-md text-gray-600 py-3 px-3 justify-between items-center gap-3">
            <ArrowLeft onClick={() => openSearch(false)} />
            <div className="bg-gray-100 rounded-lg flex-grow">
              <SearchInput
                updateAutoSuggest={updateAutoSuggest}
                openSearch={openSearch}
                query={query ?? ""}
                isOverlayOpen={open}
                ref={focusRef}
              />
            </div>
          </div>
          {autoSuggest?.length === 0 || !searchValue ? (
            <div className="flex-grow pt-3">
              <p className="px-4 py-4 text-gray-500 text-xs font-medium capitalize">
                {(retrievePreviousInputs?.length ?? 0) > 0 && "recent searches"}
              </p>
              {retrievePreviousInputs?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="px-4 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-all duration-700 ease-in-out font-medium text-sm capitalize"
                  >
                    <p
                      className="flex-grow"
                      onClick={() => {
                        router.push(`/search?query=${item.search}`);
                        openSearch(false);
                      }}
                      key={index}
                    >
                      {item.search}
                    </p>
                    <div
                      className="text-gray-600 p-2 transition-all duration-300 ease-out flex justify-center rounded-full hover:bg-gray-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSearchInput({
                          searchId: item._id,
                        });
                      }}
                    >
                      <X size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow pt-3">
              <p className="px-4 py-4 text-gray-500 text-xs font-medium capitalize">
                {autoSuggest?.length > 0 && "suggestions"}
              </p>
              {autoSuggest?.map((item, index) => (
                <p
                  onClick={() => {
                    router.push(`/search?query=${item}`);
                    openSearch(false);
                  }}
                  className="px-4 py-4 hover:bg-gray-100 transition-all duration-700 ease-in-out font-medium text-sm capitalize"
                  key={index}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
