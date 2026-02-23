"use server";

import { requests } from "recombee-api-client";
import { client } from "@/utils/recombee";

export async function addProductToRecombeeCatalog(itemId: string, values: any) {
  return await client.send(
    new requests.SetItemValues(itemId, values, {
      cascadeCreate: true,
    }),
  );
}
