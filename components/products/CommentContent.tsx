import { useMutation, useQuery } from 'convex/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';
import ChatInput from '../chats/chat-input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { useRouter } from 'next/navigation';

export default function CommentContent({
  productId,
}: {
  productId: Id<'product'>;
}) {
  const comments = useQuery(api.comments.getCommentsByProductId, { productId });
  const [input, setInput] = useState('');
  const addComment = useMutation(api.comments.addComment);
  const commentRef = useRef<HTMLParagraphElement>(null);
  const { user, isAuthenticated } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
  const router = useRouter()

  function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to perform this action');
      router.push("/sign-in?callback=/product/" + productId);
      setInput('');
      return;
    }
    addComment({ productId, content: input });
    setInput('');
  }
  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <DrawerContent className="!h-3/4 flex flex-col">
      <DrawerHeader>
        <DrawerTitle className="!font-bold text-center">
          {comments?.length} {comments?.length === 1 ? 'comment' : 'comments'}
        </DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-grow flex-col gap-2 overflow-x-auto pb-16">
        {comments?.length ? (
          comments?.map((comment, index) => {
            const { user } = comment;
            return (
              <div className="flex gap-4 px-2 py-4" key={index}>
                <div className="flex items-start justify-center pt-2">
                  <Avatar className="size-10 lg:size-12">
                    <AvatarImage alt={user?.name} src={user?.imageUrl} />
                    <AvatarFallback>EN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">{user?.name}</h3>
                  <p ref={commentRef}>{comment.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid flex-grow place-items-center text-lg">
            <span>No comments yet</span>
          </div>
        )}
      </div>
      <div>
        <ChatInput
          extraIcons={false}
          handleSubmit={handleComment}
          input={input}
          setInput={setInput}
        />
      </div>
    </DrawerContent>
  );
}
