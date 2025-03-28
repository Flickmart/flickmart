import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/query-provider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
    <ClerkProvider>
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text relative">
      {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        </header> */}
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
