import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import PublicFooter from "@/components/ui/public-footer";
import LoginCTAButton from "@/components/ui/login-cta-button";

export const metadata: Metadata = {
    title: "Face Analyzer – AI Face Rating & PSL Score",
    description:
        "Get your face analyzed by AI. Receive a PSL score, attractiveness rating, jawline score, and personalized looksmaxxing tips. Free AI face analyzer tool.",
    keywords: ["face analyzer", "face rating", "PSL score", "AI face rating", "attractiveness score", "looksmaxxing face", "face analysis", "jawline score", "facial harmony"],
    alternates: { canonical: "https://moggg.pro/face-analyzer" },
    openGraph: {
        title: "Face Analyzer – AI Face Rating & PSL Score | Moggg",
        description: "Upload your photo and get a detailed AI face rating with PSL score, jawline analysis, and improvement tips.",
        url: "https://moggg.pro/face-analyzer",
    },
};

export default function FaceAnalyzerPage() {
    return (
        <div className="w-screen min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero */}
            <section className="w-full relative overflow-hidden flex flex-col justify-center items-center px-4 pt-40 pb-24 text-center rounded-b-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 w-full h-full bg-[url('/hero3.jpg')] bg-cover bg-center" />
                <div className="relative z-20 max-w-3xl space-y-6">
                    <span className="text-xs uppercase tracking-widest text-white/50 block">Looksmaxxing Tool</span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/75">
                        AI Face Analyzer
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Upload your front and side photos. Our AI analyzes your facial structure, gives you a PSL score out of 8,
                        rates your jawline, cheekbones, eyes, and tells you exactly what to improve.
                    </p>
                    <div className="flex justify-center pt-2">
                        <LoginCTAButton label="Analyze My Face Free →" size="lg" className="px-8 py-6 text-lg" />
                    </div>
                </div>
            </section>

            {/* Screenshots */}
            <section className="py-20 px-4 flex flex-col items-center justify-center gap-6">
                <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
                    <img src="/face1.png" alt="Face Analysis Example 1" className="w-full h-auto rounded-2xl object-contain" />
                </div>
                <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
                    <img src="/face2.png" alt="Face Analysis Example 2" className="w-full h-auto rounded-2xl object-contain" />
                </div>
                <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
                    <img src="/face3.png" alt="Face Analysis Example 3" className="w-full h-auto rounded-2xl object-contain" />
                </div>
            </section>

            {/* PSL Tiers */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">What Is the PSL Scale?</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        The PSL (Looks Scale) is the standard rating system used in looksmaxxing communities to objectively score facial attractiveness from 1 to 8.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { tier: "Subhuman", range: "1.0–2.0", color: "#ef4444" },
                        { tier: "Sub-Average", range: "2.0–3.0", color: "#f87171" },
                        { tier: "LTN (Low-Tier Normie)", range: "3.0–4.0", color: "#fb923c" },
                        { tier: "MTN (Mid-Tier Normie)", range: "4.0–5.0", color: "#fdfd96" },
                        { tier: "HTN (High-Tier Normie)", range: "5.0–6.0", color: "#fde68a" },
                        { tier: "Chadlite", range: "6.0–6.5", color: "#6ee7b7" },
                        { tier: "Chad", range: "6.5–7.0", color: "#34d399" },
                        { tier: "Giga Chad", range: "7.0–7.75", color: "#34d399" },
                        { tier: "True Adam / Tera Chad", range: "7.75–8.0", color: "#a78bfa" },
                    ].map((t) => (
                        <div key={t.tier} className="rounded-3xl bg-[#171719] border border-border p-4 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            <div>
                                <p className="font-medium text-sm">{t.tier}</p>
                                <p className="text-muted-foreground text-xs">{t.range}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What We Analyze */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">What Our AI Analyzes</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Powerful AI tools designed to transform you from average to extraordinary
                    </p>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                    {["Jawline", "Cheekbones", "Eyes", "Skin Quality", "Facial Harmony", "Dimorphism", "PSL Score", "Racial Attraction"].map((m) => (
                        <div key={m} className="p-6 bg-[#171719] rounded-3xl border border-border text-center">
                            <p className="font-medium">{m}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">FAQ</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { q: "How does the AI face analyzer work?", a: "You upload a front and side photo. Our AI vision model analyzes your facial geometry, bone structure, and skin quality to generate scores for each feature." },
                        { q: "Is my photo stored?", a: "No. Photos are processed in real-time and never stored on our servers." },
                        { q: "What is a good PSL score?", a: "5.0+ is considered conventionally attractive (High-Tier Normie). 6.0+ puts you in the top 15%. Most people score between 3.5 and 5.5." },
                        { q: "How can I improve my facial score?", a: "Our AI gives you personalized suggestions: skincare, haircut changes, jaw exercises, mewing, lighting, and more." },
                    ].map((item) => (
                        <div key={item.q} className="bg-[#171719] border border-border rounded-3xl p-6">
                            <h3 className="font-medium text-white mb-2">{item.q}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Know Your Score. Start Your Glow-Up.</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Get your PSL rating, facial analysis, and personalized looksmaxxing roadmap in under 60 seconds.
                    </p>
                    <LoginCTAButton label="Analyze My Face Free →" size="lg" className="px-8 py-6 text-lg" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
