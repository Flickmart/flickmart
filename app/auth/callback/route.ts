import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    console.log("Testing this state")

    if (user && user.email) {
      // Check if user already exists in our database
      const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      console.log("Checking if this function even runs")

      if (!existingUser.length) {
        // Create new user in our database
        console.log("User dosent exist adding to db...")
        await db.insert(users).values({
          email: user.email,
          name: user.user_metadata.full_name,
          profileImage: user.user_metadata.avatar_url
        });
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
