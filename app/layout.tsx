import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "react-photo-view/dist/react-photo-view.css";
import { Providers } from "@/providers/providers";
import MobileHeader from "@/components/MobileHeader";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Flickmart",
  description:
    "The all in one store for university students to buy and sell products",
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
      lang="en"
      className={`${inter.className} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background text relative">
        <Providers>
          <MobileHeader />
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
