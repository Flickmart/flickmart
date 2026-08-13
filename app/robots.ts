import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/settings/',
        '/wallet/',
        '/chat/',
        '/orders/',
        '/notifications/',
        '/protected/',
        '/sign-in/',
        '/sign-up/',
        '/forgot-password/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
