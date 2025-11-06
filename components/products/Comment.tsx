import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Drawer, DrawerTrigger } from '../ui/drawer';
import CommentContent from './CommentContent';

export default function Comment({ productId }: { productId: Id<'product'> }) {
  const comments = useQuery(api.comments.getCommentsByProductId, { productId });

  return (
    <Drawer>
      <div>
        <DrawerTrigger className="flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-7 lg:p-7 lg:pr-10">
          <div className="flex items-start gap-3">
            <div className="pt-2">
              <Avatar>
                <AvatarImage
                  alt={comments?.[0]?.user?.name || ''}
                  src={comments?.[0]?.user?.imageUrl}
                />
                <AvatarFallback>EN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col space-y-2 text-left">
              <h3 className="font-semibold lg:text-lg">
                {comments?.[0]?.user?.name}
              </h3>
              <p className="text-xs">{comments?.[0]?.content}</p>
            </div>
          </div>
        </DrawerTrigger>
        <CommentContent productId={productId} />
      </div>
    </Drawer>
  );
}
