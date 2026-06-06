"use client";

import { useContext, useEffect } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { supabase } from "@/supabase";
import { UserContext } from "@/app/rootprovider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginWrapper({
    children,
}: Readonly<{
    children: any;
}>) {
    const { user } = useContext<any>(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.prefetch("/dashboard");
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // Points to our server-side Route Handler which exchanges the
                // PKCE code and sets session cookies before redirecting to /dashboard.
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
    };

    return (
        <>
            {user ? (
                <Link href="/dashboard">{children}</Link>
            ) : (
                <Dialog>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="flex flex-row p-0 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] sm:h-[80vh]">
                        <div className="flex-1 flex flex-col p-8 sm:p-12 space-y-6 sm:space-y-10 overflow-y-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="min-w-10 min-h-10" width="40" height="40" fill="white" viewBox="0 0 256 256"><path d="M184,168v16a8,8,0,0,1-16,0V168a40,40,0,0,0-80,0v16a8,8,0,0,1-16,0V168a56,56,0,0,1,112,0ZM128,80a88.1,88.1,0,0,0-88,88v16a8,8,0,0,0,16,0V168a72,72,0,0,1,144,0v16a8,8,0,0,0,16,0V168A88.1,88.1,0,0,0,128,80Zm0-32A120.13,120.13,0,0,0,8,168v16a8,8,0,0,0,16,0V168a104,104,0,0,1,208,0v16a8,8,0,0,0,16,0V168A120.13,120.13,0,0,0,128,48Z"></path></svg>
                            <DialogTitle className="text-2xl sm:text-4xl tracking-tighter font-bold">Average to Extraordinary.</DialogTitle>
                            <p className="text-xl font-[500] text-muted-foreground">Log in to Continue</p>
                            <Button
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-2 mb-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="0 0 256 256"><path d="M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z"></path></svg>
                                Continue with Google
                            </Button>
                            <p className="text-muted-foreground text-xs mt-8 text-center">
                                By using Moggg you agree to our{" "}
                                <span className="text-white/80">Terms of Service</span> and{" "}
                                <span className="text-white/80">Privacy Policy</span>
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
