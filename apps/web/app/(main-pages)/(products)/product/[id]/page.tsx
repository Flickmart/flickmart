'use client';
import { useMutation, useQuery } from 'convex/react';
import {
  Bookmark,
  ChevronLeft,
  Heart,
  MessageCircle,
  Store,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'sonner';
import Comment from '@/components/products/Comment';
import CommentContent from '@/components/products/CommentContent';
import ProductHeader from '@/components/products/ProductHeader';
import SimilarAdverts from '@/components/products/SimilarAdverts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useIsLarge } from '@/hooks/useLarge';
import useNav from '@/hooks/useNav';
import useSlider from '@/hooks/useSlider';
import { useTrack } from '@/hooks/useTrack';
import { useTrackDuration } from '@/hooks/useTrackDuration';

export default function ProductPage() {
  const [viewed, setViewed] = useState(false);
  const isVisible = useNav();
  const isMobile = useIsMobile();
  const isLarge = useIsLarge();
  const params = useParams();
  const searchParams = useSearchParams();
  const recommendationId = searchParams.get('id');
  const productId = params.id as Id<'product'>;
  const likeProduct = useMutation(api.product.likeProduct);
  const dislikeProduct = useMutation(api.product.dislikeProduct);
  const bookmarkProduct = useMutation(api.product.addBookmark);
  const [anonId, setAnonId] = useState<string | null>('');
  const productData = productId
    ? useQuery(api.product.getById, { productId })
    : null;
  const like = useQuery(api.product.getLikeByProductId, { productId });
  const saved = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: 'saved',
  });
  const wishlist = useQuery(api.product.getSavedOrWishlistProduct, {
    productId,
    type: 'wishlist',
  });
  const view = useMutation(api.views.createView);
  const _exchangePossible = productData?.exchange === true ? 'yes' : 'no';
  const { setApi, setAutoScroll } = useSlider();
  const comments = useQuery(api.comments.getCommentsByProductId, {
    productId,
  });
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  const router = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  // captureActivity is a function which can me reused to capture different Activities
  const captureActivity = useTrack();

  // Track Page Duration
  useTrackDuration(productId, user?._id, recommendationId ?? '');
  const productIcons = [
    {
      label: 'likes',
      icon: (
        <ThumbsUp
          className={`fill] transform transition-[stroke, duration-500 ease-in-out hover:scale-110 ${
            like?.liked
              ? 'fill-flickmart stroke-none'
              : 'fill-none stroke-current'
          }`}
        />
      ),
    },
    {
      label: 'dislikes',
      icon: (
        <ThumbsDown
          className={`fill] transform transition-[stroke, duration-500 ease-in-out hover:scale-110 ${
            like?.disliked
              ? 'fill-flickmart stroke-none'
              : 'fill-none stroke-current'
          }`}
        />
      ),
    },
    {
      label: 'wishlist',
      icon: (
        <Heart
          className={`fill] transform transition-[stroke, duration-500 ease-in-out hover:scale-110 ${
            wishlist?.data?.added
              ? 'fill-red-600 stroke-none'
              : 'fill-none stroke-current'
          }`}
        />
      ),
    },
  ];

  const handleGestures = async (label: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please sign in to perform this action');
        router.push(`/sign-in?callback=/product/${productId}`);
        return;
      }
      if (label === 'likes') {
        await likeProduct({ productId });

        // capture activity of liking a product
        captureActivity('Product Liked', {
          productId,
          userId: user?._id ?? '',
          recommId: recommendationId,
          rating: 5,
          likes: (productData?.likes ?? 0) + 1,
        });
      }
      if (label === 'dislikes') {
        await dislikeProduct({ productId });
      }
      if (label === 'wishlist' || label === 'saved') {
        const bookmarked = await bookmarkProduct({ productId, type: label });

        if (typeof bookmarked !== 'string' && bookmarked?.added) {
          captureActivity('Product Added to Wishlist', {
            productId,
            userId: user?._id ?? '',
            recommId: recommendationId,
            price: productData?.price ?? 0,
          });
        }

        // bookmarked?.added

        typeof bookmarked === 'object' && bookmarked?.added
          ? toast.success(`Item added to ${label}`)
          : toast.success(`Item removed from ${label}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdated(false);
    }
  };

  const [enlarge, setEnlarge] = useState(false);

  if (isLarge && enlarge) {
    setEnlarge(false);
    setAutoScroll(true);
  }

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const anonymousUserId = localStorage.getItem("anonId");
    if(!anonId){
      setAnonId(anonymousUserId);
    }
    if (!productData) {
      setLoading(true);
      return;
    }
    // View Page once it loads
    if (!viewed) {
      // Update view count on the db
      view({ productId }).then((data) => console.log(data));

      // Send Interaction to Source
      captureActivity('Product Viewed', {
        userId: user?._id ?? anonId,
        productId,
        recommId: recommendationId,
        // ...productProps
      });
      setViewed(true);
      return;
    }
    setLoading(false);
  }, [productData, viewed, isUpdated]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <SyncLoader color="#f81" />
      </div>
    );
  }

  return (
    <Drawer>
      <div className="min-h-screen gap-x-6 space-y-7 bg-slate-100 lg:p-5">
        <div className="gap-5 space-y-3 lg:grid lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center border">
            <div
              className={
                enlarge
                  ? 'fixed top-0 right-0 z-[60] block h-screen w-screen bg-black sm:bg-black/75'
                  : 'hidden'
              }
              onClick={(e) => {
                e.stopPropagation();
                setEnlarge(false);
                setAutoScroll(true);
              }}
            >
              <button type="button">
                <ChevronLeft
                  className="absolute top-6 left-2 text-white transition-colors hover:text-flickmart sm:hidden"
                  size={30}
                />
                <X
                  className="absolute top-6 left-2 hidden text-white transition-colors hover:text-flickmart sm:block"
                  size={30}
                />
              </button>
            </div>
            <div
              className={`cursor-pointer sm:cursor-default ${
                enlarge ? 'enlarge' : ''
              }`}
              onClick={() => {
                setEnlarge(true);
                setAutoScroll(false);
              }}
            >
              <Carousel setApi={setApi}>
                <CarouselContent>
                  {productData?.images.map((image, index) => {
                    return (
                      <CarouselItem key={index}>
                        <Image
                          alt={productData.title}
                          className="aspect-square h-full w-full object-cover lg:h-[550px]"
                          height={500}
                          src={image}
                          width={500}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>

            {isMobile ? (
              <ProductHeader
                aiEnabled={productData?.aiEnabled ?? false}
                description={productData?.description || ''}
                location={productData?.location ?? ''}
                price={productData?.price ?? 0}
                productId={productId}
                recommendationId={recommendationId ?? ''}
                timestamp={productData?.timeStamp ?? ''}
                title={productData?.title ?? ''}
                userId={productData?.userId!}
              />
            ) : null}
            <div className="flex w-full justify-around rounded-md bg-white p-5">
              {productIcons.map((item) => {
                return (
                  <div
                    className="cursor-pointer space-y-3 text-center capitalize"
                    key={item.label}
                    onClick={() => handleGestures(item.label)}
                  >
                    <div className={'flex justify-center'}>{item.icon}</div>{' '}
                    <span className="inline-block text-sm lg:text-lg">
                      {productData?.likes && item.label === 'likes'
                        ? productData.likes
                        : productData?.dislikes && item.label === 'dislikes'
                          ? productData.dislikes
                          : item.label}
                    </span>
                  </div>
                );
              })}
              <DrawerTrigger className="">
                <div className="cursor-pointer space-y-3 text-center capitalize">
                  <div className={'flex justify-center'}>
                    <MessageCircle />
                  </div>
                  <span className="inline-block text-sm lg:text-lg">
                    {comments?.length ? comments.length : 'comment'}
                  </span>
                </div>
              </DrawerTrigger>
              <CommentContent
                productId={productId}
                recommId={recommendationId ?? ''}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-3">
            {isMobile && comments?.length ? (
              <Comment
                productId={productId}
                recommId={recommendationId ?? ''}
              />
            ) : null}
            {isMobile ? null : (
              <ProductHeader
                aiEnabled={productData?.aiEnabled ?? false}
                description={productData?.description ?? ''}
                location={productData?.location ?? ''}
                price={productData?.price ?? 0}
                productId={productId}
                recommendationId={recommendationId ?? ''}
                timestamp={productData?.timeStamp ?? ''}
                title={productData?.title ?? ''}
                userId={productData?.userId!}
              />
            )}
            <div className="space-y-2 rounded-md bg-white p-5">
              <h3 className="font-semibold text-flickmart-chat-orange text-lg tracking-wider">
                Description
              </h3>
              <p className="break-words text-justify text-sm leading-snug">
                {productData?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-5 rounded-md bg-white p-5 capitalize">
              <span>condition</span>
              <span className="font-semibold">{productData?.condition}</span>
              <span>category</span>
              <span className="font-semibold">{productData?.category}</span>
              <span>negotiable</span>
              <span className="font-semibold">
                {productData?.negotiable ? 'yes' : 'no'}
              </span>
            </div>
            <div className="rounded-md bg-white px-5">
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="!font-semibold">
                    Safety Tips
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col space-y-2">
                    <span>
                      Avoid paying to the seller directly,use the escrow service
                      to be safe
                    </span>
                    <span>
                      Meet the seller or delivery person in a public place
                    </span>
                    <span>
                      Inspect the item carefully to ensure it matches your
                      expectation
                    </span>
                    <span>
                      Verify that the packed item is the one you inspected
                    </span>
                    <span>
                      Click i have received the goods only when you are fully
                      satisfied
                    </span>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div
              className={` ${
                isVisible ? 'translate-y-0' : '-translate-y-[-100%]'
              } fixed bottom-0 z-30 flex w-full space-x-5 bg-white p-3 transition duration-300 lg:relative lg:translate-y-0 lg:p-0`}
            >
              <div
                className="flex w-1/4 items-center justify-center rounded-md bg-white shadow-md transition-all duration-300 hover:scale-110 lg:w-1/12"
                onClick={() => handleGestures('saved')}
              >
                <button className="rounded-full bg-white p-2 text-flickmart-chat-orange shadow-lg">
                  <Bookmark
                    className={`fill transform transition-[stroke, duration-500 ease-in-out hover:scale-110 ${
                      saved?.data?.added
                        ? 'fill-flickmart stroke-none'
                        : 'fill-none stroke-current'
                    }`}
                  />
                </button>
              </div>
              <Link
                className="w-full transition-all duration-300 hover:scale-105"
                href="/post-ad"
              >
                <button className="flex w-full items-center justify-center gap-10 rounded-md bg-flickmart-chat-orange py-4 font-medium text-white capitalize">
                  <Store className="!font-thin" size={25} />
                  <span className="text-lg">post ads like this</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        {isMobile || !comments?.length ? null : (
          <Comment productId={productId} recommId={recommendationId ?? ''} />
        )}
        <SimilarAdverts productId={productId} />
      </div>
    </Drawer>
  );
}
