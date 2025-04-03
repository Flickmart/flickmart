import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/providers/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Delivery from "@/components/Delivery";
import SearchBox from "@/components/SearchBox";
import MobileNav from "@/components/MobileNav";

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
    <html lang="en" className={`${inter.className} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-background text relative">
        <Providers>
          <Navbar />
          <MobileNav />
          <SearchBox />
          {children}
          <Toaster richColors position="top-right" />
          <Delivery />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}