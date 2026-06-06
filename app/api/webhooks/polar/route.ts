// api/webhooks/polar/route.ts
import { createClient } from "@supabase/supabase-js";
import { Webhooks } from "@polar-sh/nextjs";

// Use the service role key server-side so we can update any user row
// regardless of RLS policies (this is safe — this is a server-only webhook).
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onOrderPaid: async (payload) => {
        const userId = payload.data.metadata?.userId as string | undefined;
        const polarCustomerId = (payload.data as any).customer_id as string | undefined;

        if (!userId) {
            console.error("Polar webhook: no userId in metadata", payload.data);
            return;
        }

        // Always update subscription — this must succeed
        const { error } = await supabaseAdmin
            .from("users")
            .update({ subscription: true })
            .eq("id", userId);

        if (error) {
            console.error("Polar webhook: failed to update subscription:", error.message);
        } else {
            console.log("Polar webhook: subscription activated for user", userId);
        }

        // Try to save polar_customer_id separately — failure here doesn't affect subscription
        if (polarCustomerId) {
            const { error: customerIdError } = await supabaseAdmin
                .from("users")
                .update({ polar_customer_id: polarCustomerId })
                .eq("id", userId);

            if (customerIdError) {
                // Non-fatal: column may not exist yet
                console.warn("Polar webhook: could not save polar_customer_id:", customerIdError.message);
            }
        }
    },
});
