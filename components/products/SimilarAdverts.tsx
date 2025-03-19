import React from 'react'
import ProductCard from '../multipage/ProductCard'

export default function SimilarAdverts() {
  return (
    <div className='space-y-3 lg:space-y-7 p-3 lg:px-10 pt-5'>
        <div>
            <h2 className=' text-xl lg:text-3xl font-black '>Similar Adverts</h2>
        </div>
    <div className=' min-h-96 lg:grid grid-cols-4  gap-10'>
        {Array.from({length:11}).map((_, index)=> <div className='' key={index}>
            <ProductCard/>
            </div>)}
    </div>
    </div>
  )
}
