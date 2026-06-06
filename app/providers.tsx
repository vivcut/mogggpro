"use client";

import { Toaster } from "@/components/ui/sonner";
import { UserProvider as UserProviderTwo } from "./rootprovider";
import UserProvider from "./user-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Analytics />
            <SpeedInsights />
            <Toaster />
            <UserProviderTwo>
                <UserProvider />
                {children as any}
            </UserProviderTwo>
        </>
    );
}
