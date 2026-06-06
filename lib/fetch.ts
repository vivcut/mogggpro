import axios from "axios";
import { toast } from "sonner";

// Single worker that handles both text and vision (image_url)
const WORKER_URL = "https://llama-3-worker.vivaancut.workers.dev/";

export const fetchAI = async (
    list: any,
    format?: any,
    send?: any
): Promise<string> => {
    try {
        const res = await axios.post(WORKER_URL, {
            messages: list,
        });
        // Worker returns: { response: "..." }
        const aiResponse = res?.data?.response;
        if (aiResponse) {
            return aiResponse;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI", res?.data);
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};

// Sends request with response_format: { type: "json_object" } and returns parsed object.
// The model MUST be told to respond with JSON in the system prompt.
export const fetchAIJson = async <T = any>(
    list: any,
): Promise<T | null> => {
    try {
        const res = await axios.post(WORKER_URL, {
            messages: list,
            response_format: { type: "json_object" },
        });
        const raw: string = res?.data?.response;
        if (!raw) {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI (json mode)", res?.data);
            return null;
        }
        // The model returns a JSON string — parse it directly (no markdown stripping needed)
        return JSON.parse(raw) as T;
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("fetchAIJson error", err);
        return null;
    }
};

export const fetchAIFull = async (
    list: any,
    format?: any,
    send?: any
) => {
    try {
        const res = await axios.post(WORKER_URL, {
            messages: list,
        });
        // Worker returns: { response: "...", usage: {...} }
        const aiResponse = res?.data?.response;
        if (aiResponse) {
            return res?.data;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI", res?.data);
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};

export const fetchAIImage = async (
    list: any
): Promise<string> => {
    try {
        const res = await axios.post(WORKER_URL, {
            messages: list,
        });
        // Worker returns: { response: "..." }
        const aiResponse = res?.data?.response;
        if (aiResponse) {
            return aiResponse;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI", res?.data);
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};
