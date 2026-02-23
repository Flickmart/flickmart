// scripts/sync-to-recombee.ts
import "dotenv/config";
import { ConvexHttpClient } from "convex/browser";
import { requests } from "recombee-api-client";
import { api } from "../../../packages/convex/_generated/api";
import { client as recombeeClient } from "../utils/recombee";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const recombeeDbId = process.env.RECOMBEE_DB_ID;
const recombeePrivateToken = process.env.RECOMBEE_PRIVATE_TOKEN;

if (!(convexUrl && recombeeDbId && recombeePrivateToken)) {
  throw new Error(
    "Missing environment variables. Please make sure NEXT_PUBLIC_CONVEX_URL, RECOMBEE_DB_ID, and RECOMBEE_PRIVATE_TOKEN are set.",
  );
}

console.log("🔧 Environment variables loaded:");
console.log(`  - NEXT_PUBLIC_CONVEX_URL: ${convexUrl.substring(0, 30)}...`);
console.log(`  - RECOMBEE_DB_ID: ${recombeeDbId}`);
console.log(
  `  - RECOMBEE_PRIVATE_TOKEN: ${recombeePrivateToken.substring(0, 10)}...`,
);

const convex = new ConvexHttpClient(convexUrl);

// Define all item (product) properties that need to be synced
const itemProperties = [
  { name: "aiEnabled", type: "boolean" },
  { name: "dislikes", type: "int" },
  { name: "image", type: "string" },
  { name: "likes", type: "int" },
  { name: "location", type: "string" },
  { name: "description", type: "string" },
  { name: "plan", type: "string" },
  { name: "subcategory", type: "string" },
  { name: "title", type: "string" },
  { name: "category", type: "string" },
  { name: "timestamp", type: "timestamp" },
  { name: "price", type: "double" },
  { name: "views", type: "int" },
];

// Define all user properties that need to be synced
const userProperties = [
  { name: "location", type: "string" },
  { name: "role", type: "string" },
  { name: "verified", type: "boolean" },
];

async function defineItemProperties() {
  console.log("\n📦 Step 1: Defining Item Properties in Recombee...");

  const propertyRequests = itemProperties.map((prop) => {
    console.log(`  - Adding property: ${prop.name} (${prop.type})`);
    return new requests.AddItemProperty(prop.name, prop.type);
  });

  try {
    const response = await recombeeClient.send(
      new requests.Batch(propertyRequests),
    );
    console.log("✅ Item properties batch response:");

    response.forEach((res: any, index: number) => {
      const prop = itemProperties[index];
      if (res.code && res.code !== 200 && res.code !== 201) {
        console.log(
          `  ❌ ${prop.name}: Error ${res.code} - ${res.message || JSON.stringify(res)}`,
        );
      } else if (res.json === "ok" || res === "ok") {
        console.log(`  ✅ ${prop.name}: Created successfully`);
      } else {
        // Property might already exist, which is fine
        console.log(`  ⚠️ ${prop.name}: ${JSON.stringify(res)}`);
      }
    });
  } catch (error: any) {
    // If property already exists, Recombee returns an error but that's okay
    if (error.message?.includes("already exists")) {
      console.log("  ℹ️ Some properties already exist, continuing...");
    } else {
      console.error(
        "  ❌ Error defining item properties:",
        error.message || error,
      );
    }
  }
}

async function defineUserProperties() {
  console.log("\n👤 Step 2: Defining User Properties in Recombee...");

  const propertyRequests = userProperties.map((prop) => {
    console.log(`  - Adding property: ${prop.name} (${prop.type})`);
    return new requests.AddUserProperty(prop.name, prop.type);
  });

  try {
    const response = await recombeeClient.send(
      new requests.Batch(propertyRequests),
    );
    console.log("✅ User properties batch response:");

    response.forEach((res: any, index: number) => {
      const prop = userProperties[index];
      if (res.code && res.code !== 200 && res.code !== 201) {
        console.log(
          `  ❌ ${prop.name}: Error ${res.code} - ${res.message || JSON.stringify(res)}`,
        );
      } else if (res.json === "ok" || res === "ok") {
        console.log(`  ✅ ${prop.name}: Created successfully`);
      } else {
        console.log(`  ⚠️ ${prop.name}: ${JSON.stringify(res)}`);
      }
    });
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("  ℹ️ Some properties already exist, continuing...");
    } else {
      console.error(
        "  ❌ Error defining user properties:",
        error.message || error,
      );
    }
  }
}

async function syncUsers() {
  console.log("\n👥 Step 3: Syncing Users to Recombee...");

  const users = await convex.query(api.users.getAllUsers);
  console.log(`  📊 Fetched ${users.length} users from Convex.`);

  if (users.length === 0) {
    console.log("  ⚠️ No users to sync.");
    return;
  }

  const userUploadRequests = users.map((user) => {
    const values = {
      location: user.contact?.address ?? null,
      role: user.role ?? null,
      verified: user.verified ?? false,
    };
    console.log(`  - User ${user._id}: ${JSON.stringify(values)}`);
    return new requests.SetUserValues(user._id, values, {
      cascadeCreate: true,
    });
  });

  try {
    const response = await recombeeClient.send(
      new requests.Batch(userUploadRequests),
    );
    console.log("✅ User sync batch response:");

    let successCount = 0;
    let errorCount = 0;

    response.forEach((res: any, index: number) => {
      const user = users[index];
      if (res.code && res.code !== 200 && res.code !== 201) {
        errorCount++;
        console.log(
          `  ❌ User ${user._id}: Error ${res.code} - ${res.message || JSON.stringify(res)}`,
        );
      } else {
        successCount++;
      }
    });

    console.log(`  📈 Results: ${successCount} success, ${errorCount} errors`);
  } catch (error: any) {
    console.error("  ❌ Error syncing users:", error.message || error);
  }
}

async function syncProducts() {
  console.log("\n🛍️ Step 4: Syncing Products to Recombee...");

  const products = await convex.query(api.product.getAll, {});
  console.log(`  📊 Fetched ${products.length} products from Convex.`);

  if (products.length === 0) {
    console.log("  ⚠️ No products to sync.");
    return;
  }

  // Log first product for debugging
  console.log("\n  🔍 Sample product data (first product):");
  const sampleProduct = products[0];
  console.log(`    - _id: ${sampleProduct._id}`);
  console.log(`    - title: ${sampleProduct.title}`);
  console.log(`    - category: ${sampleProduct.category}`);
  console.log(`    - price: ${sampleProduct.price}`);
  console.log(`    - images: ${sampleProduct.images?.length || 0} images`);
  console.log(`    - timeStamp: ${sampleProduct.timeStamp}`);

  const productUploadRequests = products.map((product) => {
    const values = {
      aiEnabled: product.aiEnabled ?? false,
      dislikes: product.dislikes ?? 0,
      image: product.images?.[0] ?? "",
      likes: product.likes ?? 0,
      location: product.location ?? null,
      description: product.description ?? "",
      plan: product.plan ?? "free",
      subcategory: product.subcategory ?? null,
      title: product.title ?? "",
      category: product.category ?? null,
      timestamp: product.timeStamp
        ? new Date(product.timeStamp).toISOString()
        : null,
      price: product.price ?? 0,
      views: product.views ?? 0,
    };
    return new requests.SetItemValues(product._id, values, {
      cascadeCreate: true,
    });
  });

  try {
    const response = await recombeeClient.send(
      new requests.Batch(productUploadRequests),
    );
    console.log("\n✅ Product sync batch response:");

    let successCount = 0;
    let errorCount = 0;

    response.forEach((res: any, index: number) => {
      const product = products[index];
      if (res.code && res.code !== 200 && res.code !== 201) {
        errorCount++;
        console.log(
          `  ❌ Product ${product._id} (${product.title}): Error ${res.code} - ${res.message || JSON.stringify(res)}`,
        );
      } else {
        successCount++;
      }
    });

    console.log(`  📈 Results: ${successCount} success, ${errorCount} errors`);
  } catch (error: any) {
    console.error("  ❌ Error syncing products:", error.message || error);
    console.error("  Full error:", JSON.stringify(error, null, 2));
  }
}

async function main() {
  console.log("🚀 Starting Recombee Sync with Debugging...\n");
  console.log("=".repeat(60));

  try {
    // Step 1: Define item properties first (REQUIRED before setting values)
    await defineItemProperties();

    // Step 2: Define user properties
    await defineUserProperties();

    // Step 3: Sync users
    await syncUsers();

    // Step 4: Sync products
    await syncProducts();

    console.log(`\n${"=".repeat(60)}`);
    console.log("🎉 Recombee sync completed!");
    console.log("\n💡 Tips:");
    console.log("  - Check the Recombee Admin UI to verify the data");
    console.log(
      "  - If properties are still missing, check for type mismatches",
    );
    console.log("  - Batch errors are logged individually above");
  } catch (error: any) {
    console.error("\n❌ Fatal error during sync:", error.message || error);
    process.exit(1);
  }
}

main();
