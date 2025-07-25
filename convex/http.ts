import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { getCurrentUserOrThrow } from "./users";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// CORS configuration
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://flickmart.app",
  "https://flickmart-demo.vercel.app"
];

function getCorsHeaders(origin?: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  });
}

function getJsonHeaders(origin?: string | null) {
  const corsHeaders = getCorsHeaders(origin);
  corsHeaders.set("Content-Type", "application/json");
  return corsHeaders;
}

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

// Wallet and wallet related http

http.route({
  path: "/paystack/initialize",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
  ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/paystack/initialize",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    const { email, amount } = await request.json();

    const user = await ctx.runQuery(api.users.current);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: getJsonHeaders(origin),
      });
    }

    // Create or get wallet
    let walletId: Id<"wallets">;
    const wallet = await ctx.runQuery(api.wallet.getWalletByUserId, {
      userId: user._id,
    });

    if (wallet) {
      walletId = wallet._id;
    } else {
      // Create new wallet if one doesn't exist
      try {
        walletId = await ctx.runMutation(api.wallet.createWallet, {
          userId: user._id,
          balance: 0,
          currency: "NGN",
          status: "active",
        });
      } catch (error) {
        console.error("Failed to create wallet:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create wallet" }),
          {
            status: 500,
            headers: getJsonHeaders(origin),
          }
        );
      }
    }

    // Ensure wallet ID exists before proceeding
    if (!walletId) {
      return new Response(
        JSON.stringify({ error: "Wallet ID not available" }),
        {
          status: 500,
          headers: getJsonHeaders(origin),
        }
      );
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, amount: amount * 100 }), // Convert to kobo
      }
    );
    const data = await response.json();
    if (data.status) {
      try {
        const reference = await ctx.runAction(
          api.actions.generateTransactionReference,
          {
            type: "funding",
          }
        );
        await ctx.runMutation(internal.transactions.create, {
          userId: user._id,
          walletId: walletId,
          paystackReference: data.data.reference,
          reference: reference,
          amount: amount * 100,
          status: "pending",
          type: "funding",
          description: "Money is being deposited into the users wallet",
        });
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: getJsonHeaders(origin),
        });
      } catch (error) {
        console.error("Failed to create transaction:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create transaction record" }),
          {
            status: 500,
            headers: getJsonHeaders(origin),
          }
        );
      }
    }
    return new Response(JSON.stringify(data), {
      status: 400,
      headers: getJsonHeaders(origin),
    });
  }),
});

http.route({
  path: "/paystack/verify",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/paystack/verify",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const { reference } = await request.json();
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const data = await response.json();
    if (data.status && data.data.status === "success") {
      const transaction = await ctx.runQuery(
        api.transactions.getByPaystackReference,
        {
          reference: reference,
        }
      );
      if (!transaction) {
        return new Response(
          JSON.stringify({ error: "Transaction not found" }),
          {
            status: 404,
            headers: getJsonHeaders(origin),
          }
        );
      }

      if (transaction && transaction.status !== "success") {
        await ctx.runMutation(internal.transactions.updateTransaction, {
          transactionId: transaction._id,
          status: "success",
          bank: data.data.authorization.bank,
          last4: data.data.authorization.last4,
          cardType: data.data.authorization.card_type,
          channel: data.data.channel,
          currency: data.data.currency,
          paystackFees: data.data.fees,
        });
        const wallet = await ctx.runQuery(api.wallet.getWalletByWalletId, {
          walletId: transaction.walletId,
        });
        if (wallet) {
          await ctx.runMutation(internal.wallet.updateBalance, {
            walletId: wallet._id,
            balance: wallet.balance + transaction.amount,
          });
        }
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: getJsonHeaders(origin),
      });
    }
    return new Response(JSON.stringify(data), {
      status: 400,
      headers: getJsonHeaders(origin),
    });
  }),
});

http.route({
  path: "/paystack/withdraw",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/paystack/withdraw",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    const { account_number, bank_code, amount, name } = await request.json();

    if (!account_number || !bank_code || !amount || !name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers,
      });
    }

    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers,
      });
    }

    const wallet = await ctx.runQuery(api.wallet.getWalletByUserId, {
      userId: user._id,
    });
    if (!wallet || wallet.balance < amount * 100) {
      return new Response(JSON.stringify({ error: "Insufficient funds" }), {
        status: 400,
        headers,
      });
    }

    let recipientCode = wallet.recipientCode;
    if (!recipientCode) {
      // If recipient code does not exist, create a new recipient
      const recipientRes = await fetch(
        "https://api.paystack.co/transferrecipient",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nuban",
            name,
            account_number,
            bank_code,
            currency: "NGN",
          }),
        }
      );

      const recipientData = await recipientRes.json();
      console.log(recipientData);

      if (!recipientData.status) {
        return new Response(
          JSON.stringify({
            error: recipientData.message || "Failed to create recipient",
          }),
          { status: 400, headers }
        );
      }
      recipientCode = recipientData.data.recipient_code;
    }

    // Initiate transfer
    const transferRes = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount * 100,
        recipient: recipientCode,
        reason: "User withdrawal",
      }),
    });

    const transferData = await transferRes.json();
    console.log(transferData);
    // Save withdrawal transaction
    const reference = await ctx.runAction(
      api.actions.generateTransactionReference,
      { type: "withdrawal" }
    );
    await ctx.runMutation(internal.transactions.create, {
      userId: user._id,
      walletId: wallet._id,
      paystackReference: transferData.data.reference,
      reference,
      amount: amount * 100,
      status: "pending",
      type: "withdrawal",
      description: "User withdrawal to bank account",
    });

    if (!transferData.status) {
      return new Response(
        JSON.stringify({ error: transferData.message || "Transfer failed" }),
        {
          status: 400,
          headers,
        }
      );
    }

    // Update wallet balance
    await ctx.runMutation(internal.wallet.updateBalance, {
      walletId: wallet._id,
      balance: wallet.balance - amount * 100,
    });

    return new Response(JSON.stringify(transferData), { status: 200, headers });
  }),
});

http.route({
  path: "/paystack/list-banks",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

// List Banks Route
http.route({
  path: "/paystack/list-banks",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    try {
      // Get the user from the request
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers,
        });
      }

      // Fetch the list of banks from Paystack
      const response = await fetch(
        "https://api.paystack.co/bank?country=nigeria",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data.status) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch banks" }),
          { status: 400, headers }
        );
      }

      return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (error) {
      console.error("Error fetching banks:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers,
      });
    }
  }),
});

// Paystack Webhook Route
http.route({
  path: "/paystack/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Paystack Verified IP IPs
    const PAYSTACK_IPS = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

    // Helper function to check IP
    function isPaystackIP(ip: string): boolean {
      return PAYSTACK_IPS.includes(ip);
    }

    try {
      // Extract IP from request
      const ipHeader = request.headers.get("x-forwarded-for") || "";
      const ip = ipHeader.split(",")[0].trim();

      // Verify IP (commented out for development, uncomment in production)
      // if (!isPaystackIP(ip)) {
      //   console.error("Invalid IP address:", ip);
      //   return new Response("Invalid IP", { status: 401 });
      // }

      // Get the event payload
      const event = await request.json();
      console.log(event);
      // Verify signature
      const paystackSignature = request.headers.get("x-paystack-signature");
      if (!paystackSignature) {
        console.error("No Paystack signature found");
        return new Response("No signature", { status: 401 });
      }

      const isValid = await ctx.runAction(api.actions.verifyPaystackWebhook, {
        payload: JSON.stringify(event),
        signature: paystackSignature,
      });

      if (!isValid) {
        console.error("Invalid Paystack signature");
        return new Response("Invalid signature", { status: 401 });
      }

      // Process event
      if (event.event === "charge.success") {
        console.log(event);
        console.log("Processing charge.success event");
        const { reference, amount } = event.data;

        // Find the transaction
        const transaction = await ctx.runQuery(
          api.transactions.getByPaystackReference,
          {
            reference: reference,
          }
        );

        if (transaction && transaction.status !== "success") {
          await ctx.runMutation(internal.transactions.updateTransaction, {
            transactionId: transaction._id,
            status: "success",
            bank: event.data.authorization.bank,
            last4: event.data.authorization.last4,
            cardType: event.data.authorization.card_type,
            channel: event.data.channel,
            currency: event.data.currency,
            paystackFees: event.data.fees,
          });

          // Get and update wallet
          const wallet = await ctx.runQuery(api.wallet.getWalletByWalletId, {
            walletId: transaction.walletId,
          });

          if (wallet) {
            await ctx.runMutation(internal.wallet.updateBalance, {
              walletId: wallet._id,
              balance: wallet.balance + transaction.amount,
            });
          }
        }
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Error processing Paystack webhook:", error);
      return new Response("Internal server error", { status: 500 });
    }
  }),
});

http.route({
  path: "/paystack/verify-account",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/paystack/verify-account",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    const { account_number, bank_code } = await request.json();

    if (!account_number || !bank_code) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers,
        }
      );
    }

    try {
      const response = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data.status) {
        return new Response(
          JSON.stringify({ error: data.message || "Failed to verify account" }),
          { status: 400, headers }
        );
      }

      return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (error) {
      console.error("Error verifying account:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers,
      });
    }
  }),
});

http.route({
  path: "/wallet/charge-ad",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    const headers = request.headers;
    
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/wallet/charge-ad",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    const { amount, plan, userId, walletId } = await request.json();

    if (!amount || !plan || !userId || !walletId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers,
        }
      );
    }

    try {
      // Get wallet
      const wallet = await ctx.runQuery(api.wallet.getWalletByWalletId, {
        walletId,
      });

      if (!wallet) {
        return new Response(JSON.stringify({ error: "Wallet not found" }), {
          status: 404,
          headers,
        });
      }

      // Check if user has sufficient balance
      if (wallet.balance < amount * 100) {
        return new Response(JSON.stringify({ error: "Insufficient balance" }), {
          status: 400,
          headers,
        });
      }

      // Generate transaction reference
      const reference = await ctx.runAction(
        api.actions.generateTransactionReference,
        {
          type: "ads_posting",
        }
      );

      // Create transaction record
      const transactionId = await ctx.runMutation(internal.transactions.create, {
        userId,
        walletId,
        reference,
        amount: amount * 100,
        status: "success",
        type: "ads_posting",
        description: `Payment for ${plan} ad posting plan`,
        metadata: {
          plan,
        },
      });

      // Update wallet balance
      await ctx.runMutation(internal.wallet.updateBalance, {
        walletId,
        balance: wallet.balance - amount * 100,
      });

      return new Response(
        JSON.stringify({
          status: true,
          message: "Payment successful",
          data: {
            transactionId,
            reference,
            amount: amount * 100,
            plan,
          },
        }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Error processing ad posting charge:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers,
      });
    }
  }),
});

// PIN Management Endpoints

http.route({
  path: "/wallet/pin/check",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});
http.route({
  path: "/wallet/pin/check",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    try {
      const result = await ctx.runQuery(api.wallet.checkPinExists);
      return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
    }
  }),
});

http.route({
  path: "/wallet/pin/create",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});

http.route({
  path: "/wallet/pin/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const { pin } = await request.json();
    if (!pin) {
      return new Response(JSON.stringify({ error: "PIN is required" }), { status: 400, headers });
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return new Response(JSON.stringify({ error: "PIN must be exactly 6 digits" }), { status: 400, headers });
    }

    try {
      const user = await ctx.runQuery(api.users.current);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
      }

      // Hash the PIN
      const hashedPin = await ctx.runAction(api.actions.hashPin, { pin });

      // Create PIN
      const result = await ctx.runMutation(internal.wallet.createPinInternal, {
        userId: user._id,
        hashedPin,
      });

      return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
    }
  }),
});

http.route({
  path: "/wallet/pin/verify",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});

http.route({
  path: "/wallet/pin/verify",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const { pin } = await request.json();
    if (!pin) {
      return new Response(JSON.stringify({ error: "PIN is required" }), { status: 400, headers });
    }

    try {
      const user = await ctx.runQuery(api.users.current);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
      }

      // Get wallet and PIN info
      const { wallet, hashedPin } = await ctx.runMutation(internal.wallet.verifyPinInternal, {
        userId: user._id,
        pin,
      });

      // Verify PIN
      const isValid = await ctx.runAction(api.actions.verifyPin, {
        pin,
        hashedPin,
      });

      if (!isValid) {
        const attempts = (wallet.pinAttempts || 0) + 1;
        const maxAttempts = 3;

        if (attempts >= maxAttempts) {
          // Lock wallet for 5 minutes
          await ctx.runMutation(internal.wallet.updatePinAttempts, {
            walletId: wallet._id,
            attempts,
            lockUntil: Date.now() + 5 * 60 * 1000,
          });
          return new Response(
            JSON.stringify({ error: "Too many failed attempts. Wallet locked for 5 minutes." }),
            { status: 400, headers }
          );
        } else {
          await ctx.runMutation(internal.wallet.updatePinAttempts, {
            walletId: wallet._id,
            attempts,
          });
          return new Response(
            JSON.stringify({ error: `Incorrect PIN. ${maxAttempts - attempts} attempts remaining.` }),
            { status: 400, headers }
          );
        }
      }

      // Reset attempts on successful verification
      await ctx.runMutation(internal.wallet.resetPinAttempts, {
        walletId: wallet._id,
      });

      return new Response(JSON.stringify({ success: true, message: "PIN verified successfully" }), {
        status: 200,
        headers,
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
    }
  }),
});

http.route({
  path: "/wallet/pin/change",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});

http.route({
  path: "/wallet/pin/change",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const { currentPin, newPin } = await request.json();
    if (!currentPin || !newPin) {
      return new Response(JSON.stringify({ error: "Both current PIN and new PIN are required" }), { status: 400, headers });
    }

    // Validate new PIN format
    if (!/^\d{6}$/.test(newPin)) {
      return new Response(JSON.stringify({ error: "New PIN must be exactly 6 digits" }), { status: 400, headers });
    }

    try {
      const user = await ctx.runQuery(api.users.current);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
      }

      // First verify current PIN
      const { wallet, hashedPin } = await ctx.runMutation(internal.wallet.verifyPinInternal, {
        userId: user._id,
        pin: currentPin,
      });

      const isCurrentPinValid = await ctx.runAction(api.actions.verifyPin, {
        pin: currentPin,
        hashedPin,
      });

      if (!isCurrentPinValid) {
        return new Response(JSON.stringify({ error: "Current PIN is incorrect" }), { status: 400, headers });
      }

      // Hash new PIN
      const newHashedPin = await ctx.runAction(api.actions.hashPin, { pin: newPin });

      // Update PIN
      const result = await ctx.runMutation(internal.wallet.changePinInternal, {
        userId: user._id,
        hashedPin: newHashedPin,
      });

      return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
    }
  }),
});

http.route({
  path: "/wallet/transfer",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});

http.route({
  path: "/wallet/transfer",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const { sellerId, amount, productIds, pin } = await request.json();
    if (!sellerId || !amount || !pin) {
      return new Response(JSON.stringify({ error: "Missing required fields: sellerId, amount, pin" }), { status: 400, headers });
    }

    try {
        // First verify the PIN
        const user = await ctx.runQuery(api.users.current);
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
        }

        // Get wallet and verify PIN
        const { wallet, hashedPin } = await ctx.runMutation(internal.wallet.verifyPinInternal, {
          userId: user._id,
          pin,
        });

        // Verify PIN
        const isValid = await ctx.runAction(api.actions.verifyPin, {
          pin,
          hashedPin,
        });

        if (!isValid) {
          const attempts = (wallet.pinAttempts || 0) + 1;
          const maxAttempts = 3;

          if (attempts >= maxAttempts) {
            // Lock wallet for 5 minutes
            await ctx.runMutation(internal.wallet.updatePinAttempts, {
              walletId: wallet._id,
              attempts,
              lockUntil: Date.now() + 5 * 60 * 1000,
            });
            return new Response(
              JSON.stringify({ error: "Too many failed attempts. Wallet locked for 5 minutes." }),
              { status: 400, headers }
            );
          } else {
            await ctx.runMutation(internal.wallet.updatePinAttempts, {
              walletId: wallet._id,
              attempts,
            });
            return new Response(
              JSON.stringify({ error: `Incorrect PIN. ${maxAttempts - attempts} attempts remaining.` }),
              { status: 400, headers }
            );
          }
        }

        // Reset attempts on successful verification
        await ctx.runMutation(internal.wallet.resetPinAttempts, {
          walletId: wallet._id,
        });

        // Validate and format productIds array
        let validatedProductIds: Id<"product">[] = [];
        if (productIds && Array.isArray(productIds)) {
          validatedProductIds = productIds.filter((id: any) => typeof id === 'string' && id.length > 0);
          
          // Validate that all products belong to the seller
          if (validatedProductIds.length > 0) {
            const products = await Promise.all(
              validatedProductIds.map(productId => ctx.runQuery(api.product.getById, { productId: productId }))
            );
            
            // Check if any products don't exist or don't belong to the seller
            const invalidProducts = products.filter((product, index) => {
              if (!product) {
                console.error(`Product not found: ${validatedProductIds[index]}`);
                return true;
              }
              if (product.userId !== sellerId) {
                console.error(`Product ${product._id} does not belong to seller ${sellerId}`);
                return true;
              }
              return false;
            });
            
            if (invalidProducts.length > 0) {
              return new Response(
                JSON.stringify({ 
                  error: "One or more selected products are invalid or do not belong to the seller. Please refresh and try again." 
                }), 
                { status: 400, headers }
              );
            }
          }
        }

        // Now proceed with the transfer
        const result = await ctx.runMutation(api.wallet.transferToUserWithEscrow, {
            sellerId: sellerId as Id<"users">,
            amount: Number(amount),
            productIds: validatedProductIds,
        });
        
        return new Response(JSON.stringify(result), { status: 200, headers });

    } catch (error: any) {
        console.error("Error during transfer:", error);
        return new Response(JSON.stringify({ error: error.message || "An internal error occurred." }), { status: 500, headers });
    }
  }),
});

http.route({
  path: "/orders/confirm-completion",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const origin = request.headers.get("Origin");
    return new Response(null, { headers: getCorsHeaders(origin) });
  }),
});

http.route({
  path: "/orders/confirm-completion",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("Origin");
    const headers = getJsonHeaders(origin);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "Missing required field: orderId" }), { status: 400, headers });
    }

    try {
        const result = await ctx.runMutation(api.orders.confirmOrderCompletion, {
            orderId: orderId as Id<"orders">,
        });
        
        return new Response(JSON.stringify(result), { status: 200, headers });

    } catch (error: any) {
        console.error("Error during order confirmation:", error);
        return new Response(JSON.stringify({ error: error.message || "An internal error occurred." }), { status: 500, headers });
    }
  }),
});


export default http;