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

    // Get the user's DB ID
    const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

    if (dbError || !dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const productId = process.env.POLAR_PRODUCTID;
    if (!productId) {
        console.error("POLAR_PRODUCTID environment variable is not set");
        return NextResponse.json({ error: "Server misconfiguration: missing product ID" }, { status: 500 });
    }

    // Determine the public base URL for the success redirect
    const forwardedHost = request.headers.get("x-forwarded-host");
    const protocol = request.headers.get("x-forwarded-proto") ?? "https";
    const baseUrl = forwardedHost ? `${protocol}://${forwardedHost}` : `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const requestBody = {
        product_id: productId,
        metadata: {
            userId: dbUser.id,
        },
        customer_email: session.user.email,
        success_url: `${baseUrl}/dashboard/sub?success=1`,
    };

    console.log("Polar checkout request body:", JSON.stringify(requestBody));

    // Create a Polar checkout session
    const response = await fetch("https://api.polar.sh/v1/checkouts/custom/", {
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
