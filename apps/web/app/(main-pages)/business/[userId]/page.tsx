'use client';
import { useQuery } from 'convex/react';
import { Mail, MapPin, Phone, User } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import MiniListings from '@/components/settings/MiniListings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';

export default function PublicProfile() {
  const { userId } = useParams();
  const user = useQuery(api.users.current, {
    userId: userId ? (userId as Id<'users'>) : undefined,
  });
  const [_userProductsLength, setUserProductsLength] = useState<number>(0);
  const _router = useRouter();
  const store = useQuery(api.store.getExternalUserStore, {
    userId: userId ? (userId as Id<'users'>) : undefined,
  });
  const hasStore = store && 'error' in store && store?.error?.status;
  const productsByUser = useQuery(api.product.getByUserId, {
    userId: user?._id,
  });

  function updateUserProductsLength(length: number) {
    setUserProductsLength(length);
  }
  return (
    <div className="w-full">
      <div className="min-h-screen bg-gray-50/50 px-4 pt-4 pb-10 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <span className="font-semibold text-lg">
            {user?.username || '--'}
          </span>
          <div className="my-3 flex items-center gap-2">
            <div>
              <Avatar className="h-24 w-24">
                <AvatarImage alt="Profile picture" src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <h1 className="min-w-10 font-semibold text-base capitalize">
                  {user?.name || '--'}
                </h1>
                {user?.verified ? (
                  <Image
                    alt="verified"
                    className=""
                    height={16}
                    src="/Vector.png"
                    width={16}
                  />
                ) : null}
              </div>
              <span className="flex items-center gap-1 py-0.5 text-sm">
                <User className="h-5 w-5" />
                {hasStore === 404 ? 'Buyer' : 'Seller'}
              </span>
              <div className="flex gap-2 text-sm">
                <span>Items for sale {productsByUser?.length}</span>
                <span>Items sold 0</span>
              </div>
            </div>
          </div>
          <div className="my-4 flex flex-col gap-2">
            <span className="text-sm">{user?.description}</span>
            <p className="pt-1.5 text-muted-foreground text-sm">
              Member since{' '}
              {user?._creationTime
                ? new Date(user._creationTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </p>
          </div>
          <div>
            <MiniListings
              updateLength={updateUserProductsLength}
              userId={user?._id as Id<'users'>}
            />
          </div>
          <div className="mt-6 mb-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-lg/5">Contact Information</h1>
              <p className="text-muted-foreground text-xs">
                Your contact details right here for your easy access.
              </p>
            </div>
            <div className="mt-4 rounded-lg border">
              <div className="border-b px-3 py-3">
                <h2 className="font-medium text-sm">Phone</h2>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user?.contact?.phone || (
                      <i className="text-gray-400 text-sm">--</i>
                    )}
                  </span>
                </div>
              </div>
              <div className="border-b px-3 py-3">
                <h2 className="font-medium text-sm">E-mail</h2>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user?.email || <i className="text-gray-400 text-sm">--</i>}
                  </span>
                </div>
              </div>
              <div className="px-3 py-3">
                <h2 className="font-medium text-sm">Location</h2>
                <div className="flex items-center gap-1">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <p>
                    {user?.contact?.address || (
                      <i className="text-gray-400 text-sm normal-case">--</i>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
