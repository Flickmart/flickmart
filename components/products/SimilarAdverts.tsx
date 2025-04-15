import React from 'react'
import ProductCard from '../multipage/ProductCard'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'

export default function SimilarAdverts({productId}: {productId: Id<"product">}) {
  const similarProd= useQuery(api.product.getSimilarProducts, {productId, limit: 10})
  return (
    <div className='space-y-3 lg:space-y-7 p-3 lg:px-10 pt-5'>
        <div>
            <h2 className=' text-xl lg:text-3xl font-black '>Similar Adverts</h2>
        </div>
    <div className=' min-h-96 grid lg:grid-cols-4 grid-cols-2 gap-3  lg:gap-10'>
        {similarProd?.map((item, index)=> {
          return <div className='' key={index}>
            <Link href={`/product/${item._id}`}>
              <ProductCard image={item.images[0]} title={item.title} price={item.price}/>
            </Link>
          </div>
          })
        }
    </div>
    </div>
  )
}
