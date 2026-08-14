import { fetchQuery } from 'convex/nextjs';
import type { MetadataRoute } from 'next';
import { api } from '@/convex/_generated/api';
import { SITE_URL } from '@/utils/seo';

// Without this, Next tries to prerender this route at BUILD time. Convex's
// fetchQuery uses a no-store fetch internally, which trips Next's
// "dynamic API used during static generation" bailout (DYNAMIC_SERVER_USAGE)
// -- a special control-flow error that fails the whole build even though
// the try/catch below "handles" it at the JS level, because the signal that
// something dynamic happened during an attempted static render still
// propagates up to Next's build harness regardless. Forcing this route
// dynamic means it just renders per-request instead, which is what a
// sitemap reflecting live product data needs anyway.
export const dynamic = 'force-dynamic';

// Sitemaps cap out at 50,000 URLs per file; the product catalog is far
// below that today, but this bound keeps the route from ever generating an
// invalid oversized file if the catalog grows a lot before this is revisited.
const MAX_LISTED_PRODUCTS = 5000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    {
      url: `${SITE_URL}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  let products: Awaited<ReturnType<typeof fetchQuery<typeof api.product.getAll>>> =
    [];
  try {
    products = await fetchQuery(api.product.getAll, {
      limit: MAX_LISTED_PRODUCTS,
    });
  } catch (error) {
    console.error('sitemap: failed to load products', error);
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product._id}`,
    lastModified: new Date(product._creationTime),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
