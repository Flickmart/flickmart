import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import { Card } from "../ui/card";
import Link from "next/link";

export default function RecentListings({
  userId,
  updateLength,
}: {
  userId: Id<"users">;
  updateLength: (Length: number) => void;
}) {
  const userProducts = useQuery(api.product.getByUserId);

  useEffect(() => {
    updateLength(userProducts?.length ?? 0);
  }, [userProducts]);
  return (
    <>
      {!userProducts?.length ? null : (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userProducts
              ?.slice()
              .reverse()
              .slice(0, 3)
              .map((listing) => (
                <Link key={listing._id} href={`/product/${listing._id}`}>
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 space-y-1">
                      <h3 className="font-medium">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        &#8358;{listing.price.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Card>
      )}
    </>
  );
}
