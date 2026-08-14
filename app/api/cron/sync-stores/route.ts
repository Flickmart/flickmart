import { NextResponse } from "next/server";
import { ingestAllStores } from "@/lib/vectorIngestion";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// See app/api/cron/sync-products/route.ts for why this checks a bearer
// header instead of a URL secret.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestAllStores();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Store vector sync cron failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
