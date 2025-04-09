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
import { useState } from "react";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function ProductsPage() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const formatDesc = (desc: string) => {
    if (desc.length > 50) {
      return desc.slice(0, 50).trim() + "...";
    }
    return desc;
  };
  const [isExpanded, setIsExpanded] = useState(false);

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
        className={clsx(
          "flex relative items-center justify-between h-20 sm:h-32",
          {
            "!justify-end": isExpanded,
          }
        )}
      >
        <div
          className={clsx(
            "flex flex-grow items-center gap-3 transition-opacity duration-300 relative",
            {
              "opacity-0 lg:flex": isExpanded,
            }
          )}
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
              className="flex justify-between bg-white p-[6px] rounded-sm items-center shadow-md relative sm:p-2"
            >
              <div className="flex gap-3 items-center">
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
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28 min-w-0">
                  <DropdownMenuItem>
                    <Pencil className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="!text-red-500">
                    <Trash className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
