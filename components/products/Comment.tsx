import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MessageCircle } from 'lucide-react'

export default function Comment() {
  return (
    <div className="bg-white flex items-center lg:pr-10  justify-between py-7 px-3 gap-3  lg:p-7  rounded-md">
    <div className="flex items-center gap-3">
      <div>
        <Avatar>
          <AvatarImage src="/comment.png" alt="comment" />
          <AvatarFallback>EN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <h3 className="lg:text-lg font-semibold">Samuel Johnson</h3>
        <p className="text-xs">i searched for high quality mp3 speakers and it brought me here, but
        seeing this made me change my mind</p>
      </div>
    </div>
    <div className="flex flex-col items-center text-xs space-y-1">
      <MessageCircle/>
      <span>1200</span>
    </div>
  </div>
  )
}
