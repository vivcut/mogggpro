import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
    metadataBase: new URL("https://moggg.pro"),
    title: {
        default: "Moggg – AI Looksmaxxing Tools",
        template: "%s | Moggg",
    },
    description:
        "Moggg is the #1 AI looksmaxxing platform. Get your face rated, analyze your PSL score, measure your height potential, train your rizz, and get personalized improvement tips.",
    keywords: [
        "looksmaxxing",
        "looksmax",
        "face rating",
        "PSL scale",
        "PSL score",
        "face analyzer",
        "face analysis AI",
        "height calculator",
        "rizz coach",
        "rizz training",
        "glow up",
        "facial aesthetics",
        "AI face rating",
        "how to lookmax",
        "improve looks",
        "jawline",
        "cheekbones",
        "skin quality",
        "chad",
        "giga chad",
        "HTN",
        "looksmaxxing app",
        "facial harmony",
        "attractiveness score",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://moggg.pro",
        siteName: "Moggg",
        title: "Moggg – AI Looksmaxxing Tools",
        description:
            "Get your face rated by AI, check your PSL score, calculate height potential, and train your rizz. The ultimate looksmaxxing toolkit.",
        images: [
            {
                url: "/landing.png",
                width: 1200,
                height: 630,
                alt: "Moggg – AI Looksmaxxing Tools",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Moggg – AI Looksmaxxing Tools",
        description:
            "Get your face rated by AI, check your PSL score, calculate height potential, and train your rizz.",
        images: ["/landing.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://moggg.pro",
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180" },
        ],
        shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-[#070708]">
                <Providers>{children}</Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
