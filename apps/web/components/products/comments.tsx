import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';

type CommentDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Comment = {
  id: number;
  author: string;
  avatar: string;
  text: string;
};

const comments: Comment[] = [
  {
    id: 1,
    author: 'Jonadab Computers',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 2,
    author: 'Savory Eats',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 3,
    author: 'Buchi Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 4,
    author: 'Amanda Odamuyi',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 5,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 6,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 7,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 8,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 9,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 10,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 11,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 12,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
  {
    id: 13,
    author: 'Ray Foot Wears',
    avatar: '/placeholder.svg',
    text: 'This guy sell the best quality tech gadgets,very reliable. i have been buying from him for years and i know he products has quality',
  },
];

export function CommentDrawer({ isOpen, onClose }: CommentDrawerProps) {
  return (
    <Drawer modal onOpenChange={onClose} open={isOpen}>
      <DrawerContent className="fixed right-0 bottom-0 left-0 max-h-[80vh] rounded-t-[10px]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="w-full text-center">
            {' '}
            700 Comments
          </DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4" variant="ghost">
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="h-[70vh] md:h-[70vh]">
          <div className="space-y-4 p-4">
            {comments.map((comment) => (
              <div className="flex gap-3" key={comment.id}>
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{comment.author}</div>
                  <p className="text-muted-foreground text-sm">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
