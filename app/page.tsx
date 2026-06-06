"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import Link from 'next/link'
import Navbar from "@/components/ui/navbar";
import LoginWrapper from "@/components/ui/login";
import PublicFooter from "@/components/ui/public-footer";
import FadeIn from "react-fade-in";
import { ChatsTeardropIcon, PersonArmsSpreadIcon, SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <div className="w-screen min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden h-screen flex flex-col justify-center items-center px-4 rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
        <div
          className="absolute inset-0 w-full h-full object-cover bg-[url('/hero3.jpg')] bg-cover bg-center"
        />

        <div className="relative z-20 text-center max-w-4xl space-y-8 justify-center items-center flex flex-col">
          <div className="py-1 px-3 rounded-xl bg-background/50 border border-white/15 w-fit">
            <span className="text-sm text-white/75">Code <b className="text-white">MAXX</b> for 50% off</span>
          </div>
          <FadeIn>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/75">
              Level up your Looks.
            </h1>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-lg sm:text-2xl font-medium text-white">
              Tools to maximize your appearance, confidence, and social skills
            </p>
          </FadeIn>

          <div className="flex gap-4 justify-center">
            <LoginWrapper>
              <Button className="group" size="lg">
                <span>Get Started</span>

              </Button>
            </LoginWrapper>

          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce">
            <ArrowDown />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 flex flex-col items-center justify-center">
        <h3 className="text-3xl sm:text-4xl mb-3">Dashboard</h3>
        <p className="text-muted-foreground mb-6">
          Your hub for self-improvement
        </p>
        <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
          <img
            src="/landing.png"
            alt="Dashboard Preview"
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>
      </section>

      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-3xl sm:text-4xl">Facial Rating</h3>
          <Link href="/face-analyzer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Face Analyzer">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-6">
          Get a facial assessment with detailed scoring and improvement
        </p>
        <div className="sm:w-[80%] flex flex-col gap-6">
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/face1.png" alt="Face Analysis 1" className="w-full h-auto rounded-2xl object-contain" />
          </div>
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/face2.png" alt="Face Analysis 2" className="w-full h-auto rounded-2xl object-contain" />
          </div>
          <div className="rounded-3xl sm:p-4 bg-muted">
            <img src="/face3.png" alt="Face Analysis 3" className="w-full h-auto rounded-2xl object-contain" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-3xl sm:text-4xl">Height Coach</h3>
          <Link href="/height-calculator" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Height Coach">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-6">
          Estimate height, potential, odds, and maximize them
        </p>
        <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
          <img
            src="/HIGH.png"
            alt="Dashboard Preview"
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>
      </section>

      <section className="py-20 px-4 flex justify-center flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-3xl sm:text-4xl">Rizz Coach</h3>
          <Link href="/rizz-coach" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Learn more about Rizz Coach">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-6">
          Practice your game with AI, get real-time feedback, and test your rizz before using it in real life.
        </p>
        <div className="sm:w-[80%] rounded-3xl sm:p-4 bg-muted">
          <img
            src="/rizz.png"
            alt="Dashboard Preview"
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-white mb-4">
            Your Looksmaxxing Toolkit
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful AI tools designed to transform you from average to extraordinary
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {([
            {
              href: "/dashboard/rizz",
              icon: <ChatsTeardropIcon weight="fill" size={24} />,
              label: "Rizz Practice",
              description: "Practice your conversation skills with AI-powered chat simulations"
            },
            {
              href: "/dashboard/face",
              icon: <SmileyWinkIcon weight="fill" size={24} />,
              label: "Face Analysis",
              description: "Get insights about your facial features and attractiveness"
            },
            {
              href: "/dashboard/height",
              icon: <PersonArmsSpreadIcon weight="fill" size={24} />,
              label: "Height Coach",
              description: "Estimate and maximize to improve your posture and appearance"
            },


          ]).map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="group block p-6 bg-[#171719] rounded-3xl border border-border hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-2 bg-muted rounded-lg transition-colors duration-200">
                  {link.icon}
                </div>
                <h2 className="text-xl font-medium text-white">{link.label}</h2>
              </div>
              <p className="text-gray-600 text-sm">{link.description}</p>
              <div className="mt-4 text-muted-foreground text-sm font-medium group-hover:text-white transition-colors duration-200">
                Get started →
              </div>
            </a>
          ))}




        </div>
      </section>

      <section id="pricing" className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl text-white mb-6">
            At the lowest price ever
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto px-5 py-3 bg-muted rounded-2xl w-fit border-border border">
            $10 dollars a month
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">
            Ready to Transform Yourself?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of individuals who've upgraded their lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LoginWrapper>
              <Button size="lg" className="px-8 py-6 text-lg">
                Get Started
              </Button>
            </LoginWrapper>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}