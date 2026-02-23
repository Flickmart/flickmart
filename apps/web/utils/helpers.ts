import type { RecommendationResponse } from "recombee-api-client";
import { toast } from "sonner";
import type { Doc, Id } from "backend/convex/_generated/dataModel";

type ChatParams = {
  user: Doc<"users"> | null;
  userId: Id<"users">;
  onNavigate: (path: string) => void;
  productId?: Id<"product">;
};
type ShareParams = {
  title: string;
  description: string;
  productId?: Id<"product">;
  url?: string;
  price?: number;
};

export const initialChat = async ({
  user,
  userId,
  onNavigate,
  productId,
}: ChatParams) => {
  if (!user) {
    toast.error("Please login to chat with vendor");
    return;
  }
  console.log("chat vendor clicked");

  // Navigate to chat page with vendor ID as query parameter
  onNavigate(`/chat?vendorId=${userId}&productId=${productId}`);

  toast.success("Starting chat with vendor");
};

export async function shareProduct({
  title,
  description,
  productId,
  url,
}: ShareParams) {
  const shareData = {
    title: title || "Check out this product",
    text:
      `${description?.substring(0, 200)} '...\n'` ||
      "Check out this product on Flickmart",
    url: url || `https://flickmart.app/product/${productId}`,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function fetchRecommendations(
  scenario: string,
  recommendations: ({
    queryStrings,
    anonId,
  }: {
    queryStrings: string;
    anonId?: string;
  }) => Promise<RecommendationResponse | null>,
  count?: number,
  anonId?: string,
) {
  const baseQuery =
    "&returnProperties=true" +
    "&includedProperties=likes,views,title,location,image,price,timestamp" +
    "&cascadeCreate=true" +
    `&count=${count || 10}` +
    `&scenario=${scenario}`;

  // 1. Try to get items from the last 10 days
  const tenDaysInSeconds = 10 * 24 * 3600;
  const filter = `'timestamp' > now() - ${tenDaysInSeconds}`;
  const filteredQuery = `?filter=${encodeURIComponent(filter)}${baseQuery}`;
  let results: RecommendationResponse | null = null;

  if (scenario === "New-Arrivals") {
    results = await recommendations({ queryStrings: filteredQuery, anonId });
  }

  // 2. If no recent items, fetch default recommendations (fallback)
  if ((results && results.recomms.length === 0) || !results) {
    console.log(
      results
        ? "No recent items found, falling back to default recommendations."
        : "Another Scenario in use",
    );

    const defaultQuery = `?${baseQuery}`;
    results = await recommendations({
      queryStrings: defaultQuery,
      anonId,
    });
  }

  return results;
}
