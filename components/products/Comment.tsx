import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MessageCircle, X } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogTrigger } from '../ui/dialog'
import ChatInput from '../chats/chat-input'

export default function Comment({productId}: {productId: Id<"product">}) {
  const comments= useQuery(api.comments.getCommentsByProductId, { productId })
  const [input, setInput] = useState("");
  const addComment= useMutation(api.comments.addComment)
  function handleComment(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    addComment({ productId, content: input})
    setInput("")
  }

  return (
    <div className="bg-white flex items-center lg:pr-10  justify-between py-7 px-3 gap-3  lg:p-7  rounded-md">
    <div className="flex items-start gap-3">
      <div className='pt-2'>
        <Avatar>
          <AvatarImage src={comments?.[0]?.user?.imageUrl} alt={comments?.[0]?.user?.name || ''} />
          <AvatarFallback>EN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col space-y-2">
        <h3 className="lg:text-lg font-semibold">{comments?.[0]?.user?.name}</h3>
        <p className="text-xs">{comments?.[2]?.content}</p>
      </div>
    </div>
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer flex flex-col items-center text-xs space-y-1">
          <MessageCircle/>
          <span>{comments?.length}</span>
        </div>
      </DialogTrigger>
      <DialogContent className='!h-3/4 flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-center !font-bold'>
          {comments?.length} {comments?.length === 1? "comment" : "comments"}
          </DialogTitle>   
        </DialogHeader>
        <div className='flex-grow flex flex-col gap-2 overflow-x-auto pb-5'>
          {!comments?.length? <div className='flex-grow grid place-items-center text-lg'>
            <span>No comments yet</span>
          </div> :
          // {/* // {Array.from({length: 3}).map((comment, index)=>{ */}
            comments?.map((comment, index)=>{
              const {user}= comment
              return (
                <div className=' flex gap-4 py-4' key={index}>
                  <div className=' flex justify-center items-start pt-2'>
                    <Avatar className='size-10 lg:size-12'>
                      <AvatarImage src={user?.imageUrl} alt={user?.name} />
                      <AvatarFallback>EN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <h3 className='text-base font-bold'>{user?.name}</h3> 
                    <p>{comment.content}</p> 
                  </div>
                </div>
              )
            })
          }
        </div>
        <div>
          <ChatInput input={input} setInput={setInput} handleSubmit={handleComment}/>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  )
}
