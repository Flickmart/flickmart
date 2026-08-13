import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import 'react-photo-view/dist/react-photo-view.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import AssistantWidget from '@/components/ai-assistant/assistant-widget';
import MobileHeader from '@/components/MobileHeader';
import Loader from '@/components/multipage/Loader';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { Providers } from '@/providers/providers';
import { SITE_NAME, SITE_URL, SOCIAL_LINKS } from '@/utils/seo';

const DESCRIPTION =
  'Flickmart is a classified online marketplace where students and locals in Enugu and Nsukka discover, buy, and sell electronics, fashion, food, services and more — securely, with escrow-protected payments and greater visibility for sellers.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Buy & Sell Near You`,
    template: `%s | ${SITE_NAME}`,
  },
  manifest: '/manifest.json',
  keywords: [
    'flickmart',
    'online marketplace',
    'buy and sell',
    'classified ads',
    'ecommerce Nigeria',
    'Enugu marketplace',
    'Nsukka marketplace',
    'student marketplace',
    'buy and sell online',
    'campus marketplace',
  ],
  description: DESCRIPTION,
  generator: 'Next.js',
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: 'icon512_rounded.png' },
    { rel: 'icon', url: 'icon512_maskable.png' },
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Buy & Sell Near You`,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/icon512_maskable.png`,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Buy & Sell Near You`,
    description: DESCRIPTION,
    images: [`${SITE_URL}/icon512_maskable.png`],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/flickmart-logo.svg`,
  sameAs: SOCIAL_LINKS,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?query={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
const inter = Inter({
  subsets: ['latin'],
});
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.className} ${poppins.variable} scroll-smooth`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          type="application/ld+json"
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          type="application/ld+json"
        />
      </head>
      <body className="text relative bg-background">
        <Providers>
          <ServiceWorkerRegistration />

          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center bg-transparent">
                <Loader />
              </div>
            }
          >
            <MobileHeader />
          </Suspense>
          <Suspense fallback={null}>{children}</Suspense>
          <AssistantWidget />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
