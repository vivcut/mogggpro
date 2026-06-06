import { createBrowserClient } from "@supabase/ssr";

// Uses @supabase/ssr which stores the session in cookies (not localStorage),
// allowing the server-side API route handler to read/write auth state.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function createClientCall() {
  return supabase;
}
