"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./button";
import Link from "next/link";
import LoginWrapper from "./login";
import { UserContext } from "@/app/rootprovider";
import { Rainbow } from "lucide-react";


export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, setUser } = useContext<any>(UserContext);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 1);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user])






    return (
      <>
        {/* Invisible prefetch links — next.js will fetch these JS chunks immediately */}
        <div className="sr-only" aria-hidden>
            <Link href="/blog" prefetch>blog</Link>
            <Link href="/face-analyzer" prefetch>face</Link>
            <Link href="/height-calculator" prefetch>height</Link>
            <Link href="/rizz-coach" prefetch>rizz</Link>
            <Link href="/dashboard" prefetch>dashboard</Link>
        </div>
        <nav className={`fixed top-0 z-[30] left-0 right-0 justify-between px-16 pt-4 items-center transition-all duration-300 not-sm:!px-2 ${isScrolled && "!px-36 not-sm:!px-2 !pt-2"}`}>
            <div className={`flex items-center w-full space-x-3 justify-between py-2 rounded-full px-2 pl-4.5 transition duration-200 ease-in-out ${isScrolled ? 'bg-white/10 backdrop-blur-md border border-border shadow-xs' : 'bg-transparent'}`}>


                <Link href={"/"}>
                    <div className="flex cursor-pointer items-center space-x-1.5 select-none">
                        <Rainbow className="size-7"/>
                        <h1 className={`text-xl font-[500] transition-opacity duration-200 ease-in-out ${isScrolled && "opacity-0"}`}>Moggg</h1>

                    </div></Link>
                <section className="flex items-center space-x-3 not-lg:sr-only">
                    <Link href={"/blog"}>
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Blog
                        </Button>
                    </Link>
                    <Link href={"/face-analyzer"}>
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Face
                        </Button>
                    </Link>
                    <Link href={"/height-calculator"}>
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Height
                        </Button>
                    </Link>
                    <Link href={"/rizz-coach"}>
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Rizz
                        </Button>
                    </Link>
                    <a href="#pricing">
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Pricing
                        </Button>
                    </a>
                    <a href="mailto:thewinnersface@gmail.com">
                        <Button className="text-white hover:bg-white/5" variant={"ghost"}>
                            Support
                        </Button>
                    </a>
                </section>
                <LoginWrapper>
                    <Button variant={"default"}>
                        {user ? "Dashboard" : "Sign In"}
                    </Button>
                </LoginWrapper>
            </div>
        </nav>
      </>
    );
}
