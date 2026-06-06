import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // In production on Vercel, use x-forwarded-host to get the real public hostname
      const forwardedHost = request.headers.get("x-forwarded-host");
      const protocol = request.headers.get("x-forwarded-proto") ?? "https";
      const baseUrl = forwardedHost ? `${protocol}://${forwardedHost}` : origin;
      return NextResponse.redirect(`${baseUrl}/dashboard`);
    }
    console.error("Auth callback error:", error);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  const baseUrl = forwardedHost ? `${protocol}://${forwardedHost}` : origin;
  return NextResponse.redirect(`${baseUrl}/?error=auth`);
}
