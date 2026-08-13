import { fetchQuery } from 'convex/nextjs';
import type { MetadataRoute } from 'next';
import { api } from '@/convex/_generated/api';
import { SITE_URL } from '@/utils/seo';

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
