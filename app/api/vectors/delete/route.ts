import { NextRequest, NextResponse } from "next/server";
import { getProductEmbeddingsCollection } from "@/convex/astra";

// Removes all vector chunks for a deleted product. Triggered by
// convex/embeddings.ts's deleteProductEmbedding action, which is scheduled
// from convex/product.ts's remove mutation.
export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { status: "error", error: "Missing productId" },
        { status: 400 },
      );
    }

    const collection = await getProductEmbeddingsCollection();
    await collection.deleteMany({ productId });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
