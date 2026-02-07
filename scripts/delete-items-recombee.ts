import "dotenv/config";

import { client as recombeeClient } from "../utils/recombee";
import { requests } from "recombee-api-client";

const recombeeDbId = process.env.RECOMBEE_DB_ID;
const recombeePrivateToken = process.env.RECOMBEE_PRIVATE_TOKEN;

if (!recombeeDbId || !recombeePrivateToken) {
  throw new Error(
    "Missing environment variables. Please make sure RECOMBEE_DB_ID and RECOMBEE_PRIVATE_TOKEN are set.",
  );
}
async function main() {
  const items = process.argv.slice(2);
  if (items.length === 0) {
    console.error("Please provide item IDs to delete.");
    process.exit(1);
  }

  // Delete items from Recombee
  const deleteRequests = items.map((itemId) => {
    return new requests.DeleteItem(itemId); // Change to DeleteUser if object you want to delete is users
  });

  await recombeeClient.send(new requests.Batch(deleteRequests));
  console.log(`Successfully deleted ${items.length} items from Recombee.`);
}

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
