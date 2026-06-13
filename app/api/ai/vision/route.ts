import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Find the system prompt and the image string from the body
    let systemPrompt = "";
    let base64Image = "";
    let userPrompt = "Analyze this face image and return JSON.";

    if (Array.isArray(body.messages)) {
      for (const msg of body.messages) {
        if (msg.role === "system") {
          systemPrompt = msg.content;
        } else if (msg.role === "user" && Array.isArray(msg.content)) {
          const textObj = msg.content.find((c: any) => c.type === "text");
          const imgObj = msg.content.find((c: any) => c.type === "image_url");
          if (textObj) userPrompt = textObj.text;
          if (imgObj?.image_url?.url) {
            // Split out the data URI metadata prefix if present
            const urlString = imgObj.image_url.url;
            base64Image = urlString.includes(",") ? urlString.split(",")[1] : urlString;
          }
        }
      }
    }

    // Fire a structured request payload straight to your worker endpoint
    // Make sure this URL points to the deployment running your worker code!
    const workerResponse = await fetch("https://llama-3-worker.vivaancut.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        image: base64Image
      }),
    });

    if (!workerResponse.ok) {
      const workerError = await workerResponse.text();
      return NextResponse.json(
        { error: "Worker error", message: workerError },
        { status: workerResponse.status }
      );
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Next.js Vision Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}