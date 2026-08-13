// Ordered list of OpenRouter free-tier chat models. Tried in order; on
// rate-limit/error/stall we fall back to the next one. OpenRouter's free
// roster rotates over time, so this list is meant to be edited directly
// rather than treated as a fixed constant -- verified live against
// https://openrouter.ai/api/v1/models on 2026-08-13, with real streaming
// latency spot-checked at the same time. General-purpose
// instruction-following models only (narrow-purpose free models like
// content-safety classifiers or vision/coding-agent specialists are
// deliberately excluded). Ordered by observed responsiveness rather than
// raw size: the two largest MoE models (550B/120B) measured as slow or
// outright stalled under free-tier load at verification time, so they're
// placed last as a long-shot rather than first -- the per-model stall
// timeout below means trying them still costs at most a few seconds.
export const OPENROUTER_MODELS: string[] = [
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-20b:free",
  "liquid/lfm-2.5-2.6b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
];

// If a model produces no data (not even response headers, and no stream
// chunk) within this window, we abort it and move to the next model. Reset
// on every chunk received, so a slow-but-steady stream isn't killed -- only
// a genuinely stalled one is. Free-tier models can otherwise hang far
// longer than this (observed: multi-minute stalls with zero bytes on an
// overloaded free model), which defeats the point of falling back quickly.
const MODEL_STALL_TIMEOUT_MS = 12_000;

type ChunkAppender = (text: string) => Promise<void>;

export type ChatTurn = { role: "user" | "assistant"; content: string };

/**
 * Streams a chat completion from OpenRouter, trying each model in `models`
 * in order. Falls back to the next model if it fails, stalls, or completes
 * with no visible content (429 / 5xx / non-2xx / network error / no data
 * within MODEL_STALL_TIMEOUT_MS / a "successful" response that never sent
 * any content). Once a model has started producing output, a later failure
 * is rethrown instead of retried, to avoid duplicating or garbling output
 * that's already reached the user.
 */
export async function streamOpenRouterChat({
  systemPrompt,
  userPrompt,
  history = [],
  append,
  models = OPENROUTER_MODELS,
}: {
  systemPrompt: string;
  userPrompt: string;
  history?: ChatTurn[];
  append: ChunkAppender;
  models?: string[];
}): Promise<{ modelUsed: string }> {
  let lastError: unknown;

  for (const model of models) {
    let firstChunkSent = false;
    const controller = new AbortController();
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    const resetStallTimer = () => {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(() => controller.abort(), MODEL_STALL_TIMEOUT_MS);
    };

    try {
      resetStallTimer();
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://flickmart.app",
          "X-Title": "Flickmart",
        },
        body: JSON.stringify({
          model,
          stream: true,
          // Some free models are "reasoning" models that emit a hidden
          // chain-of-thought (in `delta.reasoning`, which we ignore) before
          // any real `delta.content`. Without headroom here, a low default
          // max_tokens can let a model burn its whole budget on reasoning
          // and finish with zero actual content -- observed live during
          // testing. This doesn't fully prevent that, so it's paired with
          // the empty-completion fallback below.
          max_tokens: 1024,
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        clearTimeout(stallTimer);
        lastError = new Error(
          `OpenRouter model ${model} responded with status ${res.status}`,
        );
        continue;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        resetStallTimer();
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) {
            continue;
          }
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") {
            continue;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              firstChunkSent = true;
              await append(delta);
            }
          } catch {
            // Ignore malformed/partial SSE lines; the next chunk will
            // usually complete the buffered JSON.
          }
        }
      }

      clearTimeout(stallTimer);

      if (!firstChunkSent) {
        // The model responded successfully but produced no visible content
        // (e.g. it spent its whole token budget on hidden reasoning). Try
        // the next model instead of silently returning nothing.
        lastError = new Error(
          `OpenRouter model ${model} completed with no content`,
        );
        continue;
      }

      return { modelUsed: model };
    } catch (err) {
      clearTimeout(stallTimer);
      if (firstChunkSent) {
        throw err;
      }
      lastError = err;
    }
  }

  throw new Error(
    `All OpenRouter models failed. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
