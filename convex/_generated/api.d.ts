/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from '../actions.js';
import type * as categories from '../categories.js';
import type * as chat from '../chat.js';
import type * as comments from '../comments.js';
import type * as email from '../email.js';
import type * as http from '../http.js';
import type * as internal_ from '../internal.js';
import type * as notifications from '../notifications.js';
import type * as orders from '../orders.js';
import type * as presence from '../presence.js';
import type * as product from '../product.js';
import type * as pushNotifications from '../pushNotifications.js';
import type * as search from '../search.js';
import type * as store from '../store.js';
import type * as transactions from '../transactions.js';
import type * as users from '../users.js';
import type * as views from '../views.js';
import type * as wallet from '../wallet.js';

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from 'convex/server';

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  categories: typeof categories;
  chat: typeof chat;
  comments: typeof comments;
  email: typeof email;
  http: typeof http;
  internal: typeof internal_;
  notifications: typeof notifications;
  orders: typeof orders;
  presence: typeof presence;
  product: typeof product;
  pushNotifications: typeof pushNotifications;
  search: typeof search;
  store: typeof store;
  transactions: typeof transactions;
  users: typeof users;
  views: typeof views;
  wallet: typeof wallet;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, 'public'>
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, 'internal'>
>;

export declare const components: {
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        'mutation',
        'internal',
        { emailId: string },
        null
      >;
      get: FunctionReference<'query', 'internal', { emailId: string }, any>;
      getStatus: FunctionReference<
        'query',
        'internal',
        { emailId: string },
        {
          complained: boolean;
          errorMessage: string | null;
          opened: boolean;
          status:
            | 'waiting'
            | 'queued'
            | 'cancelled'
            | 'sent'
            | 'delivered'
            | 'delivery_delayed'
            | 'bounced';
        }
      >;
      handleEmailEvent: FunctionReference<
        'mutation',
        'internal',
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        'mutation',
        'internal',
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject: string;
          text?: string;
          to: string;
        },
        string
      >;
    };
  };
};
