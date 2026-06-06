import { NextRequest, NextResponse } from "next/server";

// Proxies text AI requests to Cloudflare Workers AI REST API.
// Requires env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
export async function POST(request: NextRequest) {
    const { messages } = await request.json();

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        return NextResponse.json(
            { error: "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN" },
            { status: 500 }
        );
    }

    const model = "@cf/meta/llama-3.1-8b-instruct";

    const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({ messages }),
        }
    );

    if (!cfRes.ok) {
        const err = await cfRes.text();
        console.error("Cloudflare AI text error:", err);
        return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await cfRes.json();
    // Cloudflare AI returns: { result: { response: "..." }, success: true, ... }
    // Match legacy worker response shape: { response: { response: "..." } }
    return NextResponse.json({ response: { response: data.result?.response ?? "" } });
}
