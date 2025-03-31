import { Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProductCard() {
  return <Link href={`/product/jacket`}>
              <div className=" flex flex-col justify-between  min-h-64  rounded-md border border-gray-200 relative">
                <span className="absolute bg-white uppercase px-3 py-1 top-4 lg:top-5 lg:left-5 left-3 lg:text-base text-sm font-bold text-black rounded-sm">
                  hot
                </span>
                <span className=" p-1  bg-white absolute top-4 lg:top-5 lg:right-5 right-3 rounded-full">
                  <Bookmark className="fill-gray-500" />
                </span>
                <Image
                  src="/jacket.png"
                  alt="jacket"
                  width={500}
                  height={500}
                  className="h-72 lg:h-96 object-cover object-top  p-0.5 rounded-md "
                />
                <div className="flex flex-col p-3 space-y-2 text-left text-gray-800 font-semibold">
                  <span className="lg:text-base text-sm">
                    Freestyle Crew Racer leather jacket
                  </span>
                  <span className="text-flickmart lg:text-sm text-xs">
                    $149.99
                  </span>
                </div>
              </div>
            </Link>
  
}
