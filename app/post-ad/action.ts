"use client";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export async function uploadImage(file: File) {
  const { data, error } = await supabase.storage
    .from("productImage")
    .upload(file.name, file);

  if (error) throw Error(error.message);

  return data;
}

// export async function postAd() {
//   const { data, error } = await supabase.from("product").insert();
// }
