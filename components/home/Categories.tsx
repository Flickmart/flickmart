import { useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { api } from '@/convex/_generated/api';
import useResponsive from '@/hooks/useResponsive';
import { categoryItems } from '@/utils/constants';
import CategoryItem from './CategoryItem';
import Container from './Container';

export default function Categories() {
  const [showSubCategories, setShowSubCategories] = useState<false | string>(
    false
  );
  const isLarge = useResponsive('min-width: 1024px');

  const [categoryItemTop, setCategoryItemTop] = useState(0);

  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);

  const categoriesContainerTop =
    categoriesContainerRef?.current?.getBoundingClientRect().top || 0;

  return (
    <section
      className="sm:mt-2 lg:fixed lg:top-[75px] lg:left-0 lg:z-20 lg:mt-0 lg:w-[25%]"
      ref={categoriesContainerRef}
    >
      <h2 className="section-title mb-2 md:mb-4 lg:hidden">Categories</h2>
      <Container className={'!min-h-0'}>
        <div className="grid grid-cols-5 lg:flex lg:w-full lg:flex-col lg:pl-[30px]">
          {categoryItems.map((item) => (
            <CategoryItem
              categoryName={item.categoryName}
              key={item.categoryName}
              setCategoryItemTop={setCategoryItemTop}
              setShowSubCategories={setShowSubCategories}
            />
          ))}
        </div>
      </Container>
      {/* Overlay to dismiss subcategories menu on hover */}
      <AnimatePresence>
        {showSubCategories && isLarge && (
          <SubCategories
            categoriesContainerTop={categoriesContainerTop}
            categoryItemTop={categoryItemTop}
            setShowSubCategories={setShowSubCategories}
            showSubCategories={showSubCategories}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

const SubCategories = ({
  categoriesContainerTop,
  showSubCategories,
  setShowSubCategories,
  categoryItemTop,
}: {
  categoriesContainerTop: number;
  showSubCategories: string | false;
  setShowSubCategories: Dispatch<SetStateAction<string | false>>;
  categoryItemTop: number;
}) => {
  const subcategories = useQuery(api.categories.getCategory, {
    category: showSubCategories || 'homes',
  });

  let top = categoryItemTop;
  if (subcategories) {
    const subCategoriesHeight = subcategories.items.length * 64;
    if (categoryItemTop + subCategoriesHeight > innerHeight) {
      top = categoryItemTop - subCategoriesHeight + 64;
    }
  } else {
    const subCategoriesHeight = 256;
    if (categoryItemTop + 256 > innerHeight) {
      top = categoryItemTop - subCategoriesHeight + 64;
    }
  }

  while (categoriesContainerTop > top) {
    top += 64;
  }

  return (
    <div
      className="fixed inset-0 h-screen"
      onMouseOver={() => setShowSubCategories(false)}
    >
      <div
        className="fixed left-1/4 bg-transparent pl-3 transition-all duration-300"
        onMouseOver={(e) => {
          e.stopPropagation();
        }}
        style={{
          top,
        }}
      >
        <motion.ul
          animate={{
            width: 250,
            opacity: 1,
          }}
          className="overflow-hidden rounded shadow-[0_0_10px_2px_#00000020]"
          exit={{
            width: 0,
            opacity: 0,
          }}
          initial={{
            width: 0,
            opacity: 0,
          }}
        >
          {subcategories ? (
            subcategories.items.map((subcategory) => {
              let imgSrc = subcategory.title.includes('-')
                ? subcategory.title.split(' ').slice(0, 2).join(' ')
                : subcategory.title;
              if (showSubCategories === 'homes') {
                imgSrc = 'homes';
              }
              return (
                <Link
                  className="relative block h-16 overflow-hidden border-black/20 border-t bg-white p-1 first:border-none"
                  href={`/categories/${showSubCategories}?subcategory=${subcategory.title}`}
                  key={subcategory.title}
                >
                  <div className="flex h-full items-center justify-start gap-[10px] bg-[#F8F8F8] pl-2 transition-colors hover:bg-flickmart/15">
                    <div className="size-[45px] rounded bg-[#596A98]">
                      <Image
                        alt={subcategory.title}
                        className="size-full object-contain"
                        height={200}
                        src={`/categories/${imgSrc}.png`}
                        width={200}
                      />
                    </div>
                    <span className="font-bold text-[13px] text-gray-800 capitalize sm:text-sm lg:font-normal lg:font-poppins">
                      {subcategory.title}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <ul>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  className="relative block h-16 overflow-hidden border-black/20 border-t bg-white p-1 first:rounded-t first:border-none last:rounded-b"
                  key={i}
                >
                  <div className="relative flex h-full items-center justify-start gap-[10px] bg-[#F8F8F8] pl-2">
                    <div className="z-10 size-[45px] animate-pulse rounded bg-gray-300" />
                    <span className="z-10 h-3 w-24 animate-pulse rounded bg-gray-300" />
                  </div>
                </div>
              ))}
            </ul>
          )}
        </motion.ul>
      </div>
    </div>
  );
};
