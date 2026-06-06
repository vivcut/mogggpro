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
        // Use the userId we injected as metadata at checkout time.
        // This avoids any email mismatch issues.
        const userId = payload.data.metadata?.userId as string | undefined;
        // Store the Polar customer ID so we can open the billing portal later
        const polarCustomerId = (payload.data as any).customerId as string | undefined;

        if (!userId) {
            console.error("Polar webhook: no userId in metadata", payload.data);
            return;
        }

        const { error } = await supabaseAdmin
            .from("users")
            .update({
                subscription: true,
                ...(polarCustomerId ? { polar_customer_id: polarCustomerId } : {}),
            })
            .eq("id", userId);

        if (error) {
            console.error("Polar webhook: failed to update subscription:", error.message);
        } else {
            console.log("Polar webhook: subscription activated for user", userId);
        }
    },
});
