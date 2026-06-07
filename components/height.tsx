import { useEffect, useState } from 'react';
import { Rainbow } from "lucide-react";
import FadeIn from "react-fade-in";
import { fetchAI } from '@/lib/fetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeftIcon, Bed, ChartLineUpIcon, ClockIcon, PersonSimple, PersonSimpleRunIcon } from '@phosphor-icons/react';

export default function Height({ data }: any) {
    if (!data) return <></>;

    const texts = [
        "Calculating your potential",
        "Analyzing your data",
        "Estimating your growth",
        "Unlocking your capabilities"
    ];

    const [currentText, setCurrentText] = useState(texts[0]);
    const [index, setIndex] = useState(0);
    const [verbana, setVerbana] = useState<any>(null);

    useEffect(() => {
        const run = async () => {
            const aiResponse = await fetchAI([
                {
                    role: "system",
                    content: `You are a highly accurate height prediction and growth specialist. The user gives you their physical details. Respond ONLY with a valid JSON object — no markdown, no extra text.

Required fields:
- future_height: their estimated natural adult height as a string (e.g. "5'10\\"" or "178 cm"). Use the Khamis-Roche method and mid-parental height formula. Be precise based on their age, current height, parental heights, and ethnicity.
- optimized_height: maximum achievable height if sleep, nutrition, posture, and exercise are all optimized from today, as a string. This should be realistic — typically 0.5–2 inches above future_height, never more than 3 inches.
- months_of_growth_remaining: an integer representing how many more months of significant height growth this person has left. Base this on their age, gender, and ethnicity. Males typically stop growing around 18–21, females around 15–18. If they are past peak growth age, this should be 0. If mid-puberty, could be 12–36. Be realistic.
- dream_height_odds_ratio: a string like "1 in 2" or "1 in 50" or "1 in 200" representing how realistic it is that the user can reach their dream height. Base this on: (a) how far their dream height is from their predicted future_height, (b) how many months of growth they have left, (c) whether optimized_height already meets or exceeds dream height. Rules: if dream height ≤ optimized_height → "1 in 2"; if dream height is 0.5–1 inch above optimized → "1 in 5"; if 1–2 inches above → "1 in 20"; if 2–3 inches above → "1 in 50"; if 3–4 inches above → "1 in 150"; if 4+ inches above or they have 0 months remaining and haven't reached dream height → "1 in 500" or higher.
- dream_height_likelihood: a short label string describing the likelihood. Examples: "Very Likely", "Likely", "Possible", "Unlikely", "Very Unlikely", "Near Impossible". Match this to the odds ratio.
- future_optimizations: array of 5–7 short, specific, actionable strings the user should do to maximize their height. Be specific to their profile (age, activity level, sleep hours, ethnicity). Include things like specific sleep targets, nutrition specifics, exercises, posture corrections, and supplementation if relevant.

Accuracy rules:
- Use the mid-parental height formula: for males: ((father_height_cm + mother_height_cm + 13) / 2); for females: ((father_height_cm + mother_height_cm - 13) / 2). Adjust ±5cm based on current height trajectory (if user's current height is already above/below mid-parental prediction, weight more towards current height at older ages).
- Ethnicity adjustments: East/South Asians typically average 1–2 inches shorter than Caucasian averages; African/Black often 0.5–1 inch taller; Middle Eastern similar to Caucasian.
- If the user is already at or past 21 (male) or 18 (female), future_height should equal or be very close to current height, and months_of_growth_remaining should be 0.
- Do NOT be overly optimistic. Be accurate and honest.

Example output:
{"future_height":"5'11\\"","optimized_height":"6'0\\"","months_of_growth_remaining":14,"dream_height_odds_ratio":"1 in 5","dream_height_likelihood":"Likely","future_optimizations":["Sleep exactly 8–9 hours nightly — growth hormone peaks at 11pm–2am","Eat 1.2g protein per kg bodyweight daily","Do dead hangs for 60 seconds daily to decompress the spine","Avoid caffeine before age 18","Take vitamin D3 (2000 IU) and zinc (15mg) daily","Fix forward head posture — it can cost 1–2 inches of standing height","Sprint intervals 2–3x/week to stimulate growth hormone release"]}`,
                },
                {
                    role: "user",
                    content: JSON.stringify(data),
                },
            ]);

            if (!aiResponse) return;

            try {
                const cleaned = aiResponse.replace(/```json|```/g, "").trim();
                const parsedData = JSON.parse(cleaned);
                setVerbana(parsedData);
            } catch (error) {
                console.error("Failed to parse height AI JSON:", error, aiResponse);
            }
        };

        run();
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % texts.length);
            setCurrentText(texts[(index + 1) % texts.length]);
        }, 3000);

        return () => clearInterval(interval);
    }, [index, texts]);

    if (!verbana) {
        return (
            <div className="w-full h-64 border-dashed border-white/10 border-2 flex flex-col space-y-2 items-center justify-center rounded-3xl">
                <Rainbow className="animate-pulse size-14" />
                <FadeIn>
                    <p className="text-muted-foreground text-sm">{currentText}..</p>
                </FadeIn>
            </div>
        );
    }

    const oddsColor = () => {
        const l = verbana?.dream_height_likelihood ?? "";
        if (l === "Very Likely" || l === "Likely") return "text-green-400";
        if (l === "Possible") return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="w-full grid gap-6 pb-6 bg-background text-foreground">
            {/* Header */}
            <div className="flex w-full space-x-4 items-center">
                <Rainbow className="size-9" />
                <div className="flex items-center space-x-2">
                    <ArrowLeftIcon onClick={() => window.location.reload()} className="size-5 text-muted-foreground hover:text-white cursor-pointer" />
                    <p className="text-xl">Last report</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FadeIn delay={400}>
                    <Card className="from-white to-sky-200 h-[180px] bg-gradient-to-tr relative">
                        <CardHeader className="pb-12">
                            <CardTitle className="text-sm font-medium text-muted">Future Height</CardTitle>
                            <CardDescription className="text-black font-bold text-4xl">
                                {verbana?.future_height}
                            </CardDescription>
                        </CardHeader>
                        <PersonSimple weight="regular" className="absolute size-8 text-black/35 right-6 bottom-6" />
                    </Card>
                </FadeIn>

                <FadeIn delay={800}>
                    <Card className="from-chart-1 to-blue-500 bg-gradient-to-r relative h-[180px]">
                        <CardHeader className="pb-12">
                            <CardTitle className="text-sm font-medium text-white/90">Optimized Potential</CardTitle>
                            <CardDescription className="text-3xl font-bold text-white">
                                {verbana?.optimized_height}
                            </CardDescription>
                        </CardHeader>
                        <PersonSimpleRunIcon className="absolute size-8 text-black/35 right-6 bottom-6" />
                    </Card>
                </FadeIn>

                <FadeIn delay={1200}>
                    <Card className="bg-muted border-border/50 relative h-[180px]">
                        <CardHeader className="pb-12">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Growth Time Left
                            </CardTitle>
                            <CardContent className="p-0 pt-2">
                                {verbana?.months_of_growth_remaining === 0 ? (
                                    <p className="text-2xl font-bold text-muted-foreground">Growth complete</p>
                                ) : (
                                    <>
                                        <p className="text-3xl font-bold">
                                            {verbana?.months_of_growth_remaining}
                                            <span className="text-base font-normal text-muted-foreground ml-1">months</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">of potential growth remaining</p>
                                    </>
                                )}
                            </CardContent>
                        </CardHeader>
                        <ClockIcon className="absolute size-7 text-muted-foreground/60 right-6 bottom-6" />
                    </Card>
                </FadeIn>

                <FadeIn className="w-full" delay={1600}>
                    <Card className="bg-muted border-border/50 relative h-[180px]">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Dream Height Odds
                                {data?.dreamHeight && (
                                    <span className="ml-1 text-xs text-muted-foreground/70">({data.dreamHeight})</span>
                                )}
                            </CardTitle>
                            <CardDescription className="text-3xl mt-1 font-bold text-foreground">
                                {verbana?.dream_height_odds_ratio}
                            </CardDescription>
                            <span className={`text-sm font-semibold ${oddsColor()}`}>
                                {verbana?.dream_height_likelihood}
                            </span>
                        </CardHeader>
                        <Bed className="absolute size-7 text-muted-foreground/60 right-6 bottom-6" />
                    </Card>
                </FadeIn>
            </div>

            {/* Optimization Steps */}
            <FadeIn delay={2000}>
                <Card className="bg-muted border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl">Maximization Protocol</CardTitle>
                        <CardDescription>Actionable steps to reach your genetic potential</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {verbana?.future_optimizations?.map((step: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0 text-sm">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    );
}
