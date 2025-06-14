import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware();

export function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization");

  const USER = process.env.USER;
  const PASS = process.env.PASS;

  const validAuth =
    "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

  if (auth === validAuth) {
    return NextResponse.next();
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
