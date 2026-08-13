// CORS helpers shared by every Convex httpAction. Kept in their own module
// (rather than living in http.ts, which registers all the routes) so that
// route handler files like chat.ts and siteAssistant.ts can import them
// without creating a circular import back into http.ts.

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://flickmart.app",
  "https://flickmart-demo.vercel.app",
  "https://strong-turtle-928.convex.site", // Add your Convex domain
];

export function getCorsHeaders(origin?: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });
}

export function cors(request: Request) {
  const origin = request.headers.get("origin");

  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function getJsonHeaders(origin?: string | null) {
  const corsHeaders = getCorsHeaders(origin);
  corsHeaders.set("Content-Type", "application/json");
  return corsHeaders;
}
