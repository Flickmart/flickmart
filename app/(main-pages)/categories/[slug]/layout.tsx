import type { Metadata } from 'next';
import type React from 'react';
import { SITE_NAME, SITE_URL } from '@/utils/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = toTitleCase(decodeURIComponent(slug));

  const title = `${category} for Sale`;
  const description = `Browse ${category} listings on ${SITE_NAME} — buy and sell ${category.toLowerCase()} near you in Enugu and Nsukka.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryLayout({ children, params }: Props) {
  const { slug } = await params;
  const category = toTitleCase(decodeURIComponent(slug));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: category,
        item: `${SITE_URL}/categories/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD built from the route's own slug, not raw user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
