import { fetchQuery } from 'convex/nextjs';
import type { Metadata } from 'next';
import type React from 'react';
import { cache } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { SITE_NAME, SITE_URL } from '@/utils/seo';

// This would typically come from an API or database
type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

// Shared across generateMetadata and the layout body below -- React.cache
// dedupes the two calls into a single Convex query per request instead of
// fetching the same product twice.
const getProduct = cache((id: string) =>
  fetchQuery(api.product.getById, { productId: id as Id<'product'> })
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product not found',
      description: 'This product could not be found.',
    };
  }

  const description = `${product.description || 'Check out this product on Flickmart'}\nAvailable in ${product.location}.`;
  const image = product.images[0] || `${SITE_URL}/icon512_maskable.png`;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title: `Check out this product i found on Flickmart: ${product.title}`,
      description,
      url: `${SITE_URL}/product/${id}`,
      images: [
        {
          url: image,
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
      description,
      images: [image],
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <>{children}</>;
  }

  const image = product.images[0] || `${SITE_URL}/icon512_maskable.png`;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.images.length > 0 ? product.images : [image],
    sku: product._id,
    category: product.subcategory
      ? `${product.category} > ${product.subcategory}`
      : product.category,
    itemCondition:
      product.condition === 'brand new'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    brand: {
      '@type': 'Brand',
      name: product.store || SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${id}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition:
        product.condition === 'brand new'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
      areaServed: product.location,
      seller: {
        '@type': 'Organization',
        name: product.store || SITE_NAME,
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `${SITE_URL}/categories/${encodeURIComponent(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${SITE_URL}/product/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD built from our own product data, not raw user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD built from our own product data, not raw user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
