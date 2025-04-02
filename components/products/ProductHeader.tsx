import { MapPin, MessageCircle, Share } from 'lucide-react'
import React from 'react'
import {useQuery, useMutation} from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useRouter } from 'next/navigation'
import {toast} from "sonner"

export default function ProductHeader() {
  const router = useRouter()
  const user = useQuery(api.users.current)
  const vendor = "j572dfwwtmyqy0g3wgnn3rdk9x7d2p48" as Id<'users'>

  const handleChat = async () => {
    if (!user) {
      toast.error("Please login to chat with vendor");
      return;
    }
    
    // Navigate to chat page with vendor ID as query parameter
    router.push(`/chats?vendorId=${vendor}`);
    toast.success("Starting chat with vendor");
  }
  
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
      <button className="p-2 px-3 min-w-1/4 font-medium bg-flickmart-chat-orange rounded-md flex items-center gap-2" onClick={handleChat}> <MessageCircle/> Chat vendor</button>
      <button className="p-2 px-3 min-w-1/4 font-medium border border-flickmart-chat-orange text-flickmart-chat-orange rounded-md flex items-center gap-2"> <Share/> Share</button>
    </div> 
  </div>
  )
}
