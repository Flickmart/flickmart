"use server";
import { UTApi } from "uploadthing/server";

export async function deleteUploadThing(keys: string[] | string) {
  const utapi = new UTApi();
  await utapi.deleteFiles(keys);
  return { ok: true };
}
