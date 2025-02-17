import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // {
    //   auth: {
    //     persistSession: true, // Ensures session is stored
    //     autoRefreshToken: true, // Automatically refreshes tokens
    //     detectSessionInUrl: true, // Detects OAuth callbacks
    //   },
    // }
  );
