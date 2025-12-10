import type { UserJSON } from '@clerk/backend';
import { type Validator, v } from 'convex/values';
import {
  internalMutation,
  internalQuery,
  mutation,
  type QueryCtx,
  query,
} from './_generated/server';

export const current = query({
  args: { userId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db.get(args.userId);
    }
    return await getCurrentUser(ctx);
  },
});

export const getUserId = internalQuery({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    // if (!user) {
    //   return null;
    // }
    return user?._id;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});

export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUser = mutation({
  args: {
    about: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    allowNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error('Please Login First...');
    }
    args.allowNotifications !== undefined &&
      (await ctx.db.patch(user._id, {
        allowNotifications: args.allowNotifications,
      }));

    args.about && (await ctx.db.patch(user._id, { description: args.about }));
    args.location &&
      (await ctx.db.patch(user._id, {
        contact: { address: args.location, phone: user.contact?.phone },
      }));
    args.phone &&
      (await ctx.db.patch(user._id, {
        contact: { phone: args.phone, address: user.contact?.address },
      }));
  },
});

export const getMultipleUsers = query({
  args: { userIds: v.array(v.id('users')) },
  handler: async (ctx, args) => {
    if (args.userIds.length === 0) {
      return [];
    }

    const users = await Promise.all(
      args.userIds.map((userId) => ctx.db.get(userId))
    );

    // Filter out any nulls (in case a user id doesn't exist)
    return users.filter((user) => user !== null);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const threeRandomNumbers = `${Math.floor(Math.random() * 10 + 1)}${Math.floor(Math.random() * 10 + 1)}${Math.floor(Math.random() * 10 + 1)}`;
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
      email: data.email_addresses?.[0]?.email_address,
      externalId: data.id,
      username: data.username || `${data.first_name}${threeRandomNumbers}`,
      allowNotifications: true,
    };
    const user = await userByExternalId(ctx, data.id);

    if (user === null) {
      // First create the user
      const userId = await ctx.db.insert('users', userAttributes);

      // Automatically create a wallet for the new user
      await ctx.db.insert('wallets', {
        userId,
        balance: 0,
        currency: 'NGN',
        status: 'active',
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const updatePaystackCustomerId = internalMutation({
  args: {
    userId: v.id('users'),
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.patch(args.userId, {
      paystackCustomerId: args.customerId,
    });
    return user;
  },
});

// Get User or throw an error if not found
// This is useful for server actions where you need to ensure a user exists
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) {
    return null;
  }
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (q) => q.eq('externalId', externalId))
    .unique();
}

export const storePaystackCustomerId = mutation({
  args: { userId: v.id('users'), paystackCustomerId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      paystackCustomerId: args.paystackCustomerId,
    });
  },
});

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('User is not authenticated');
    }
    if (identity.tokenIdentifier !== args.tokenIdentifier) {
      throw new Error('Token does not match the authenticated user');
    }

    const user = await userByExternalId(ctx, identity.subject);
    return user;
  },
});

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('User is not authenticated');
    }

    const user = await ctx.db.get(args.userId);

    return user;
  },
});

export const getById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

// Check if a user is verified
export const isUserVerified = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.verified === true;
  },
});

// One week in milliseconds
// biome-ignore lint/style/noMagicNumbers: <Well described>
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Update weekly product count for a user (called when posting a product)
export const updateWeeklyProductCount = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return;
    }

    const now = Date.now();

    // Check if we need to reset the weekly count (new week started)
    const weekStart = user.weekStartTimestamp ?? 0;
    const isNewWeek = now - weekStart > ONE_WEEK_MS;

    if (isNewWeek) {
      // Reset counter for new week
      await ctx.db.patch(args.userId, {
        lastWeeklyProductCount: 1,
        weekStartTimestamp: now,
      });
    } else {
      // Increment counter
      await ctx.db.patch(args.userId, {
        lastWeeklyProductCount: (user.lastWeeklyProductCount ?? 0) + 1,
      });
    }
  },
});

// Get weekly product count for current user
export const getWeeklyProductCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return 0;
    }

    const now = Date.now();
    const weekStart = user.weekStartTimestamp ?? 0;

    // If week has expired, count is 0
    if (now - weekStart > ONE_WEEK_MS) {
      return 0;
    }

    return user.lastWeeklyProductCount ?? 0;
  },
});
