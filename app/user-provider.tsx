"use client";

import { createClientCall } from "@/supabase";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "./rootprovider";

export default function UserProvider() {
    const { user, setUser } = useContext<any>(UserContext);
    const supabase = createClientCall();
    const handlingRef = useRef(false);

    useEffect(() => {
        const handleUser = async (authUser: any) => {
            if (!authUser?.email) return;
            // Prevent duplicate concurrent calls (race between getUser + onAuthStateChange)
            if (handlingRef.current) return;
            handlingRef.current = true;

            try {
                const email = authUser.email;

                // Upsert: insert if not exists, do nothing on conflict (email unique)
                await supabase
                    .from("users")
                    .upsert(
                        [{
                            email,
                            name:
                                authUser.user_metadata?.full_name ||
                                authUser.user_metadata?.name ||
                                null,
                            image:
                                authUser.user_metadata?.avatar_url ||
                                authUser.user_metadata?.picture ||
                                null,
                            subscription: false,
                        }],
                        { onConflict: "email", ignoreDuplicates: true }
                    );

                // Always fetch the authoritative row after upsert
                const { data: dbUser, error: fetchError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", email)
                    .single();

                if (fetchError) {
                    console.error("Error fetching user:", fetchError);
                } else {
                    setUser(dbUser);
                }
            } finally {
                handlingRef.current = false;
            }
        };

        // Check current user on mount using getUser() (secure, contacts Auth server)
        supabase.auth.getUser().then(({ data: { user: authUser } }) => {
            if (authUser) {
                handleUser(authUser);
            }
        });

        // Listen for auth state changes (sign in / sign out)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                handleUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
}
