"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import {useMutation} from "convex/react"
import { api } from "@/convex/_generated/api";
import Link from "next/link";
export default function Home() {

  return (
    <div className="flex gap-3">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <span>Flickmart landing page</span>
      <Link href="/home">Go to home</Link>
    </div>
  );
}
