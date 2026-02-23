'use client';

import clsx from 'clsx';
import { useMutation, useQuery } from 'convex/react';
import {
  ChevronLeft,
  EllipsisVertical,
  Eye,
  Pencil,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import AnimatedSearchBar from '@/components/AnimatedSearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';

export default function ProductsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const userStore = useQuery(api.store.getStoresByUserId);
  const products = useQuery(api.product.getByBusinessId, {
    businessId: userStore?.data?._id as Id<'store'>,
  });
  const [userProducts, setUserProducts] = useState(products);
  const deleteProduct = useMutation(api.product.remove);
  const formatDesc = (desc: string) => {
    if (desc.length > 50) {
      return `${desc.slice(0, 50).trim()}...`;
    }
    return desc;
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const analyticsObj = userProducts?.reduce(
    (previous, current) => ({
      likes: (current?.likes ?? 0) + previous.likes,
      views: (current?.views ?? 0) + previous.views,
      dislikes: (current?.dislikes ?? 0) + previous.dislikes,
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
      title: 'likes',
    },
    {
      icon: Eye,
      number: analyticsObj?.views,
      title: 'views',
    },
    {
      icon: ThumbsDown,
      number: analyticsObj?.dislikes,
      title: 'dislikes',
    },
  ];
  useEffect(() => {
    setUserProducts(products);
  }, [products]);

  function handleSearch(textInput: string) {
    const filteredProducts = products?.filter((item) => {
      const { title, description, price } = item;

      return (
        title.toLowerCase().startsWith(textInput) ||
        description.toLowerCase().startsWith(textInput) ||
        price.toString().toLowerCase().startsWith(textInput)
      );
    });
    setUserProducts(filteredProducts);
  }
  return (
    <div className="flex w-full flex-col">
      <header className="flex items-center p-5 shadow-md">
        <ChevronLeft
          className="size-7 cursor-pointer"
          onClick={() => router.back()}
        />

        <Separator className="mr-2 h-4" orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/settings">Settings</Link>
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
            'relative flex h-20 items-center justify-between sm:h-32',
            {
              '!justify-end': isExpanded,
            }
          )}
        >
          <div
            className={clsx(
              'relative flex flex-grow items-center gap-3 transition-opacity duration-300',
              {
                'opacity-0 lg:flex': isExpanded,
              }
            )}
          >
            <Avatar className="size-20 sm:size-32">
              {userStore?.data?.image && (
                <AvatarImage
                  alt="business profile image"
                  src={userStore?.data?.image}
                />
              )}
              <AvatarFallback>
                {userStore?.data?.name
                  ?.split(' ')
                  .map((item) => item[0]?.toUpperCase())
                  .join(' ')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 text-black/60">
              <h1 className="text-xl capitalize sm:text-2xl">
                {userStore?.data?.name}
              </h1>
              <span className="text-sm">Welcome back, Flickmartan!</span>
            </div>
          </div>
          <AnimatedSearchBar
            handleSearch={handleSearch}
            isExpanded={isExpanded}
            placeholder="Search for anything..."
          />
          <button
            className="absolute right-2 hover:text-flickmart"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
            type="button"
          >
            {isExpanded ? (
              <X className="size-6 transition-all duration-300 sm:size-8" />
            ) : (
              <Search className="size-6 transition-all duration-300 sm:size-8" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-7">
          {analyticsItems.map((item) => (
            <div
              className="flex min-h-16 w-1/3 items-center justify-center gap-2 rounded-lg border border-flickmartLight py-3 text-gray-700 capitalize shadow-md"
              key={item.title}
            >
              <item.icon size={28} />
              <div className="flex flex-col items-center">
                <span className="font-semibold text-xl">
                  {item.number ?? '--'}
                </span>
                <span className="text-xs">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg capitalize">my products</h3>
          <ul className="flex flex-col gap-5">
            {userProducts === null ? (
              <div className="flex h-96 flex-grow items-center justify-center">
                <span>You have not posted any product yet</span>
              </div>
            ) : userProducts?.length === 0 ? (
              <div className="flex h-96 flex-grow items-center justify-center text-lg capitalize">
                <span>no product found</span>
              </div>
            ) : (
              userProducts?.map((product) => (
                <motion.div
                  animate={{
                    opacity: 1,
                  }}
                  className="transition-all duration-300 hover:bg-gray-200"
                  initial={{
                    opacity: 0,
                  }}
                  key={product._id}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  <Link href={`/product/${product._id}`}>
                    <li className="relative flex items-center justify-between rounded-sm bg-inherit p-[6px] shadow-md sm:p-2">
                      <div className="flex items-center gap-3">
                        <div className="relative size-20 flex-shrink-0 sm:size-28">
                          {product.images[0] && (
                            <Image
                              alt={product.title}
                              className="rounded-sm object-cover"
                              fill
                              src={product.images[0]}
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <h2 className="font-bold sm:text-lg">
                            {product.title}
                          </h2>
                          <p className="font-light text-xs sm:text-sm">
                            {formatDesc(product.description)}
                          </p>
                          <span className="font-bold text-flickmart text-xs sm:text-sm">
                            &#8358;{product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Dialog
                        onOpenChange={setDeleteDialog}
                        open={deleteDialog}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="rounded-full p-2 transition-all duration-300 hover:bg-gray-300"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <EllipsisVertical className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-28 min-w-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/post-ad?product-id=${product._id}&action=edit`
                                )
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
                              Deleting this product will remove it from your
                              store permanently.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-3">
                            <Button
                              disabled={isDeleting}
                              onClick={() => setDeleteDialog(false)}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-flickmart"
                              disabled={isDeleting}
                              onClick={async () => {
                                try {
                                  setIsDeleting(true);
                                  await deleteProduct({
                                    productId: product._id,
                                  });
                                  toast.success(
                                    'Product deleted successfully...'
                                  );
                                  setDeleteDialog(false);
                                } catch (err) {
                                  console.log(err);
                                } finally {
                                  setIsDeleting(false);
                                }
                              }}
                            >
                              {isDeleting ? (
                                <ClipLoader color="#ffffff" size={20} />
                              ) : (
                                'Yes, Delete'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </li>
                  </Link>
                </motion.div>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
