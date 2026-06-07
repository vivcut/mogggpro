"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { supabase } from "@/supabase";
import { UserContext } from "@/app/rootprovider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginWrapper({
    children,
    href = "/dashboard",
}: Readonly<{
    children: any;
    href?: string;
}>) {
    const { user } = useContext<any>(UserContext);
    const router = useRouter();
    const [view, setView] = useState<"main" | "email">("main");
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            router.prefetch(href);
        }
    }, [user, href]);

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
    };

    const handleDiscordSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
    };

    const handleMagicLink = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        const { error: err } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
        setLoading(false);
        if (err) {
            setError(err.message);
        } else {
            setEmailSent(true);
        }
    };

    const handleBack = () => {
        setView("main");
        setEmail("");
        setError("");
        setEmailSent(false);
    };

    return (
        <>
            {user ? (
                <Link href={href}>{children}</Link>
            ) : (
                <Dialog onOpenChange={(open) => { if (!open) { setView("main"); setEmail(""); setError(""); setEmailSent(false); } }}>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="flex flex-row p-0 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] sm:h-[80vh]">
                        <DialogTitle className="sr-only">Sign in to Moggg</DialogTitle>
                        <div className="flex-1 flex flex-col p-8 sm:p-12 space-y-6 sm:space-y-8 overflow-y-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="min-w-10 min-h-10" width="40" height="40" fill="white" viewBox="0 0 256 256"><path d="M184,168v16a8,8,0,0,1-16,0V168a40,40,0,0,0-80,0v16a8,8,0,0,1-16,0V168a56,56,0,0,1,112,0ZM128,80a88.1,88.1,0,0,0-88,88v16a8,8,0,0,0,16,0V168a72,72,0,0,1,144,0v16a8,8,0,0,0,16,0V168A88.1,88.1,0,0,0,128,80Zm0-32A120.13,120.13,0,0,0,8,168v16a8,8,0,0,0,16,0V168a104,104,0,0,1,208,0v16a8,8,0,0,0,16,0V168A120.13,120.13,0,0,0,128,48Z"></path></svg>
                            <DialogTitle className="text-2xl sm:text-4xl tracking-tighter font-bold">Average to Extraordinary.</DialogTitle>

                            {view === "main" ? (
                                <>
                                    <p className="text-xl font-[500] text-muted-foreground">Log in to Continue</p>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            onClick={handleGoogleSignIn}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="0 0 256 256"><path d="M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z"></path></svg>
                                            Continue with Google
                                        </Button>
                                        <Button
                                            onClick={handleDiscordSignIn}
                                            className="w-full flex items-center justify-center gap-2"
                                            style={{ backgroundColor: "#5865F2", color: "white" }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 127.14 96.36" fill="white">
                                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                            </svg>
                                            Continue with Discord
                                        </Button>
                                        <Button
                                            onClick={() => setView("email")}
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.19V181.81Z"></path></svg>
                                            Sign in with Email
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleBack}
                                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors w-fit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                                        Back
                                    </button>
                                    <p className="text-xl font-[500] text-muted-foreground">Enter your email</p>

                                    {emailSent ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center text-sm text-muted-foreground">
                                                ✅ Magic link sent! Check your inbox and click the link to sign in.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                                                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/30"
                                            />
                                            {error && <p className="text-xs text-red-400">{error}</p>}
                                            <Button
                                                onClick={handleMagicLink}
                                                disabled={loading}
                                                className="w-full"
                                            >
                                                {loading ? "Sending..." : "Send Link"}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}

                            <p className="text-muted-foreground text-xs text-center">
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
