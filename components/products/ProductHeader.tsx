import { MapPin, MessageCircle, Share } from 'lucide-react'
import React from 'react'

export default function ProductHeader() {
  return (
    <div className="lg:space-y-3 w-full space-y-4 bg-white rounded-md p-5">
    <div className="flex text-xs font-light items-center gap-2 text-gray-500">
      <MapPin size={17}/>
      <span>Enugu, Nsukka, 3 hours ago </span>
    </div>
    <h2 className="text-xl font-bold">Apple Airpod Pro 2nd Gen</h2>
    <div className="space-x-3 flex items-center">
      <span className="inline-block text-flickmart-chat-orange text-lg font-extrabold  tracking-wider">&#8358;53,000</span>
      <span className="bg-green-500/80 tracking-widest p-1 rounded-md text-white font-semibold text-xs">Negotiable</span>
    </div>
    <div className=" flex  gap-3 text-white">
      <button className="p-2 px-3 min-w-1/4 font-medium bg-flickmart-chat-orange rounded-md flex items-center gap-2"> <MessageCircle/> Chat vendor</button>
      <button className="p-2 px-3 min-w-1/4 font-medium border border-flickmart-chat-orange text-flickmart-chat-orange rounded-md flex items-center gap-2"> <Share/> Share</button>
    </div> 
  </div>
  )
}
