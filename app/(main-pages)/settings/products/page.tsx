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
import { useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";
import {
  ArrowLeft,
  EllipsisVertical,
  Eye,
  Pencil,
  Search,
  ThumbsDown,
  ThumbsUp,
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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

export default function ProductsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { openMobile, setOpenMobile } = useSidebar();
  const userStore = useQuery(api.store.getStoresByUserId);
  const userProducts = useQuery(api.product.getByBusinessId, {
    businessId: userStore?.data?._id as Id<"store">,
  });
  const deleteProduct = useMutation(api.product.remove);
  const formatDesc = (desc: string) => {
    if (desc.length > 50) {
      return desc.slice(0, 50).trim() + "...";
    }
    return desc;
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const analyticsObj = userProducts?.reduce(
    (previous, current) => ({
      likes: (current.likes ?? 0) + previous.likes,
      views: (current.views ?? 0) + previous.views,
      dislikes: (current.dislikes ?? 0) + previous.dislikes,
    }),
    {
      likes: 0,
      views: 0,
      dislikes: 0,
    }
  );
  const analyticsItems = [
    {
      icon: ThumbsUp,
      number: analyticsObj?.likes,
      title: "likes",
    },
    {
      icon: Eye,
      number: analyticsObj?.views,
      title: "views",
    },
    {
      icon: ThumbsDown,
      number: analyticsObj?.dislikes,
      title: "dislikes",
    },
  ];
  return (
    <>
      <header className="flex items-center shadow-sm p-5">
        <ArrowLeft
          className="cursor-pointer -ml-1"
          onClick={() => setOpenMobile(!openMobile)}
        />

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
      <div className="flex flex-col gap-7 p-4 lg:px-10">
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
            <Avatar className="size-20 sm:size-32">
              {userStore?.data?.image && (
                <AvatarImage
                  src={userStore?.data?.image}
                  alt="business profile image"
                />
              )}
              <AvatarFallback>
                {userStore?.data?.name
                  ?.split(" ")
                  .map((item) => item[0]?.toUpperCase())
                  .join(" ")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 text-black/60">
              <h1 className="text-xl capitalize sm:text-2xl">
                {userStore?.data?.name}
              </h1>
              <span className="text-base ">Welcome back, Flickmartan!</span>
              {/* <span className="text-xs">What are we selling today?</span> */}
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
        <div className=" flex justify-center gap-7 items-center ">
          {analyticsItems.map((item) => (
            <div
              key={item.title}
              className="min-h-16 text-gray-700 flex py-3 gap-2 capitalize  justify-center shadow-md items-center border border-flickmartLight  w-1/3 rounded-lg"
            >
              <item.icon size={28} />
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">{item.number}</span>
                <span className="text-xs">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 ">
          <h3 className="capitalize font-semibold text-lg">my products</h3>
          <ul className="flex flex-col gap-5">
            {!userProducts?.length ? (
              <div className="h-96 flex justify-center items-center  flex-grow">
                <span>You hav'nt posted any product yet</span>
              </div>
            ) : (
              userProducts?.map((product) => (
                <Link
                  href={`/product/${product._id}`}
                  key={product._id}
                  className="hover:scale-105 hover:rotate-1 hover:bg-gray-200 transition-all duration-300"
                >
                  <li className="flex justify-between bg-inherit p-[6px] rounded-sm items-center shadow-md relative sm:p-2">
                    <div className="flex gap-3 items-center">
                      <div className="size-20 sm:size-28 relative flex-shrink-0">
                        {product.images[0] && (
                          <Image
                            className="object-cover rounded-sm"
                            fill
                            src={product.images[0]}
                            alt={product.title}
                          />
                        )}
                      </div>
                      <div>
                        <h2 className="sm:text-lg font-bold">
                          {product.title}
                        </h2>
                        <p className="text-xs sm:text-sm font-light mb-1 sm:mb-2 md:mb-4">
                          {formatDesc(product.description)}
                        </p>
                        <span className="text-xs sm:text-sm font-bold text-flickmart">
                          &#8358;{product.price}
                        </span>
                      </div>
                    </div>

                    <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="rounded-full p-2 hover:bg-gray-300 transition-all duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <EllipsisVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="w-28 min-w-0"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/post-ad?product-id=${product._id}`)
                            }
                          >
                            <Pencil className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="!text-red-500">
                            <DialogTrigger className="flex items-center">
                              <Trash className="mr-2" />
                              Delete
                            </DialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent
                        className="rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to delete this product?
                          </DialogTitle>
                          <DialogDescription>
                            Deleting this product will remove it from your store
                            permanently.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setDeleteDialog(false)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              try {
                                setIsDeleting(true);
                                await deleteProduct({ productId: product._id });
                                toast.success(
                                  "Product deleted successfully..."
                                );
                                setDeleteDialog(false);
                              } catch (err) {
                                console.log(err);
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                            disabled={isDeleting}
                            className="bg-flickmart"
                          >
                            {isDeleting ? (
                              <ClipLoader size={20} color="#ffffff" />
                            ) : (
                              "Yes, Delete"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                </Link>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
