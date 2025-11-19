"use server";

import { client } from "@/utils/recombee";
import { requests } from "recombee-api-client";

export async function addProductToRecombeeCatalog(itemId: string, values: any) {
  return await client.send(
    new requests.SetItemValues(itemId, values, {
      cascadeCreate: true,
    })
  );
}
