import type { Metadata } from "next";
import Navbar from "@/components/ui/navbar";
import PublicFooter from "@/components/ui/public-footer";
import LoginCTAButton from "@/components/ui/login-cta-button";

export const metadata: Metadata = {
    title: "Rizz Coach – AI Conversation & Charisma Trainer",
    description:
        "Train your rizz with AI. Practice conversation openers, responses, and dating scenarios. Improve your charisma, confidence, and social skills with our AI rizz coach.",
    keywords: ["rizz coach", "rizz training", "how to get rizz", "improve rizz", "AI conversation trainer", "charisma coach", "dating coach AI", "looksmaxxing rizz", "social skills"],
    alternates: { canonical: "https://moggg.pro/rizz-coach" },
    openGraph: {
        title: "Rizz Coach – AI Conversation & Charisma Trainer | Moggg",
        description: "Practice your rizz with AI. Get better at conversations, dating, and social confidence.",
        url: "https://moggg.pro/rizz-coach",
    },
};

export default function RizzCoachPage() {
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
                        AI Rizz Coach
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Looks get you in the door. Rizz keeps you there. Practice real conversations with our AI coach —
                        master openers, responses, flirting, and social confidence.
                    </p>
                    <div className="flex justify-center pt-2">
                        <LoginCTAButton label="Train My Rizz Free →" size="lg" className="px-8 py-6 text-lg" />
                    </div>
                </div>
            </section>

            {/* Screenshot */}
            <section className="py-20 px-4 flex flex-col items-center justify-center">
                <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
                    <img
                        src="/rizz.png"
                        alt="Rizz Coach Preview"
                        className="w-full h-auto rounded-2xl object-contain"
                    />
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">Level Up Your Social Game</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Powerful AI tools designed to transform you from average to extraordinary
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Conversation Practice",
                            desc: "Practice real scenarios — approaching someone, texting back, date conversations — with AI that scores your responses.",
                        },
                        {
                            title: "Opener Generator",
                            desc: "Get personalized opening lines for any situation. Never run out of things to say again.",
                        },
                        {
                            title: "Confidence Training",
                            desc: "Rizz isn't just words. We coach you on body language, confidence cues, and how to project high-value energy.",
                        },
                    ].map((f) => (
                        <div key={f.title} className="p-6 bg-[#171719] rounded-3xl border border-border">
                            <h3 className="text-xl font-medium text-white mb-3">{f.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
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
                        { q: "What is rizz?", a: "Rizz is the ability to attract and charm others through conversation, charisma, and confidence. It's a key part of social and dating success." },
                        { q: "Can rizz actually be learned?", a: "Yes. Like any social skill, rizz improves with deliberate practice. Our AI coach gives you real-time feedback and correction." },
                        { q: "How is this different from a dating coach?", a: "We're available 24/7, private, and cost a fraction of the price. Practice as many scenarios as you want without judgment." },
                        { q: "Will this help with texting?", a: "Absolutely. We have dedicated texting scenarios where you can practice responses and learn what works vs. what kills attraction." },
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
                    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Looks + Rizz = Unstoppable</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Combine your facial looksmax with elite social skills. Moggg is your complete looksmaxxing toolkit.
                    </p>
                    <LoginCTAButton label="Get Started Free →" size="lg" className="px-8 py-6 text-lg" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
