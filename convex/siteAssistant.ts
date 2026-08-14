import { components } from "./_generated/api";
import {
  httpAction,
  mutation,
  query,
} from "./_generated/server";
import {
  PersistentTextStreaming,
  StreamId,
  StreamIdValidator,
} from "@convex-dev/persistent-text-streaming";
import { cors } from "./cors";
import { siteAssistantSystemPrompt } from "./system";
import { type ChatTurn, streamOpenRouterChat } from "./openrouter";

const pts = new PersistentTextStreaming(components.persistentTextStreaming);

// Starts a new, anonymous stream for the site-wide assistant widget.
// Intentionally has no auth check -- the widget must work for logged-out
// visitors, and stream rows here carry no user/session data.
export const createAssistantStream = mutation({
  args: {},
  handler: async (ctx) => {
    return await pts.createStream(ctx);
  },
});

export const getAssistantStreamBody = query({
  args: {
    streamId: StreamIdValidator,
  },
  handler: async (ctx, args) => {
    return await pts.getStreamBody(ctx, args.streamId as StreamId);
  },
});

// HTTP action that actually generates the assistant's reply. Looks up
// relevant listings/stores from the vector DB (unfiltered by seller, unlike
// the per-conversation seller AI in chat.ts) so it can answer "is X
// available" style questions with real, current inventory instead of
// deflecting every specific-product question.
export const streamSiteAssistantResponse = httpAction(async (ctx, request) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors(request),
      });
    }

    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt");
    const streamId = searchParams.get("streamId");
    const historyParam = searchParams.get("history");

    if (!prompt || !streamId) {
      return new Response("Missing prompt or streamId", {
        status: 400,
        headers: cors(request),
      });
    }

    // The widget has no server-side conversation record (by design -- see
    // createAssistantStream), so unlike the seller AI's history lookup this
    // can't be re-derived from the database. The client instead sends the
    // prior turns it already holds in its own session state.
    let history: ChatTurn[] = [];
    if (historyParam) {
      try {
        const parsed = JSON.parse(historyParam);
        if (Array.isArray(parsed)) {
          history = parsed;
        }
      } catch {
        // Malformed/truncated history param -- answer without it rather
        // than failing the whole request.
      }
    }

    // Vector-DB context is best-effort: if it fails, still answer using the
    // system prompt alone rather than failing the whole reply.
    let infoFromVectorDB = "";
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vectors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (result.ok) {
        const data = (await result.json()).data as Array<{
          _id: string;
          text: string;
        }> | null;
        infoFromVectorDB = (data ?? []).map((item) => item.text).join("#");
      } else {
        console.log(
          "Vector search request failed, continuing without RAG context:",
          result.status,
        );
      }
    } catch (err) {
      console.log(
        "Vector search request errored, continuing without RAG context:",
        err,
      );
    }

    const response = await pts.stream(
      ctx,
      request,
      streamId as StreamId,
      async (ctx, req, id, append) => {
        await streamOpenRouterChat({
          systemPrompt: siteAssistantSystemPrompt,
          userPrompt: infoFromVectorDB
            ? `Live listings/store info from the database: ${infoFromVectorDB}\n\nUser question: ${prompt}`
            : prompt,
          history,
          append,
        });
      },
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...cors(request),
        ...response.headers,
      },
    });
  } catch (err) {
    console.log(err);
    return new Response("Error", {
      headers: cors(request),
      status: 500,
    });
  }
});
