import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import ChatInput from '../chats/chat-input'
import { DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'

 
export default function CommentContent({productId}: {productId: Id<"product">}){
    const comments= useQuery(api.comments.getCommentsByProductId, { productId })
    const [input, setInput] = useState("");
    const addComment= useMutation(api.comments.addComment)
    const commentRef= useRef<HTMLParagraphElement>(null)
  
    function handleComment(e: React.FormEvent<HTMLFormElement>){
      e.preventDefault()
      addComment({ productId, content: input})
      setInput("")
    }
    useEffect(function(){
      if(commentRef.current){
        commentRef.current.scrollIntoView({behavior: "smooth"})
      }
    }, [comments])
  
    return <DrawerContent className='!h-3/4 flex flex-col'>
    <DrawerHeader>
      <DrawerTitle className='text-center !font-bold'>
      {comments?.length} {comments?.length === 1? "comment" : "comments"}
      </DrawerTitle>   
    </DrawerHeader>
    <div className='flex-grow flex flex-col gap-2 overflow-x-auto pb-16'>
      {!comments?.length? <div className='flex-grow grid place-items-center text-lg'>
        <span>No comments yet</span>
      </div> :
        comments?.map((comment, index)=>{
          const {user}= comment
          return (
            <div className=' flex gap-4 py-4 px-2' key={index}>
              <div className=' flex justify-center items-start pt-2'>
                <Avatar className='size-10 lg:size-12'>
                  <AvatarImage src={user?.imageUrl} alt={user?.name} />
                  <AvatarFallback>EN</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <h3 className='text-base font-bold'>{user?.name}</h3> 
                <p ref={commentRef}>{comment.content}</p> 
              </div>
            </div>
          )
        })
      }
    </div>
    <div>
      <ChatInput input={input} setInput={setInput} handleSubmit={handleComment}/>
    </div>
  </DrawerContent>
}
