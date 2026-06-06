import type { Metadata } from "next";
import Navbar from "@/components/ui/navbar";
import PublicFooter from "@/components/ui/public-footer";
import LoginCTAButton from "@/components/ui/login-cta-button";

export const metadata: Metadata = {
    title: "Height Calculator – Predict Your Max Height Potential",
    description:
        "Use our AI-powered height calculator to predict your maximum height potential based on genetics, age, and growth factors. Free looksmaxxing height analysis tool.",
    keywords: ["height calculator", "height predictor", "max height potential", "how tall will i be", "height looksmaxxing", "grow taller"],
    alternates: { canonical: "https://moggg.pro/height-calculator" },
    openGraph: {
        title: "Height Calculator – Predict Your Max Height Potential | Moggg",
        description: "Find out your height potential and how to maximize it. Free AI-powered height analysis.",
        url: "https://moggg.pro/height-calculator",
    },
};

export default function HeightCalculatorPage() {
    return (
        <div className="w-screen min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero */}
            <section className="w-full relative overflow-hidden flex flex-col justify-center items-center px-4 pt-40 pb-24 text-center rounded-b-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 w-full h-full bg-[url('/hero3.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-3xl space-y-6">
                    <span className="text-xs uppercase tracking-widest text-white/50 block">Looksmaxxing Tool</span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/75">
                        AI Height Calculator
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover your maximum height potential based on your genetics, age, and lifestyle.
                        Get personalized recommendations to maximize your growth and frame.
                    </p>
                    <div className="flex justify-center pt-2">
                        <LoginCTAButton label="Calculate My Height Potential →" size="lg" className="px-8 py-6 text-lg" />
                    </div>
                </div>
            </section>

            {/* Screenshot */}
            <section className="py-20 px-4 flex flex-col items-center justify-center">
                <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
                    <img
                        src="/HIGH.png"
                        alt="Height Coach Preview"
                        className="w-full h-auto rounded-2xl object-contain"
                    />
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">What You'll Get</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Powerful AI tools designed to transform you from average to extraordinary
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Genetic Height Estimate",
                            desc: "Based on your parents' heights and your current measurements, we calculate your genetic ceiling.",
                        },
                        {
                            title: "Growth Optimization Tips",
                            desc: "Sleep, nutrition, posture, and exercise recommendations to hit your genetic max.",
                        },
                        {
                            title: "Frame & Proportion Analysis",
                            desc: "Height isn't everything — we analyze your frame, shoulder width, and proportions for maximum looksmaxxing impact.",
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
                    <h2 className="text-2xl sm:text-4xl text-white mb-4">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            q: "How accurate is the height calculator?",
                            a: "Our calculator uses proven mid-parental height formulas combined with AI to estimate your potential with ±2 inch accuracy for most people.",
                        },
                        {
                            q: "Can I still grow taller as an adult?",
                            a: "Most height growth happens before 18-21. However, posture correction, spinal decompression exercises, and optimal sleep can add 1-2 inches of apparent height.",
                        },
                        {
                            q: "What is looksmaxxing height?",
                            a: "Height is one of the most impactful factors in physical attractiveness. At 6'+ you enter the top percentile of male height. Our tool helps you understand where you stand and how to maximize your frame.",
                        },
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
                    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Start Looksmaxxing Today</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of men using Moggg to rate their looks, track their glow-up, and get actionable improvement plans.
                    </p>
                    <LoginCTAButton label="Get Started Free →" size="lg" className="px-8 py-6 text-lg" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
