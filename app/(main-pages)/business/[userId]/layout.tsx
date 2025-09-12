import React from 'react'
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

// This would typically come from an API or database
type Props = {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  // Fetch business from Convex
  const user = await fetchQuery(api.users.current, { userId: userId as Id<"users">  });

  if (!user) {
    return {
      title: "Business not found - Flickmart",
      description: "This business profile could not be found.",
    };
  }

  return {
    title: `Check out ${user?.name} on Flickmart!`,
    description: user?.description || "Discover my profile on Flickmart.",
    openGraph: {
      title: `Check out ${user?.name} on Flickmart!`,
      description: user?.description || "Discover my profile on Flickmart.",
      url: `https://flickmart.app/business/${userId}`,
      images: [
        {
          url: user?.imageUrl || "https://flickmart.app/icon512_maskable.png",
          width: 1200,
          height: 630,
          alt: user?.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Check out ${user?.name} on Flickmart!`,
      description: user?.description || "Discover my profile on Flickmart.",
      images: [user?.imageUrl || "https://flickmart.app/icon512_maskable.png"],
    },
  };
}

export default function ProfileLayout({children}: Props) {
  return (
    <>
      {children}
    </>
  )
}
