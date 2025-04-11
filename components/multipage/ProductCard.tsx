import { Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProductCard({image, title, price}: {image?: string; title?: string; price?: number}) {
  return <Link href={`/product/jacket`}>
              <div className=" flex flex-col justify-between  min-h-64  rounded-md border border-gray-200 relative">
                <span className="absolute bg-white uppercase px-3 py-1 top-4 lg:top-5 lg:left-5 left-3 lg:text-base text-sm font-bold text-black rounded-sm">
                  hot
                </span>
                <span className=" p-1  bg-white absolute top-4 lg:top-5 lg:right-5 right-3 rounded-full">
                  <Bookmark className="fill-gray-500" />
                </span>
                {image?
                  <Image
                    src={image || ""}
                    alt={title || ""}
                    width={500}
                    height={500}
                    className="h-72 lg:h-96 object-cover object-top  p-0.5 rounded-md "
                  /> : null
                }
                <div className="flex flex-col p-3 space-y-2 text-left text-gray-800 font-semibold">
                  <span className="lg:text-base text-sm">
                    {title}
                  </span>
                  <span className="text-flickmart lg:text-sm text-xs">
                  &#8358;{price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
  
}
