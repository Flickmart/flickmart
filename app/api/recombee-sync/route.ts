import { client } from "@/utils/recombee";
import { NextRequest, NextResponse } from "next/server";
import { requests } from "recombee-api-client";

export default async function POST(req: NextRequest) {
  const body = (await req.json()) as { itemId: string; values: any };

  const { itemId, values } = body;

  const result = await client.send(
    new requests.SetItemValues(itemId, values, {
      cascadeCreate: true,
    })
  );

  return NextResponse.json({ ok: true, result });
}
