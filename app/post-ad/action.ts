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

export async function createAdPost(data: FormDataType & { image: string }) {
  const response = await fetch("/api/ad-posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw Error("Something went wrong...");

  const adPost = await response.json();

  return adPost;
}
