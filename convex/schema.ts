import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
    walletId: v.optional(v.id("wallets")),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),

    paystackCustomerId: v.optional(v.string()), // Store Paystack Customer ID
    role: v.optional(v.union(v.literal("buyer"), v.literal("seller"))),
    allowNotifications: v.optional(v.boolean()),

    username: v.optional(v.string()),
    description: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    contact: v.optional(
      v.object({
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
      })
    ),
  }).index("byExternalId", ["externalId"]),

  // Store
  store: defineTable({
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    userId: v.id("users"),
    phone: v.optional(v.string()),
  }).index("byUserId", ["userId"]),

  // Product
  product: defineTable({
    userId: v.id("users"),
    title: v.string(),

    description: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    businessId: v.id("store"),
    category: v.string(),
    subcategory: v.optional(v.string()),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
    views: v.optional(v.number()),
    negotiable: v.optional(v.boolean()),
    commentsId: v.optional(v.id("comments")),
    plan: v.union(
      v.literal("free"),
      v.literal("basic"),
      v.literal("pro"),
      v.literal("premium")
    ),
    exchange: v.optional(v.boolean()),
    condition: v.union(v.literal("brand new"), v.literal("used")),
    timeStamp: v.string(),
    location: v.union(v.literal("enugu"), v.literal("nsukka")),
    link: v.optional(v.string()),
    phone: v.string(),
    store: v.string(),
  }).index("by_userId", ["userId"]),

  // Interactions
  interactions: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.number(),
    type: v.string(),
    value: v.number(),

    // interaction: v.union(
    //   v.literal("like"),
    //   v.literal("dislike"),
    //   v.literal("comment")
    // ),
  }),
  // Sub Categories
  subcategories: defineTable({
    category: v.string(),
    items: v.array(
      v.object({
        title: v.string(),
        image: v.string(),
        size: v.number(),
      })
    ),
  }),

  // History Search
  history: defineTable({
    userId: v.id("users"),
    timeStamp: v.string(),
    search: v.string(),
  }),

  // Comments
  comments: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    content: v.string(),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
  }),

  // Views
  views: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    viewed: v.boolean(),
    timeStamp: v.string(),
  }),

  // Likes
  likes: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    liked: v.boolean(),
    disliked: v.boolean(),
  }),

  // Saved and Wishlist
  bookmarks: defineTable({
    productId: v.id("product"),
    userId: v.id("users"),
    timeStamp: v.string(),
    type: v.union(v.literal("saved"), v.literal("wishlist")),
    added: v.boolean(),
  }),

  conversations: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    lastMessageId: v.optional(v.id("message")),
    archivedByUsers: v.optional(v.array(v.id("users"))),
    unreadCount: v.optional(v.record(v.string(), v.number())),
    updatedAt: v.optional(v.number()),
  })
    .index("byUser1Id", ["user1"])
    .index("byUser2Id", ["user2"]),
  message: defineTable({
    senderId: v.id("users"),
    content: v.optional(v.string()),
    readByUsers: v.optional(v.array(v.id("users"))),
    productId: v.optional(v.id("product")),
    conversationId: v.id("conversations"),
    file: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    type: v.optional(
      v.union(
        v.literal("text"),
        v.literal("product"),
        v.literal("escrow"),
        v.literal("transfer")
      )
    ),
    price: v.optional(v.number()),
    title: v.optional(v.string()),
    productImage: v.optional(v.string()),
    // Transfer-specific fields
    orderId: v.optional(v.id("orders")),
    transferAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
  }),
  notifications: defineTable({
    title: v.string(),
    userId: v.id("users"),
    type: v.union(
      v.literal("new_message"),
      v.literal("new_like"),
      v.literal("new_comment"),
      v.literal("new_sale"),
      v.literal("new_store"),
      v.literal("advertisement"),
      v.literal("reminder"),
      v.literal("escrow_funded"),
      v.literal("escrow_released"),
      v.literal("completion_confirmed")
    ),
    relatedId: v.optional(
      v.union(
        v.id("product"),
        v.id("message"),
        v.id("comments"),
        v.id("store"),
        v.id("conversations"),
        v.id("orders"),
        v.id("users")
      )
    ),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    isViewed: v.optional(v.boolean()), // For tracking if notification was viewed (affects count)
    timestamp: v.number(),
    link: v.optional(v.string()),
  })
    .index("byUserId", ["userId"])
    .index("byUserIdAndIsRead", ["userId", "isRead"])
    .index("byUserIdAndIsViewed", ["userId", "isViewed"]),

  presence: defineTable({
    userId: v.id("users"),
    isTyping: v.boolean(),
    typingInConversation: v.optional(v.id("conversations")),
    lastUpdated: v.number(),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away")
    ),
  })
    .index("byUserId", ["userId"])
    .index("byTypingInConversation", ["typingInConversation"]),

  wallets: defineTable({
    userId: v.id("users"),
    balance: v.number(), // Available balance
    currency: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("blocked")
    ),
    recipientCode: v.optional(v.string()), // Paystack recipient code
    paystackCustomerId: v.optional(v.string()), // Paystack customer ID
    // PIN security fields
    pinHash: v.optional(v.string()), // bcrypt hashed PIN
    pinAttempts: v.optional(v.number()), // Failed PIN attempts counter
    pinLockedUntil: v.optional(v.number()), // Timestamp when lock expires
    pinCreatedAt: v.optional(v.number()), // PIN creation timestamp
    pinUpdatedAt: v.optional(v.number()), // Last PIN update timestamp
  }).index("by_user", ["userId"]),

  // All transactions for audit trail
  transactions: defineTable({
    userId: v.id("users"),
    walletId: v.id("wallets"),
    type: v.union(
      v.literal("funding"), // Money in from Paystack
      v.literal("withdrawal"), // Money out to bank
      v.literal("transfer_in"), // P2P received
      v.literal("transfer_out"), // P2P sent
      v.literal("escrow_freeze"), // Funds frozen for order
      v.literal("escrow_release"), // Funds released to seller
      v.literal("escrow_refund"), // Funds refunded to buyer
      v.literal("ads_posting"), // Payment for posting an ad
      v.literal("ad_posting"), // Payment for posting an ad
      v.literal("ad_promotion"), // Payment for promoting an ad
      v.literal("subscription"), // Payment for subscription
      v.literal("refund") // General refund
    ),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    reference: v.string(),
    paystackReference: v.optional(v.string()),
    description: v.string(),
    bank: v.optional(v.string()),
    last4: v.optional(v.string()),
    cardType: v.optional(v.string()),
    channel: v.optional(v.string()),
    currency: v.optional(v.string()),
    fees: v.optional(v.number()), // Transaction fees
    paystackFees: v.optional(v.number()), // Paystack fees
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id("orders")),
        recipientUserId: v.optional(v.id("users")),
        recipientName: v.optional(v.string()),
        transferId: v.optional(v.id("transfers")),
        escrowId: v.optional(v.id("escrows")),
        adId: v.optional(v.id("product")), // Reference to the ad being posted/promoted
        productIds: v.optional(v.array(v.id("product"))),
        plan: v.optional(
          v.union(
            v.literal("free"),
            v.literal("basic"),
            v.literal("pro"),
            v.literal("premium")
          )
        ), // Ad plan type
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_wallet", ["walletId"])
    .index("by_reference", ["reference"])
    .index("by_paystack_reference", ["paystackReference"]),

  orders: defineTable({
    productIds: v.array(v.id("product")),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    amount: v.number(),
    status: v.union(
      v.literal("in_escrow"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("disputed")
    ),
    buyerConfirmedCompletion: v.boolean(),
    sellerConfirmedCompletion: v.boolean(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"]),

  transfers: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    description: v.optional(v.string()),
    status: v.literal("completed"), // Always completed instantly
    reference: v.string(),
  })
    .index("by_sender", ["fromUserId"])
    .index("by_recipient", ["toUserId"]),

  // Escrow - just balance freezing
  escrows: defineTable({
    orderId: v.id("orders"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("frozen"), // Balance frozen
      v.literal("released"), // Released to seller
      v.literal("refunded") // Refunded to buyer
    ),
    reference: v.string(),
    autoReleaseAt: v.optional(v.number()),
    createdAt: v.number(),
    releasedAt: v.optional(v.number()),
  })
    .index("by_order", ["orderId"])
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"]),

  // Bank accounts for withdrawals
  bankAccounts: defineTable({
    userId: v.id("users"),
    accountNumber: v.string(),
    accountName: v.string(),
    bankCode: v.string(),
    bankName: v.string(),
    recipientCode: v.optional(v.string()),
    isVerified: v.boolean(),
    isDefault: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Withdrawal requests
  withdrawals: defineTable({
    userId: v.id("users"),
    walletId: v.id("wallets"),
    bankAccountId: v.id("bankAccounts"),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    paystackTransferCode: v.optional(v.string()),
    reference: v.string(),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Push notification subscriptions
  pushSubscriptions: defineTable({
    userId: v.id("users"),
    subscription: v.string(), // JSON stringified subscription object
    endpoint: v.optional(v.string()), // Unique endpoint for this subscription (optional during migration)
    userAgent: v.optional(v.string()),
    deviceInfo: v.optional(
      v.object({
        platform: v.optional(v.string()),
        browser: v.optional(v.string()),
        deviceType: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    lastUsed: v.optional(v.number()),
    isActive: v.optional(v.boolean()), // Track if subscription is still valid
  })
    .index("by_user", ["userId"])
    .index("by_endpoint", ["endpoint"])
    .index("by_user_endpoint", ["userId", "endpoint"]),
});
