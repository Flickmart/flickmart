"use client";
import { FormDataType } from "@/types/form";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function uploadImage(file: File | null) {
  if (file) {
    const { data, error } = await supabase.storage
      .from("productImage")
      .upload(file.name, file);

    if (error) throw Error(error.message);

    return data;
  } else {
    throw Error("image not found");
  }
}

export async function postAd(data: FormDataType & { image: string }) {
  console.log(data);
  //   const { data, error } = await supabase.from("product").insert();
}
