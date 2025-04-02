"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";
import {
  ArrowLeft,
  EllipsisVertical,
  Pencil,
  Search,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";

const demoProducts = [
  {
    id: 1,
    name: "Product 1",
    desc: "Product 1 description",
    price: "50000",
    image: "/car.jpeg",
  },
  {
    id: 2,
    name: "Product 1",
    desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: "50000",
    image: "/car.jpeg",
  },
  {
    id: 3,
    name: "Product 1",
    desc: "Product 1 description",
    price: "50000",
    image: "/car.jpeg",
  },
];
interface ProductMenuState {
  id: number;
  isOpen: boolean;
}

export default function ProductsPage() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [productsMenuStates, setProductsMenuStates] = useState<
    ProductMenuState[]
  >([]);

  useEffect(() => {
    setProductsMenuStates(
      demoProducts.map((product) => ({ id: product.id, isOpen: false }))
    );
  }, []);

  const formatDesc = (desc: string) => {
    if (desc.length > 50) {
      return desc.slice(0, 50).trim() + "...";
    }
    return desc;
  };
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-8 p-4 lg:px-10">
      <header className="flex items-center">
        {!isMobile ? (
          <SidebarTrigger className="-ml-1" />
        ) : (
          <>
            <ArrowLeft
              className="cursor-pointer -ml-1"
              onClick={() => setOpenMobile(!openMobile)}
            />
          </>
        )}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div
        className={clsx("flex relative items-center justify-between h-20 sm:h-32", {
          "!justify-end": isExpanded,
        })}
      >
        <div
          className={clsx("flex flex-grow items-center gap-3 transition-opacity duration-300 relative", {
            "opacity-0 lg:flex": isExpanded,
          })}
        >
          <div className="relative size-20 sm:size-32">
            <Image src="/store-avatar.png" alt="avatar" fill />
          </div>
          <div>
            <h1 className="text-xl capitalize sm:text-2xl">Mbah Tolu stores</h1>
            <p className="text-xs text-black/60 sm:text-sm">
              {" "}
              Select goods from this store
            </p>
          </div>
        </div>
        <AnimatedSearchBar
          placeholder="Search for anything..."
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          type="button"
          className="absolute right-2 hover:text-flickmart"
        >
          {isExpanded ? (
            <X className="size-6 sm:size-8 transition-all duration-300" />
          ) : (
            <Search className="size-6 sm:size-8 transition-all duration-300" />
          )}
        </button>
      </div>
      <div>
        <ul className="grid gap-4">
          {demoProducts.map((product) => (
            <li
              key={product.id}
              className="flex gap-3 bg-white p-[6px] rounded-sm items-center shadow-md relative sm:p-2"
            >
              <div className="size-20 sm:size-28 relative flex-shrink-0">
                <Image
                  className="object-cover rounded-sm"
                  fill
                  src={product.image}
                  alt={product.name}
                ></Image>
              </div>
              <div>
                <h2 className="sm:text-lg font-bold">{product.name}</h2>
                <p className="text-xs sm:text-sm font-light mb-1 sm:mb-2 md:mb-4">
                  {formatDesc(product.desc)}
                </p>
                <span className="text-xs sm:text-sm font-bold text-flickmart">
                  &#8358;{product.price}
                </span>
              </div>
              <button
                onClick={() => {
                  setProductsMenuStates((prev) =>
                    prev.map((state) =>
                      state.id === product.id
                        ? { ...state, isOpen: !state.isOpen }
                        : { ...state, isOpen: false }
                    )
                  );
                }}
                className="absolute top-3 right-1"
                type="button"
              >
                <EllipsisVertical className="hover:text-flickmart transition-all duration-300 size-4 sm:size-5 md:size-6" />
              </button>
              {productsMenuStates.find((state) => state.id === product.id)
                ?.isOpen && (
                <div className="absolute top-8 right-2 bg-white text-sm shadow-[0_3px_10px_#00000040] rounded-sm font-semibold overflow-hidden sm:text-sm sm:top-10">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        className="hover:bg-gray-200 transition-all duration-300 flex flex-row items-center gap-2 w-full px-2 py-1 sm:p-2"
                        type="button"
                      >
                        <Pencil className="size-4 sm:size-[18px]" />
                        <span>Edit</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="hover:bg-gray-200 transition-all duration-300 flex flex-row items-center gap-2 w-full px-2 py-1 sm:p-2 text-red-600"
                        type="button"
                      >
                        <Trash className="size-4 sm:size-[18px]" />
                        <span>Delete</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
