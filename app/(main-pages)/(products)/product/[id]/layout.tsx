import { fetchQuery } from 'convex/nextjs';
import type { Metadata } from 'next';
import type React from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

// This would typically come from an API or database
type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Fetch Store from Convex
  const product = await fetchQuery(api.product.getById, {
    productId: id as Id<'product'>,
  });

  if (!product) {
    return {
      title: 'Product not found - Flickmart',
      description: 'This product could not be found.',
    };
  }

  return {
    title: product.title,
    description: product.description || 'Check out this product on Flickmart.',
    openGraph: {
      title: `Check out this product i found on Flickmart: ${product.title}`,
      description:
        product.description || 'Check out this product on Flickmart.',
      url: `https://flickmart.app/product/${id}`,

      images: [
        {
          url:
            product.images[0] || 'https://flickmart.app/icon512_maskable.png',
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Check out ${product.title} on Flickmart!`,
      description:
        product.description || 'Check out this product on Flickmart.',
      images: [
        product.images[0] || 'https://flickmart.app/icon512_maskable.png',
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
