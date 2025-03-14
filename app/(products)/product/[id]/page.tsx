"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Phone,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { CommentDrawer } from "@/components/products/comments";

export default function ProductPage() {
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="w-full py-4 sm:py-8 mt-16 bg-[url('/deliveryBanner.png')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                DELIVERY SERVICES
              </h2>
              <p className="text-base sm:text-lg text-white">
                Become a delivery partner with us
              </p>
              <p className="text-xs sm:text-sm text-white">
                Quick Service・No Delays
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 mt-2 sm:mt-4">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-square">
                    <Image
                      src="/airpods-demo.png"
                      alt="Apple Airpod Pro 2nd Gen"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      884.03 x 916
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-square">
                    <Image
                      src="/electronics.png"
                      alt="Apple Airpod Pro 2nd Gen"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      884.03 x 916
                    </div>{" "}
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-square">
                    <Image
                      src="/fashion.png"
                      alt="Apple Airpod Pro 2nd Gen"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      884.03 x 916
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>

            <div className="flex items-center justify-around pt-4 border-t">
              <Button variant="ghost" className="flex flex-col items-center">
                <ThumbsUp className="w-5 h-5" />
                <span className="text-xs">Likes</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center">
                <ThumbsDown className="w-5 h-5" />
                <span className="text-xs">Dislikes</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center"
                onClick={() => setIsCommentDrawerOpen(true)}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">Comments</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center">
                <Heart className="w-5 h-5" />
                <span className="text-xs">Wishlist</span>
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                Apple Airpod Pro 2nd Gen
              </h1>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-orange-500">
                  ₦53,000
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                  Verified
                </Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat vendor
              </Button>
              <Button className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Call vendor
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">
                Get the best sound from Airpod pro 2nd Gen. It lasts long and is
                very durable and noiseless. Get the best sound from Airpod pro
                2nd Gen. It lasts long and is very durable and noiseless.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Details</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Used:</span>
                    <span>No</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Category:</span>
                    <span>Electronics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Condition:</span>
                    <span>Exchange possible</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-red-500">
                  <li>
                    • Avoid paying to the seller directly, use the escrow
                    service to be safe
                  </li>
                  <li>
                    • Meet the seller or delivery person in a public place
                  </li>
                  <li>
                    • Inspect the item carefully to ensure it matches your
                    expectation
                  </li>
                  <li>
                    • Verify that the packed item is the one you inspected
                  </li>
                  <li>
                    • Click I have received the goods only when you are fully
                    satisfied
                  </li>
                </ul>
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 sm:mt-6">
              Post Ads Like This
            </Button>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Similar Adverts
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Product Cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Badge className="absolute top-2 left-2 z-10 bg-red-500">
                    HOT
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Image
                    src="/electronics.png"
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium line-clamp-2">
                    Freestyle Crew Racer leather jacket
                  </h3>
                  <p className="text-orange-500 font-bold mt-1">$595.00</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <CommentDrawer
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
      />
    </div>
  );
}
