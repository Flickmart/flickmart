"use client";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
export default function Home() {
  // const router= useRouter()
  // useEffect(function(){
  //   router.push("home")
  // },[])
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
