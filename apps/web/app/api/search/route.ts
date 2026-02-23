import { type NextRequest, NextResponse } from "next/server";
import { requests } from "recombee-api-client";
import { client } from "@/utils/recombee";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const userId = searchParams.get("userId");

  const result = await client.send(
    new requests.SearchItems(userId ?? "", q ?? "", 20, {
      returnProperties: true,
      cascadeCreate: true,
    }),
  );

  return NextResponse.json(result);
}
