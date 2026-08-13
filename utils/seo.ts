// Single source of truth for the canonical production origin. Previously
// app/layout.tsx derived this from VERCEL_URL, which points at the
// deployment-specific *.vercel.app URL (not the flickmart.app custom
// domain) on every preview AND production deployment unless Vercel's
// domain redirect happens to mask it -- that made metadataBase, canonical
// tags, and absolute OG image URLs wrong by default.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://flickmart.app';

export const SITE_NAME = 'Flickmart';

export const SOCIAL_LINKS = [
  'https://web.facebook.com/profile.php?id=61580235660893',
  'https://x.com/flickmartoffici',
  'https://www.instagram.com/flickmartofficial/',
];
