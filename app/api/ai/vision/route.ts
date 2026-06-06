import { NextRequest, NextResponse } from "next/server";

// Proxies vision AI requests to Cloudflare Workers AI REST API.
// Requires env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
// Model: @cf/meta/llama-3.2-11b-vision-instruct (supports image_url in messages)
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

    const model = "@cf/moonshotai/kimi-k2.6";

    const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({ messages, max_tokens: 4096 }),
        }
    );

    if (!cfRes.ok) {
        const err = await cfRes.text();
        console.error("Cloudflare AI vision error:", err);
        return NextResponse.json({ error: "AI vision request failed", detail: err }, { status: 500 });
    }

    const data = await cfRes.json();
    console.log("[vision route] CF result:", JSON.stringify(data?.result));

    // Kimi K2.6 uses OpenAI chat completions format: result.choices[0].message.content
    // Other CF models use: result.response
    const response =
        data?.result?.choices?.[0]?.message?.content ??
        data?.result?.response ??
        "";
    return NextResponse.json({ response });
}
