"use client";

import { Button } from "./button";
import LoginWrapper from "./login";

interface LoginCTAButtonProps {
    label?: string;
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
}

export default function LoginCTAButton({
    label = "Get Started Free →",
    size = "lg",
    className = "rounded-full px-10 h-12",
    variant = "default",
}: LoginCTAButtonProps) {
    return (
        <LoginWrapper>
            <Button size={size} className={className} variant={variant}>
                {label}
            </Button>
        </LoginWrapper>
    );
}
