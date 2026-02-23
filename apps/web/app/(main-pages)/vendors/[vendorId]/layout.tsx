import { fetchQuery } from 'convex/nextjs';
import type { Metadata } from 'next';
import type React from 'react';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';

// This would typically come from an API or database
type Props = {
  children: React.ReactNode;
  params: Promise<{ vendorId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vendorId } = await params;

  // Fetch Store from Convex
  const store = await fetchQuery(api.store.getExternalUserStore, {
    userId: vendorId as Id<'users'>,
  });
  const storeDefined =
    store && !('error' in store) && 'name' in store ? store : null;

  if (!storeDefined) {
    return {
      title: 'Store not found - Flickmart',
      description: 'This Store profile could not be found.',
    };
  }

  return {
    title: `Check out ${storeDefined.name} products on Flickmart!`,
    description: storeDefined.description || 'Discover my store on Flickmart.',
    openGraph: {
      title: `Check out ${storeDefined.name} products on Flickmart!`,
      description:
        storeDefined.description || 'Discover my store on Flickmart.',
      url: `https://flickmart.app/vendors/${vendorId}`,
      images: [
        {
          url:
            storeDefined.image || 'https://flickmart.app/icon512_maskable.png',
          width: 1200,
          height: 630,
          alt: storeDefined.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Check out ${storeDefined.name} products on Flickmart!`,
      description:
        storeDefined.description || 'Discover my store on Flickmart.',
      images: [
        storeDefined.image || 'https://flickmart.app/icon512_maskable.png',
      ],
    },
  };
}

export default function VendorLayout({ children }: Props) {
  return <>{children}</>;
}
