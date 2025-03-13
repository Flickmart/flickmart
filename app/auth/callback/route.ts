import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (user && user.email) {
        try {
          const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
          
          if (!existingUser.length) {
            await db.insert(users).values({
              email: user.email,
              name: user.user_metadata.full_name,
              profileImage: user.user_metadata.avatar_url
            });
            console.log("User successfully added to database");
          } else {
            console.log("User already exists in database");
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }
      }
    }

    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    return NextResponse.redirect(`${origin}/protected`);
  } catch (error) {
    console.error("Callback error:", error);
    // Still redirect to protected to avoid leaving user stranded, but you might want to handle this differently
    return NextResponse.redirect(`${origin}/protected`);
  }
}
