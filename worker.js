/**
 * Mogg AI Worker — Deploy to Cloudflare Workers
 *
 * Text model:   @cf/meta/llama-3.1-8b-instruct
 * Vision model: @cf/moonshotai/kimi-k2.6  (multimodal, supports image_url in messages)
 *
 * The worker auto-detects whether the request contains image content and
 * routes to the appropriate model.
 *
 * Request body (POST):
 *   { messages: [ { role: "system"|"user"|"assistant", content: string | array } ] }
 *
 * Vision example:
 *   {
 *     messages: [
 *       { role: "system", content: "You are a helpful assistant." },
 *       {
 *         role: "user",
 *         content: [
 *           { type: "text", text: "Analyze this image" },
 *           { type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }
 *         ]
 *       }
 *     ]
 *   }
 *
 * Response body:
 *   { response: "ai text here" }
 */

const TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function hasImageContent(messages) {
  return messages.some(
    (m) =>
      Array.isArray(m.content) &&
      m.content.some((c) => c.type === "image_url")
  );
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      const body = await request.json();
      const messages = body.messages;
      const response_format = body.response_format; // e.g. { type: "json_object" }

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(
          JSON.stringify({ error: "Missing or empty messages array" }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      let response;

      if (hasImageContent(messages)) {
        // Vision request — extract image bytes and build prompt for CF vision model
        const userMsg = messages.find(
          (m) => m.role === "user" && Array.isArray(m.content)
        );
        const systemMsg = messages.find((m) => m.role === "system");

        const textContent =
          userMsg?.content?.find((c) => c.type === "text")?.text ?? "";
        const imageUrl =
          userMsg?.content?.find((c) => c.type === "image_url")?.image_url?.url ?? "";
        const systemPrompt = systemMsg?.content ?? "";

        // Combine system + user text into a single prompt
        const prompt = systemPrompt ? `${systemPrompt}\n\n${textContent}` : textContent;

        // Decode base64 image to byte array (required by CF vision models)
        let imageBytes;
        if (imageUrl.startsWith("data:")) {
          const base64 = imageUrl.split(",")[1];
          imageBytes = Array.from(
            Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
          );
        }

        const result = await env.AI.run(VISION_MODEL, {
          prompt,
          image: imageBytes,
          max_tokens: 1024,
        });

        console.log("Vision result keys:", JSON.stringify(Object.keys(result || {})));

        // CF vision models return response in different fields depending on model version
        response =
          result?.response ||
          result?.description ||
          result?.choices?.[0]?.message?.content ||
          "";
      } else {
        // Plain text request — optionally enable JSON mode
        const runOptions = {
          messages,
          max_tokens: 1024,
        };
        if (response_format) {
          runOptions.response_format = response_format;
        }
        const result = await env.AI.run(TEXT_MODEL, runOptions);
        response = result?.response ?? "";
      }

      return new Response(JSON.stringify({ response }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null
          ? JSON.stringify(error)
          : String(error);

      console.error("Worker error:", message);

      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
  },
};
