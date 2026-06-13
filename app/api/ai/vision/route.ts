import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let systemPrompt = "";
    let base64String = "";
    let userPrompt = "Analyze this face composite and output raw JSON schema structure.";

    // 1. Extract the text prompts and the image string from your frontend's payload
    if (Array.isArray(body.messages)) {
      for (const msg of body.messages) {
        if (msg.role === "system") {
          systemPrompt = msg.content;
        } else if (msg.role === "user") {
          if (Array.isArray(msg.content)) {
            const textObj = msg.content.find((c: any) => c.type === "text");
            const imgObj = msg.content.find((c: any) => c.type === "image_url");
            if (textObj) userPrompt = textObj.text;
            if (imgObj?.image_url?.url) {
              const url = imgObj.image_url.url;
              base64String = url.includes(",") ? url.split(",")[1] : url;
            }
          } else if (typeof msg.content === "string") {
            userPrompt = msg.content;
          }
        }
      }
    }

    if (!base64String) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    // 2. Convert base64 into a clean Uint8Array, then to a standard number array
    const binaryBuffer = Buffer.from(base64String, "base64");
    const imageArray = Array.from(binaryBuffer);

    // 3. Send the structured data natively to your worker
    const workerResponse = await fetch("https://llama-3-worker.vivaancut.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        image: imageArray, // This is now a pristine numerical sequence [255, 216, 255, ...]
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