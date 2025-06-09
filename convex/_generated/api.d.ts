/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chat from "../chat.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as presence from "../presence.js";
import type * as product from "../product.js";
import type * as search from "../search.js";
import type * as store from "../store.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chat: typeof chat;
  comments: typeof comments;
  http: typeof http;
  notifications: typeof notifications;
  presence: typeof presence;
  product: typeof product;
  search: typeof search;
  store: typeof store;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
