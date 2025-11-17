import { categoryItems } from "@/utils/constants";
import CategoryItem from "./CategoryItem";
import Container from "./Container";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import useResponsive from "@/hooks/useResponsive";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  const [showSubCategories, setShowSubCategories] = useState<false | string>(
    false
  );
  const isLarge = useResponsive("min-width: 1024px");

  const [categoryItemTop, setCategoryItemTop] = useState(0);

  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);

  const categoriesContainerTop =
    categoriesContainerRef?.current?.getBoundingClientRect().top || 0;

  return (
    <section
      ref={categoriesContainerRef}
      className="sm:mt-2 lg:z-20 lg:fixed lg:w-[25%] lg:left-0 lg:top-[75px] lg:mt-0"
    >
      <h2 className="section-title mb-2 md:mb-4 lg:hidden">Categories</h2>
      <Container className={"!min-h-0"}>
        <div className="grid grid-cols-5 lg:flex lg:flex-col lg:w-full lg:pl-[30px]">
          {categoryItems.map((item) => (
            <CategoryItem
              categoryName={item.categoryName}
              key={item.categoryName}
              setShowSubCategories={setShowSubCategories}
              setCategoryItemTop={setCategoryItemTop}
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
            showSubCategories={showSubCategories}
            setShowSubCategories={setShowSubCategories}
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
    category: showSubCategories || "homes",
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
        style={{
          top,
        }}
        className="pl-3 fixed left-1/4 bg-transparent transition-all duration-300"
        onMouseOver={(e) => {
          e.stopPropagation();
        }}
      >
        <motion.ul
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: 250,
            opacity: 1,
          }}
          exit={{
            width: 0,
            opacity: 0,
          }}
          className="shadow-[0_0_10px_2px_#00000020] rounded overflow-hidden"
        >
          {subcategories ? (
            subcategories.items.map((subcategory) => {
              let imgSrc = subcategory.title.includes("-")
                ? subcategory.title.split(" ").slice(0, 2).join(" ")
                : subcategory.title;
                if(showSubCategories === "homes"){
                  imgSrc = "homes"
                }
              return (
                <Link
                  className="overflow-hidden block relative h-16 bg-white p-1 border-t border-black/20 first:border-none"
                  href={`/categories/${showSubCategories}?subcategory=${subcategory.title}`}
                  key={subcategory.title}
                >
                  <div className="flex items-center justify-start h-full transition-colors gap-[10px] bg-[#F8F8F8] hover:bg-flickmart/15 pl-2">
                    <div className="bg-[#596A98] size-[45px] rounded">
                      <Image
                        alt={subcategory.title}
                        className="size-full object-contain"
                        height={200}
                        src={`/categories/${imgSrc}.png`}
                        width={200}
                      />
                    </div>
                    <span className="font-bold text-[13px] text-gray-800 capitalize sm:text-sm lg:font-poppins lg:font-normal">
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
                  key={i}
                  className="block relative h-16 bg-white p-1 border-t border-black/20 first:border-none first:rounded-t last:rounded-b overflow-hidden"
                >
                  <div className="flex items-center justify-start h-full gap-[10px] bg-[#F8F8F8] pl-2 relative">
                    <div className="bg-gray-300 size-[45px] rounded z-10 animate-pulse" />
                    <span className="h-3 w-24 bg-gray-300 rounded z-10 animate-pulse" />
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
