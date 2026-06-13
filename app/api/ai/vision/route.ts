import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Make sure we pass the clean array data down
    const workerResponse = await fetch("https://llama-3-worker.vivaancut.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: body.messages
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