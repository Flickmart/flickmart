import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/convex/_generated/api';
import SearchInput from './SearchInput';

// const transitionProps = { duration: 0.2, type: "tween", ease: "easeInOut" };

export default function SearchOverlay({
  open,
  openSearch,
  query,
}: {
  query?: string;
  open: boolean;
  openSearch: (val: boolean) => void;
}) {
  const [autoSuggest, setAutoSuggest] = useState<
    { title: string; image: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const retrievePreviousInputs = useQuery(api.search.getSearchHistory, {});
  const deleteSearchInput = useMutation(api.search.deleteSearchHistory);
  const router = useRouter();
  const focusRef = useRef<HTMLInputElement>(null);
  function updateAutoSuggest(
    values: { title: string; image: string }[],
    search: string
  ) {
    setAutoSuggest(values);
    setSearchValue(search);
  }
  useEffect(() => {
    focusRef.current?.focus();
    if (open) {
      document.body.classList.add('overflow-y-hidden');
    } else {
      document.body.classList.remove('overflow-y-hidden');
    }
  }, [open]);
  useEffect(() => {
    if (retrievePreviousInputs?.error) {
      console.log(retrievePreviousInputs.error);
    }
  }, [retrievePreviousInputs]);

  return (
    <>
      {open && (
        <motion.div
          animate={{ y: 0, x: 0 }}
          className="fixed inset-0 z-50 flex min-h-screen flex-col overflow-x-auto bg-white py-3"
          initial={{ y: '100%', x: '-100%' }}
          transition={{
            duration: 0.2,
            type: 'tween',
            ease: 'easeInOut',
          }}
        >
          <div className="fixed top-0 flex w-full items-center justify-between gap-3 bg-white px-3 py-5 pr-7 text-gray-600 shadow-md">
            <ArrowLeft onClick={() => openSearch(false)} />
            <div className="flex-grow rounded-lg bg-gray-100">
              <SearchInput
                isOverlayOpen={open}
                openSearch={openSearch}
                query={query ?? ''}
                ref={focusRef}
                updateAutoSuggest={updateAutoSuggest}
              />
            </div>
          </div>
          {autoSuggest?.length === 0 || !searchValue ? (
            <div className="flex-grow pt-20">
              <p className="px-4 py-2 font-medium text-gray-500 text-xs capitalize">
                {(retrievePreviousInputs?.data?.length ?? 0) > 0
                  ? 'recent searches'
                  : 'no recent searches'}
              </p>
              {retrievePreviousInputs?.data?.map((item) => {
                return (
                  <div
                    className="flex cursor-pointer items-center justify-between px-4 py-1 pl-5 font-medium text-sm capitalize transition-all duration-700 ease-in-out hover:bg-gray-100"
                    key={item._id}
                  >
                    <p
                      className="flex-grow"
                      onClick={() => {
                        router.push(`/search?query=${item.search}`);
                        openSearch(false);
                      }}
                    >
                      {item.search}
                    </p>
                    <div
                      className="flex cursor-pointer justify-center rounded-full p-2 text-gray-600 transition-all duration-300 ease-out hover:bg-gray-200"
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
            <div className="flex-grow pt-16">
              <p className="px-4 py-4 font-medium text-gray-500 text-xs capitalize">
                {autoSuggest?.length > 0 && 'suggestions'}
              </p>
              {autoSuggest?.map((item, index) => (
                <div
                  className="flex items-center gap-3 px-4 py-2.5 font-medium text-sm capitalize transition-all duration-700 ease-in-out hover:bg-gray-100"
                  key={index}
                  onClick={() => {
                    router.push(`/search?query=${item.title}`);
                    openSearch(false);
                  }}
                >
                  <Image
                    alt={item.title}
                    className="h-7 w-11"
                    height={100}
                    src={item.image}
                    width={100}
                  />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
