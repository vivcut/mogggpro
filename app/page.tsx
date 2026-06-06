"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUpRight, Check, Minus } from "lucide-react";
import Link from 'next/link';
import Navbar from "@/components/ui/navbar";
import LoginWrapper from "@/components/ui/login";
import PublicFooter from "@/components/ui/public-footer";
import { ChatsTeardropIcon, PersonArmsSpreadIcon, SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { MinusIcon, SubtractIcon } from "@phosphor-icons/react";

// Reusable fade-up wrapper for scroll-triggered sections
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  return (
    <div className="w-screen min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden h-screen flex flex-col justify-center items-center px-4 rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <div className="absolute inset-0 w-full h-full object-cover bg-[url('/hero3.png')] bg-cover bg-center" />

        <div className="relative z-20 text-center max-w-4xl space-y-8 justify-center items-center flex flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-1 px-3 rounded-xl bg-background/50 border border-white/15 w-fit"
          >
            <span className="text-sm text-white/75">Face Rating · Height Coach · Rizz Practice — all in one</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text leading-20 text-transparent bg-gradient-to-r from-white to-white/75"
          >
            Level up your Looks
          </motion.h1>

          {/* Subtitle list */}
          <motion.ol
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
            className="text-lg sm:text-2xl font-medium text-white max-w-3xl mx-auto space-y-4"
          >
            <li>Analyze your attractiveness</li>
            <li>Estimate your future height</li>
            <li>Practise your dating game</li>
          </motion.ol>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.34 }}
            className="flex gap-4 justify-center"
          >
            <LoginWrapper>
              <Button className="group" size="lg">
                <span>Get Started</span>
              </Button>
            </LoginWrapper>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce">
            <ArrowDown />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 flex flex-col items-center justify-center">
        <FadeUp>
          <h3 className="text-3xl sm:text-4xl mb-3 text-center">Dashboard</h3>
          <p className="text-muted-foreground mb-6 text-center">Your hub for self-improvement</p>
        </FadeUp>
        <FadeUp delay={0.1} className="sm:w-[80%] w-full">
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/landing.png" alt="Dashboard Preview" className="w-full h-auto rounded-2xl object-contain" />
          </div>
        </FadeUp>
      </section>

      {/* Facial Rating */}
      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <FadeUp>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-3xl sm:text-4xl">Facial Rating</h3>
            <Link href="/face-analyzer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Face Analyzer">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </Link>
          </div>
          <p className="text-muted-foreground mb-6 text-center">Get a facial assessment with detailed scoring and improvement</p>
        </FadeUp>
        <div className="sm:w-[80%] w-full flex flex-col gap-6">
          {["/face1.png", "/face2.png", "/face3.png"].map((src, i) => (
            <FadeUp key={src} delay={i * 0.08}>
              <div className="rounded-3xl sm:p-4 bg-muted">
                <img src={src} alt={`Face Analysis ${i + 1}`} className="w-full h-auto rounded-2xl object-contain" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Height Coach */}
      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <FadeUp>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-3xl sm:text-4xl">Height Coach</h3>
            <Link href="/height-calculator" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Height Coach">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </Link>
          </div>
          <p className="text-muted-foreground mb-6 text-center">Estimate height, potential, odds, and maximize them</p>
        </FadeUp>
        <FadeUp delay={0.1} className="sm:w-[80%] w-full">
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/HIGH.png" alt="Height Coach" className="w-full h-auto rounded-2xl object-contain" />
          </div>
        </FadeUp>
      </section>

      {/* Rizz Coach */}
      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <FadeUp>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-3xl sm:text-4xl">Rizz Coach</h3>
            <Link href="/rizz-coach" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Rizz Coach">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </Link>
          </div>
          <p className="text-muted-foreground mb-6 text-center">Practice your game with AI, get real-time feedback, and test your rizz before using it in real life.</p>
        </FadeUp>
        <FadeUp delay={0.1} className="sm:w-[80%] w-full">
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/rizz.png" alt="Rizz Coach" className="w-full h-auto rounded-2xl object-contain" />
          </div>
        </FadeUp>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Your Looksmaxxing Toolkit</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful AI tools designed to transform you from average to extraordinary
            </p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-8">
          {([
            { href: "/dashboard/rizz", icon: <ChatsTeardropIcon weight="fill" size={24} />, label: "Rizz Practice", description: "Practice your conversation skills with AI-powered chat simulations" },
            { href: "/dashboard/face", icon: <SmileyWinkIcon weight="fill" size={24} />, label: "Face Analysis", description: "Get insights about your facial features and attractiveness" },
            { href: "/dashboard/height", icon: <PersonArmsSpreadIcon weight="fill" size={24} />, label: "Height Coach", description: "Estimate and maximize to improve your posture and appearance" },
          ]).map((link, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <LoginWrapper href={link.href}>
                <div className="group cursor-pointer p-6 bg-[#171719] rounded-3xl border border-border hover:border-blue-500 hover:shadow-md transition-all duration-200 h-full">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-2 bg-muted rounded-lg transition-colors duration-200">{link.icon}</div>
                    <h2 className="text-xl font-medium text-white">{link.label}</h2>
                  </div>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                  <div className="mt-4 text-muted-foreground text-sm font-medium group-hover:text-white transition-colors duration-200">
                    Get started →
                  </div>
                </div>
              </LoginWrapper>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-white mb-3">How we compare</h2>
            <p className="text-muted-foreground">See how Moggg stacks up against the competition</p>
          </div>
        </FadeUp>

        {(() => {
          const competitors = [
            { src: "/areum.jpeg", label: "Areum" },
            { src: "/umax.jpeg", label: "Umax" },
            { src: "/gotall.jpeg", label: "GoTall" },
          ];
          const rows = [
            { feature: "Face Analysis", areum: true, umax: true, gotall: false, note: "deeper scoring & improvement tips" },
            { feature: "Height Calculator", areum: false, umax: false, gotall: true, note: "predicts adult height + tips to maximize it" },
            { feature: "Rizz Coach", areum: false, umax: false, gotall: false, note: "assess and grade your dating skills" },
            { feature: "Full Conversation Mode", areum: false, umax: false, gotall: false, note: "simulate full convos as if on a dating app" },
            { feature: "Blog & Guides", areum: false, umax: false, gotall: false, note: "many free guides included" },
            { feature: "Price", areum: true, umax: true, gotall: true, note: "200% cheaper + lifetime access" },
          ] as { feature: string; areum: boolean; umax: boolean; gotall: boolean; note: string }[];
          const vals = (row: typeof rows[0]) => [row.areum, row.umax, row.gotall];

          return (
            <FadeUp delay={0.1}>
              {/* Desktop table — hidden on mobile */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-[1fr_72px_72px_72px_130px] gap-2 mb-2 px-3">
                  <div />
                  {[...competitors, { src: "/logo.png", label: "Moggg" }].map((c, ci) => (
                    <div key={c.label} className="flex flex-col items-center gap-1">
                      <img src={c.src} alt={c.label} className="w-10 h-10 rounded-lg object-cover" />
                      <span className={`text-xs ${ci === 3 ? "text-white font-semibold" : "text-white/50"}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden">
                  {rows.map((row, i) => (
                    <div key={i} className="grid grid-cols-[1fr_72px_72px_72px_130px] gap-2 items-center px-3 py-3 hover:bg-white/[0.02] transition-colors">
                      <span className="text-white/80 font-medium text-sm">{row.feature}</span>
                      {vals(row).map((v, vi) => (
                        <div key={vi} className="flex justify-center">
                          {v ? <Check className="w-4 h-4 text-yellow-400" /> : <Minus className="w-4 h-4 text-white/20" />}
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-1">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="bg-zinc-800 rounded-md px-1.5 py-1 text-[10px] text-green-400/80 leading-tight text-center">{row.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile cards — one card per feature */}
              <div className="flex flex-col gap-3 sm:hidden">
                {rows.map((row, i) => (
                  <div key={i} className="bg-[#111113] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-white font-semibold text-sm">{row.feature}</span>
                    {/* Competitors */}
                    <div className="grid grid-cols-3 gap-2">
                      {competitors.map((c, ci) => (
                        <div key={c.label} className="flex items-center gap-1.5">
                          <img src={c.src} alt={c.label} className="w-5 h-5 rounded object-cover" />
                          <span className="text-white/40 text-[10px]">{c.label}</span>
                          {vals(row)[ci] ? <Check className="w-3 h-3 text-yellow-400 ml-auto" /> : <Minus className="w-3 h-3 text-white/20 ml-auto" />}
                        </div>
                      ))}
                    </div>
                    {/* Moggg */}
                    <div className="flex items-start gap-2 border-t border-white/5 pt-2.5">
                      <img src="/logo.png" alt="Moggg" className="w-5 h-5 ring-2 ring-blue-500 rounded object-cover mt-0.5" />
                      <span className="text-white text-[10px] font-semibold mt-0.5">Moggg</span>
                      <Check className="w-3 h-3 text-green-400 mt-1 shrink-0" />
                      <span className="bg-zinc-800 rounded-md px-1.5 py-1 text-[10px] text-green-400/80 leading-tight">{row.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 px-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-yellow-400" /> does the same</span>
                <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-400" /> we are better</span>
                <span className="flex items-center gap-1.5"><Minus className="w-3 h-3 text-white/20" /> doesn't have it</span>
              </div>
            </FadeUp>
          );
        })()}
      </section>

      {/* Reviews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-white mb-3">What people are saying</h2>
            <p className="text-muted-foreground">Real results from real users</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {([
            { name: "Jake M.", handle: "@jakemaxxx", review: "Moggg's face analysis is genuinely the most detailed I've seen. It actually told me what to fix instead of just giving a number.", rating: 5 },
            { name: "Ryan T.", handle: "@ryanlooksmax", review: "The rizz practice mode is actually fun and helpful. I used it before going out and I could tell the difference in my conversations.", rating: 5 },
            { name: "Alex K.", handle: "@alexkglow", review: "Height coach predicted my adult height almost exactly and gave me solid tips. Worth every penny for the amount of tools you get.", rating: 5 },
          ]).map((r, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-muted rounded-3xl p-6 flex flex-col gap-4 border border-white/5 h-full">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, s) => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">"{r.review}"</p>
                <div className="mt-auto flex flex-col">
                  <span className="text-white font-semibold text-sm">{r.name}</span>
                  <span className="text-muted-foreground text-xs">{r.handle}</span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-white mb-3">At the lowest price ever</h2>
            <p className="text-muted-foreground">One payment. No subscriptions. No renewals.</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="max-w-sm mx-auto border border-white/10 rounded-3xl p-8 flex flex-col gap-6 shadow-lg">
            {/* Badge */}
            <div className="w-fit px-3 py-1 rounded-full bg-green-500/10 bordr border-green-500/20 text-green-400 text-xs font-semibold">
              Lifetime Access
            </div>
            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-6xl text-white">$10</span>
              <span className="text-muted-foreground mb-2 text-sm">one-time</span>
            </div>
            {/* Features */}
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              {[
                "Access to all features forever",
                "Face Rating & PSL breakdown",
                "Height Coach & predictions",
                "Rizz Coach — full conversation mode",
                "All future updates included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">
                    <Check className="w-4 h-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {/* CTA */}
            <LoginWrapper>
              <Button size="lg" className="w-full mt-2">Get Lifetime Access</Button>
            </LoginWrapper>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Ready to Transform Yourself?</h2>
            <p className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of individuals who've upgraded their lives
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LoginWrapper>
                <Button size="lg" className="px-8 py-6 text-lg">Get Started</Button>
              </LoginWrapper>
            </div>
          </div>
        </FadeUp>
      </section>

      <PublicFooter />
    </div>
  );
}
