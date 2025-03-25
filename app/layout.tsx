import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";

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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
