import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Kept in sync by hand with templates/products.md, which is the
// human-readable reference copy. This inlined copy is the one actually used
// at runtime, by both scripts/data-injest-pipeline.ts (a local Node script)
// and convex/embeddings.ts (a Convex `"use node"` action) -- Convex actions
// can't reliably read arbitrary repo files at deploy time, so the template
// needs to live in code, not on disk.
const PRODUCT_TEMPLATE = `# Listing: {{title}}

## Overview

This listing describes {{title}}, provided by **{{store}}**.
It belongs to the **{{category}} / {{subcategory}}** category and is intended for potential customers interested in this type of offering.

## Product / Service Details

- **Category:** {{category}}
- **Subcategory:** {{subcategory}}
- **Condition:** {{condition}}
- **AI Features Enabled:** {{aiEnabled}}

## Description

{{description}}

## Pricing & Negotiation

- **Price:** ₦{{price}}
- **Negotiable:** {{negotiable}}
- **Exchange Accepted:** {{exchange}}
- **Plan Type:** {{plan}}

## Location & Availability

- **Location:** {{location}}
- **Listing Date and Time:** {{timeStamp}}

## Engagement Metrics

- **Likes:** {{likes}}
- **Dislikes:** {{dislikes}}
- **Views:** {{views}}

## Contact Information

Interested clients can reach the provider using the details below:

- **Phone Number:** {{phone}}

## Media

The listing includes images representing the product/service:

- {{images}}

## Internal Metadata (For Reference)

- **Listing ID:** {{_id}}
- **Business ID:** {{businessId}}
- **User ID:** {{userId}}
- **Created Time:** {{_creationTime}}
`;

function renderProductDocument(product: Record<string, unknown>): string {
  let document = PRODUCT_TEMPLATE;

  for (const key of Object.keys(product)) {
    const value = String(product[key]);

    const conditionedValue =
      value === "true" || value === "false"
        ? value === "true"
          ? "Yes"
          : "No"
        : key === "timeStamp"
          ? new Date(value).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
          : key === "images"
            ? value.split(",").join("\n- ")
            : value;

    document = document.replaceAll(`{{${key}}}`, conditionedValue);
  }

  return document;
}

// Renders a product into the same markdown template used for embeddings,
// then splits it into the same heading-delimited chunks that get embedded
// and stored in the vector DB. Single source of truth for both the backfill
// script and the per-mutation sync action, so they can never drift.
export async function renderProductChunks(
  product: Record<string, unknown>,
): Promise<string[]> {
  const document = renderProductDocument(product);
  const splitter = new RecursiveCharacterTextSplitter({
    separators: ["## "],
    chunkSize: 512,
    chunkOverlap: 60,
  });
  return await splitter.splitText(document);
}

// Kept in sync by hand with templates/stores.md. Callers pass the store
// doc's own fields plus a few computed extras (ownerName, verified,
// productCount, categories) that aren't stored on the `store` table itself
// -- see scripts/store-ingest-pipeline.ts for how those are assembled.
const STORE_TEMPLATE = `# Store: {{name}}

## Overview

{{name}} is a seller store on Flickmart. It has {{productCount}} active listing(s) on the platform.

## Store Details

- **Store Name:** {{name}}
- **Owner:** {{ownerName}}
- **Verified Seller:** {{verified}}
- **Location:** {{location}}
- **Categories Sold:** {{categories}}
- **Active Listings:** {{productCount}}

## About

{{description}}

## Contact Information

- **Phone Number:** {{phone}}

## Internal Metadata (For Reference)

- **Store ID:** {{_id}}
- **User ID:** {{userId}}
- **Created Time:** {{_creationTime}}
`;

function renderStoreDocument(store: Record<string, unknown>): string {
  let document = STORE_TEMPLATE;

  for (const key of Object.keys(store)) {
    const value = String(store[key]);
    document = document.replaceAll(`{{${key}}}`, value);
  }

  return document;
}

// Renders a store into the same markdown template used for embeddings, then
// splits it the same way renderProductChunks does. Single source of truth
// for scripts/store-ingest-pipeline.ts.
export async function renderStoreChunks(
  store: Record<string, unknown>,
): Promise<string[]> {
  const document = renderStoreDocument(store);
  const splitter = new RecursiveCharacterTextSplitter({
    separators: ["## "],
    chunkSize: 512,
    chunkOverlap: 60,
  });
  return await splitter.splitText(document);
}
