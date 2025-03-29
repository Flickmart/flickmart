"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
export default function Home() {
  const redirectSignIn= process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
  return (
    <div className="flex gap-3">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal"  fallbackRedirectUrl={redirectSignIn}/>
      </SignedOut>
      <span>Flickmart landing page</span>
      <Link href="/home">Go to home</Link>
    </div>
  );
}
