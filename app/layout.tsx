import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "react-photo-view/dist/react-photo-view.css";
import { Suspense } from "react";
import MobileHeader from "@/components/MobileHeader";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { Providers } from "@/providers/providers";
import { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Flickmart",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
  description:
    "A classified online marketplace where students and locals discover, buy, and sell everything they need — securely and with greater visibility for sellers, all in one trusted platform.",
  generator: "Next.js",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icon512_rounded.png" },
    { rel: "icon", url: "icon512_maskable.png" },
  ],
};
const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.className} scroll-smooth`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="text relative bg-background">
        <Providers>
          <ServiceWorkerRegistration />

          <Suspense fallback={<div>Loading...</div>}>
            <MobileHeader />
          </Suspense>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
