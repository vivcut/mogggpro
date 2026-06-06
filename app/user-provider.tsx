"use client";

import { createClientCall } from "@/supabase";
import { useContext, useEffect } from "react";
import { UserContext } from "./rootprovider";

export default function UserProvider() {
    const { user, setUser } = useContext<any>(UserContext);
    const supabase = createClientCall();

    useEffect(() => {
        const handleUser = async (authUser: any) => {
            if (!authUser?.email) return;

            const email = authUser.email;

            // Check if user exists in DB
            const { data: users, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email);

            if (error) {
                console.error("Error checking user:", error);
                return;
            }

            if (users && users.length > 0) {
                // User exists, set user
                console.log("User exists");
                setUser(users[0]);
            } else {
                // Create new user
                const { data: newUser, error: insertError } = await supabase
                    .from("users")
                    .insert([
                        {
                            email: email,
                            name:
                                authUser.user_metadata?.full_name ||
                                authUser.user_metadata?.name ||
                                null,
                            image:
                                authUser.user_metadata?.avatar_url ||
                                authUser.user_metadata?.picture ||
                                null,
                            subscription: false,
                        },
                    ])
                    .select()
                    .single();

                if (insertError) {
                    console.error("Error creating user:", insertError);
                } else {
                    console.log("Created new user");
                    setUser(newUser);
                }
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
