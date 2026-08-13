/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as astra from "../astra.js";
import type * as bankAccounts from "../bankAccounts.js";
import type * as categories from "../categories.js";
import type * as chat from "../chat.js";
import type * as comments from "../comments.js";
import type * as cors from "../cors.js";
import type * as email from "../email.js";
import type * as embeddingTemplate from "../embeddingTemplate.js";
import type * as embeddings from "../embeddings.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as interactions from "../interactions.js";
import type * as internal_ from "../internal.js";
import type * as notifications from "../notifications.js";
import type * as openrouter from "../openrouter.js";
import type * as orders from "../orders.js";
import type * as populate from "../populate.js";
import type * as presence from "../presence.js";
import type * as product from "../product.js";
import type * as pushNotifications from "../pushNotifications.js";
import type * as recommend from "../recommend.js";
import type * as search from "../search.js";
import type * as siteAssistant from "../siteAssistant.js";
import type * as store from "../store.js";
import type * as system from "../system.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";
import type * as views from "../views.js";
import type * as wallet from "../wallet.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  astra: typeof astra;
  bankAccounts: typeof bankAccounts;
  categories: typeof categories;
  chat: typeof chat;
  comments: typeof comments;
  cors: typeof cors;
  email: typeof email;
  embeddingTemplate: typeof embeddingTemplate;
  embeddings: typeof embeddings;
  helpers: typeof helpers;
  http: typeof http;
  interactions: typeof interactions;
  internal: typeof internal_;
  notifications: typeof notifications;
  openrouter: typeof openrouter;
  orders: typeof orders;
  populate: typeof populate;
  presence: typeof presence;
  product: typeof product;
  pushNotifications: typeof pushNotifications;
  recommend: typeof recommend;
  search: typeof search;
  siteAssistant: typeof siteAssistant;
  store: typeof store;
  system: typeof system;
  transactions: typeof transactions;
  users: typeof users;
  views: typeof views;
  wallet: typeof wallet;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
  presence: import("@convex-dev/presence/_generated/component.js").ComponentApi<"presence">;
  persistentTextStreaming: import("@convex-dev/persistent-text-streaming/_generated/component.js").ComponentApi<"persistentTextStreaming">;
};
