import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { getCurrentUserOrThrow } from "./users";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

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
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    });

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
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Content-Type": "application/json",
          Vary: "Origin",
        }),
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
            headers: new Headers({
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Content-Type": "application/json",
              Vary: "Origin",
            }),
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
          headers: new Headers({
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
            Vary: "Origin",
          }),
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
          headers: new Headers({
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
            Vary: "Origin",
          }),
        });
      } catch (error) {
        console.error("Failed to create transaction:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create transaction record" }),
          {
            status: 500,
            headers: new Headers({
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Content-Type": "application/json",
              Vary: "Origin",
            }),
          }
        );
      }
    }
    return new Response(JSON.stringify(data), {
      status: 400,
      headers: new Headers({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Content-Type": "application/json",
        Vary: "Origin",
      }),
    });
  }),
});

http.route({
  path: "/paystack/verify",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
            headers: new Headers({
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Content-Type": "application/json",
              Vary: "Origin",
            }),
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
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Content-Type": "application/json",
          Vary: "Origin",
        }),
      });
    }
    return new Response(JSON.stringify(data), {
      status: 400,
      headers: new Headers({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Content-Type": "application/json",
        Vary: "Origin",
      }),
    });
  }),
});

http.route({
  path: "/paystack/withdraw",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Vary: "Origin",
    });

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
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    };

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
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Vary: "Origin",
    });

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
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }),
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
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Vary: "Origin",
    });

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
          type: "ad_posting",
        }
      );

      // Create transaction record
      await ctx.runMutation(internal.transactions.create, {
        userId,
        walletId,
        reference,
        amount: amount * 100,
        status: "success",
        type: "ad_posting",
        description: `Payment for ${plan} ad posting plan`,
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

export default http;
