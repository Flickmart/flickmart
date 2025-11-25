// scripts/sync-to-recombee.ts
import "dotenv/config";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { client as recombeeClient } from "../utils/recombee";
import { requests } from "recombee-api-client";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const recombeeDbId = process.env.RECOMBEE_DB_ID;
const recombeePrivateToken = process.env.RECOMBEE_PRIVATE_TOKEN;

if (!convexUrl || !recombeeDbId || !recombeePrivateToken) {
  throw new Error(
    "Missing environment variables. Please make sure NEXT_PUBLIC_CONVEX_URL, RECOMBEE_DB_ID, and RECOMBEE_PRIVATE_TOKEN are set."
  );
}

const convex = new ConvexHttpClient(convexUrl);

async function main() {
  console.log("Starting Recombee sync...");

  // Fetch all users
  const users = await convex.query(api.users.getAllUsers);
  console.log(`Fetched ${users.length} users.`);

  // Upload users to Recombee
  const userUploadRequests = users.map((user) => {
    return new requests.SetUserValues(
      user._id,
      {
        // Add any user properties you want to sync to Recombee here
        location: user.contact?.address,
        role: user.role,
        verified: user.verified,
      },
      { cascadeCreate: true }
    );
  });

  await recombeeClient.send(new requests.Batch(userUploadRequests));
  console.log("Successfully uploaded users to Recombee.");

  // Fetch all products
  const products = await convex.query(api.product.getAll, {});
  console.log(`Fetched ${products.length} products.`);

  // Upload products to Recombee
  const productUploadRequests = products.map((product) => {
    return new requests.SetItemValues(
      product._id,
      {
        // Add any product properties you want to sync to Recombee here
        aiEnabled: product.aiEnabled,
        dislikes: product?.dislikes ?? 0,
        image: product.images[0] ?? "",
        likes: product?.likes ?? 0,
        location: product.location,
        description: product.description,
        plan: product.plan,
        subcategory: product.subcategory,
        title: product.title,
        category: product.category,
        timestamp: product.timeStamp,
        price: product.price,
        views: product?.views ?? 0,
      },
      { cascadeCreate: true }
    );
  });

  await recombeeClient.send(new requests.Batch(productUploadRequests));
  console.log("Successfully uploaded products to Recombee.");

  console.log("Recombee sync finished.");
}

main().catch((error) => {
  console.error("Error during Recombee sync:", error);
  process.exit(1);
});
