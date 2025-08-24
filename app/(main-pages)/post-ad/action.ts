// "use client";
// import { FormDataType } from "@/types/form";

// export async function uploadImage(file: File | null) {
//   if (file) {
//     // TODO: Replace with Convex implementation
//     console.log("Image upload will be implemented with Convex");

//     // Return mock data to prevent UI from breaking
//     return {
//       fullPath: "placeholder-path"
//     };
//   } else {
//     throw Error("image not found");
//   }
// }

// export async function createAdPost(data: FormDataType) {
//   const response = await fetch("/api/ad-posts", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw Error("Something went wrong...");

//   const adPost = await response.json();

//   return adPost;
// }
