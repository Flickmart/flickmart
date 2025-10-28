import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { shareProduct } from '@/utils/helpers';
import ProductCard from '../multipage/ProductCard';
import { Command, CommandInput } from '../ui/command';

type UserProfileProps = {
  open?: boolean;
  onClose: () => void;
  userId: Id<'users'>;
};

type ProfileContentProps = {
  user: Doc<'users'>;
  store: Doc<'store'>;
};
// Profile content component to share between mobile and desktop views
const ProfileContent = ({ user, store }: ProfileContentProps) => {
  const [search, setSearch] = useState('');
  const presence = useQuery(api.presence.getUserOnlineStatus, {
    userId: user._id,
  });
  const products = useQuery(api.product.getByUserId, {
    userId: user._id,
  });
  const [_isHidden, setIsHidden] = useState(false);
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="mt-8 mb-6 flex flex-col items-start md:mt-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="-z-10 absolute inset-0 rounded-full" />
            <Image
              alt={`${user.name}'s profile picture`}
              className="size-[80px] rounded-full border-4 border-white object-cover shadow-lg"
              height={150}
              priority
              src={`${user.imageUrl || 'placeholder.svg'}`}
              width={150}
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-xl">{user.name}</h1>
            {!!presence && (
              <p className="mt-1 text-gray-500 text-xs">
                {presence?.isOnline ? (
                  'online'
                ) : (
                  <span>
                    {presence?.lastSeen && presence.lastSeen > 0 ? (
                      <>
                        Last seen{' '}
                        {formatDistanceToNow(presence.lastSeen, {
                          addSuffix: true,
                        })}
                      </>
                    ) : (
                      'offline'
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {store ? (
          <div className="mt-4 max-w-md text-center">
            <p className="text-sm">{store.description}</p>
          </div>
        ) : (
          <div className="mt-4 max-w-md text-center">
            <p className="text-sm">Hey there i'm using flickmart!</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button
          className="flex items-center justify-center rounded-xl border-gray-200 py-5 transition-all hover:border-orange-200 hover:bg-orange-50"
          variant="outline"
        >
          <MessageSquare className="h-6 w-6 text-orange-500" />
          <span className="font-medium text-md">Message</span>
        </Button>
        <Button
          className="flex items-center justify-center rounded-xl border-gray-200 py-5 transition-all hover:border-orange-200 hover:bg-orange-50"
          onClick={() =>
            shareProduct({
              title: store.name ?? '',
              description: store.description ?? '',
            })
          }
          variant="outline"
        >
          <Share2 className="h-6 w-6 text-orange-500" />
          <span className="font-medium text-md">Share</span>
        </Button>
      </div>

      {/* Products Section */}
      {!!store && (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-xl">
              More Products
            </h2>
            <Button
              className="flex items-center gap-1 text-gray-500 hover:text-orange-600"
              onClick={() => setIsHidden(true)}
              variant="ghost"
            >
              <span>{products?.length}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div
              className="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-flickmart/5"
              onClick={() => setIsHidden(false)}
            >
              <ChevronLeft />
            </div>
            <Command>
              <CommandInput
                onValueChange={handleSearch}
                placeholder={`Search in ${user.name}'s store...`}
                value={search}
              />
            </Command>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts?.map((item) => (
              <div key={item._id}>
                <Link href={`/product/${item._id}`}>
                  <ProductCard
                    image={item.images[0]}
                    price={item.price}
                    title={item.title}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UserProfile({
  open,
  onClose,
  userId,
}: UserProfileProps) {
  const user = useQuery(api.users.getUser, { userId });
  const store = useQuery(api.store.getStoreByUserId);

  // Always set up state and effects
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Conditionally render based on user and open rather than returning early
  if (!(user && open)) {
    return null;
  }

  // Render UI based on mobile or desktop
  if (isMobile) {
    return (
      <Sheet onOpenChange={onClose} open={open}>
        <SheetTitle>Profile</SheetTitle>
        <SheetContent className="w-full overflow-y-auto p-0" side="right">
          <ProfileContent store={store as Doc<'store'>} user={user!} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative h-full w-full max-w-5xl overflow-y-auto bg-white shadow-xl">
        <div className="flex gap-x-2 p-3">
          <ArrowLeft className="h-8 w-8 cursor-pointer" onClick={onClose} />
          <h2 className="ml-6 font-bold text-2xl text-black">Profile</h2>
        </div>
        <ProfileContent store={store as Doc<'store'>} user={user!} />
      </div>
    </div>
  );
}
