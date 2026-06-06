import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.redirect(new URL("/dashboard/sub", request.url));
    }

    // Get the user's Polar customer ID from DB
    const { data: dbUser, error } = await supabase
        .from("users")
        .select("polar_customer_id")
        .eq("email", session.user.email)
        .single();

    if (error || !dbUser?.polar_customer_id) {
        return NextResponse.redirect(new URL("/dashboard/sub?error=no_customer", request.url));
    }

    // Call Polar REST API to create a customer session
    const res = await fetch("https://api.polar.sh/v1/customer-sessions/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.POLAR_APP_TOKEN}`,
        },
        body: JSON.stringify({ customer_id: dbUser.polar_customer_id }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("Polar customer session error:", err);
        return NextResponse.redirect(new URL("/dashboard/sub?error=portal_failed", request.url));
    }

    const { customer_portal_url } = await res.json();
    return NextResponse.redirect(customer_portal_url);
}
