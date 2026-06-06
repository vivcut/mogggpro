import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    // Get the authenticated user from the server-side session
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's DB ID (not auth ID, the row ID in our users table)
    const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

    if (dbError || !dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Guard: ensure the product ID env var is set
    const productId = process.env.POLAR_PRODUCTID;
    if (!productId) {
        console.error("POLAR_PRODUCTID environment variable is not set");
        return NextResponse.json({ error: "Server misconfiguration: missing product ID" }, { status: 500 });
    }

    const requestBody = {
        products: [productId],
        metadata: {
            userId: dbUser.id,
        },
        // Pre-fill the email for convenience (but we won't use it in the webhook)
        customer_email: session.user.email,
    };

    console.log("Polar checkout request body:", JSON.stringify(requestBody));

    // Create a Polar checkout session with userId as metadata
    const response = await fetch("https://api.polar.sh/v1/checkouts/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.POLAR_APP_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Polar checkout error:", err);
        return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    const checkout = await response.json();
    return NextResponse.json({ url: checkout.url });
}
