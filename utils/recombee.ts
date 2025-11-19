import { ApiClient, requests } from "recombee-api-client";

export const client = new ApiClient(
  process.env.RECOMBEE_DB_ID as string,
  process.env.RECOMBEE_PRIVATE_TOKEN as string,
  {
    region: "eu-west",
  }
);
