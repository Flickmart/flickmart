import { NextResponse } from "next/server";
import { ingestAllProducts } from "@/lib/vectorIngestion";

export const dynamic = "force-dynamic";
// Vercel's Hobby plan hard-caps this at 60 -- it's a build-time validation
// error, not a silent clamp, so anything higher fails the whole deploy.
// Full re-embed of a large catalog can genuinely exceed 60s (this project's
// ~150 products took noticeably longer than that in local testing), in
// which case Vercel kills the function mid-run. That's not data-corrupting
// (each product is deleted-then-reinserted independently, so a
// mid-list timeout just leaves the remaining products unsynced until the
// next run) but it does mean this cron may never reach products past
// wherever it times out, run after run, since it always restarts from the
// same first item. Upgrading past Hobby (raises the cap up to 300s+) or
// batching this across multiple invocations would both fix that properly.
export const maxDuration = 60;

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
