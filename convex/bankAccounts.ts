import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

// Get all bank accounts for current user
export const getUserBankAccounts = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const bankAccounts = await ctx.db
      .query("bankAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return bankAccounts.sort((a, b) => {
      // Default account first, then by creation date
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Get bank account by ID
export const getBankAccountById = query({
  args: { bankAccountId: v.id("bankAccounts") },
  handler: async (ctx, { bankAccountId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const bankAccount = await ctx.db.get(bankAccountId);
    if (!bankAccount || bankAccount.userId !== user._id) {
      throw new Error("Bank account not found");
    }

    return bankAccount;
  },
});

// Create a new bank account
export const createBankAccount = mutation({
  args: {
    accountNumber: v.string(),
    accountName: v.string(),
    bankCode: v.string(),
    bankName: v.string(),
    recipientCode: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get existing accounts to check for defaults and count
    const existingAccounts = await ctx.db
      .query("bankAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // If this is set as default, unset other defaults
    if (args.isDefault) {
      for (const account of existingAccounts) {
        if (account.isDefault) {
          await ctx.db.patch(account._id, { isDefault: false });
        }
      }
    }

    // If this is the first account, make it default
    const isFirstAccount = existingAccounts.length === 0;

    const bankAccountId = await ctx.db.insert("bankAccounts", {
      userId: user._id,
      accountNumber: args.accountNumber,
      accountName: args.accountName,
      bankCode: args.bankCode,
      bankName: args.bankName,
      recipientCode: args.recipientCode,
      isVerified: !!args.recipientCode, // If we have recipient code, it's verified
      isDefault: args.isDefault || isFirstAccount,
      createdAt: Date.now(),
    });

    return bankAccountId;
  },
});

// Update bank account (mainly for adding recipient code after verification)
export const updateBankAccount = internalMutation({
  args: {
    bankAccountId: v.id("bankAccounts"),
    recipientCode: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, { bankAccountId, recipientCode, isVerified }) => {
    const updates: any = {};
    if (recipientCode !== undefined) updates.recipientCode = recipientCode;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    await ctx.db.patch(bankAccountId, updates);
    return bankAccountId;
  },
});

// Set default bank account
export const setDefaultBankAccount = mutation({
  args: { bankAccountId: v.id("bankAccounts") },
  handler: async (ctx, { bankAccountId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify the account belongs to the user
    const bankAccount = await ctx.db.get(bankAccountId);
    if (!bankAccount || bankAccount.userId !== user._id) {
      throw new Error("Bank account not found");
    }

    // Unset all other defaults
    const allAccounts = await ctx.db
      .query("bankAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const account of allAccounts) {
      await ctx.db.patch(account._id, {
        isDefault: account._id === bankAccountId,
      });
    }

    return bankAccountId;
  },
});

// Delete bank account
export const deleteBankAccount = mutation({
  args: { bankAccountId: v.id("bankAccounts") },
  handler: async (ctx, { bankAccountId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify the account belongs to the user
    const bankAccount = await ctx.db.get(bankAccountId);
    if (!bankAccount || bankAccount.userId !== user._id) {
      throw new Error("Bank account not found");
    }

    // Check if there are other accounts
    const allAccounts = await ctx.db
      .query("bankAccounts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (allAccounts.length === 1) {
      throw new Error("Cannot delete the only bank account");
    }

    // If deleting default account, set another as default
    if (bankAccount.isDefault) {
      const otherAccount = allAccounts.find((acc) => acc._id !== bankAccountId);
      if (otherAccount) {
        await ctx.db.patch(otherAccount._id, { isDefault: true });
      }
    }

    await ctx.db.delete(bankAccountId);
    return { success: true };
  },
});
