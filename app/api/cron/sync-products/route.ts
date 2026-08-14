import { NextResponse } from "next/server";
import { ingestAllProducts } from "@/lib/vectorIngestion";

export const dynamic = "force-dynamic";
// Full re-embed of every product can take a while on a large catalog --
// raise the default serverless timeout. Actual ceiling depends on the
// Vercel plan (Hobby caps at 60s regardless of this value).
export const maxDuration = 300;

// Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on its
// own cron-triggered requests when the CRON_SECRET env var is set on the
// project -- set it in Vercel's dashboard (Settings -> Environment
// Variables). No secret needs to live in vercel.json this way, unlike the
// older /api/sync-recombee cron entry's ?secret= query param.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestAllProducts();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Product vector sync cron failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
