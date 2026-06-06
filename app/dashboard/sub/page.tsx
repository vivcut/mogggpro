"use client";

import { UserContext } from "@/app/rootprovider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useState } from "react";

async function startCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" });
    if (!res.ok) {
        console.error("Checkout error:", await res.text());
        return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
}

export default function Page() {
    const { user } = useContext<any>(UserContext);
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        setLoading(true);
        await startCheckout();
        setLoading(false);
    };

    return (
        <div className="flex flex-col space-y-5">
            <h1 className="text-2xl font-[500]">Subscription</h1>

            <p className="text-muted-foreground">
                Subscription Status:{" "}
                <span className="text-white">
                    {user?.subscription ? "Active" : "No Subscription"}
                </span>
            </p>

            {!user?.subscription && (
                <Card>
                    <CardContent className="flex flex-col space-y-4">
                        <h1 className="text-xl">Moggg Monthly Subscription</h1>
                        <div className="flex space-x-3">
                            <p>Redeem access to all features</p>
                            <p className="text-muted-foreground">$10 per Month</p>
                        </div>
                        <Button
                            onClick={handlePurchase}
                            disabled={loading}
                            variant="outline"
                            className="w-fit h-12 w-40 not-sm:w-full"
                        >
                            {loading ? "Loading..." : "Purchase"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
