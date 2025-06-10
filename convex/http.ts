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

    // Get user directly from their clerk ID
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
        await ctx.runMutation(internal.transactions.create, {
          userId: user._id,
          walletId: walletId,
          reference: data.data.reference,
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
      const transaction = await ctx.runQuery(api.transactions.getByReference, {
        reference: reference,
      });
      if (transaction && transaction.status !== "success") {
        await ctx.runMutation(api.transactions.update, {
          transactionId: transaction._id,
          status: "success",
        });
        const wallet = await ctx.runQuery(api.wallet.getWalletByWalletId, {
          walletId: transaction.walletId,
        });
        if (wallet) {
          await ctx.runMutation(api.wallet.updateBalance, {
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

// Paystack Webhook Route
http.route({
  path: "/paystack/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await request.json();
    // Verify Paystack webhook signature
    const paystackSignature = request.headers.get("x-paystack-signature");
    const isValid = ctx.runAction(api.actions.verifyPaystackWebhook, {
      payload: JSON.stringify(event),
      signature: paystackSignature!,
    });
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    if (event.event === "charge.success") {
      const { reference, amount } = event.data;
      const transaction = await ctx.runQuery(api.transactions.getByReference, {
        reference: reference,
      });
      if (transaction && transaction.status !== "success") {
        await ctx.runMutation(api.transactions.update, {
          transactionId: transaction._id,
          status: "success",
        });
        const wallet = await ctx.runQuery(api.wallet.getWalletByWalletId, {
          walletId: transaction.walletId,
        });
        await ctx.runMutation(api.wallet.updateBalance, {
          walletId: wallet!._id,
          balance: wallet!.balance + amount,
        });
      }
    }
    return new Response(null, { status: 200 });
  }),
});

export default http;
