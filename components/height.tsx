import { useEffect, useState } from 'react';
import { Rainbow } from "lucide-react";
import FadeIn from "react-fade-in";
import { fetchAI } from '@/lib/fetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeftIcon, Bed, ChartLineUpIcon, PersonSimple, PersonSimpleRunIcon } from '@phosphor-icons/react';

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
                    content: `You are a height prediction expert. The user will give you their physical details. Respond ONLY with a valid JSON object — no markdown, no explanation.

Required fields:
- future_height: estimated natural adult height as a string (e.g. "5'10\\"")
- optimized_height: maximum potential height if lifestyle is optimized, as a string (e.g. "5'11\\"")
- growth_completion_percentage: number from 0–100 representing how much of the user's growth is complete
- dream_height_odds_ratio: a string like "1 in 20" representing the chance the user can reach their dream height
- future_optimizations: array of 4–6 short actionable strings the user should do to maximize their height

Example format:
{"future_height":"5'10\\"","optimized_height":"5'11\\"","growth_completion_percentage":85,"dream_height_odds_ratio":"1 in 10","future_optimizations":["Sleep 8–9 hours per night","Eat protein-rich meals","Avoid alcohol","Do hanging exercises daily"]}`,
                },
                {
                    role: "user",
                    content: JSON.stringify(data),
                },
            ]);

            if (!aiResponse) return;

            try {
                // Strip any markdown code fences the model might add
                const cleaned = aiResponse.replace(/```json|```/g, "").trim();
                const parsedData = JSON.parse(cleaned);
                setVerbana(parsedData);
            } catch (error) {
                console.error("Failed to parse height AI JSON:", error, aiResponse);
            }
        };


        run();
    }, [data])

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % texts.length);
            setCurrentText(texts[(index + 1) % texts.length]);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, [index, texts]);

    if (!verbana) {
        return (
            <div className="w-full h-full border-dashed border-white/10 border-2 flex flex-col space-y-2 items-center justify-center rounded-3xl">
                <Rainbow className="animate-pulse size-14" />

                <FadeIn>
                    <p className="text-muted-foreground text-sm">{currentText}..</p>
                </FadeIn>
            </div>
        );
    } else {
        return <>
            <div className="w-full h-full grid gap-6 pb-6 bg-background text-foreground">

                {/* Metrics Grid */}
                <div className='flex w-full space-x-4 items-center'>
                    <Rainbow className='size-9' />

                    <div className='flex items-center space-x-2'>

                        <ArrowLeftIcon onClick={() => window.location.reload()} className='size-5 text-muted-foreground hover:text-white' />

                        <p className='text-xl'>Last report</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FadeIn delay={400} className=''>
                        <Card className="from-white to-sky-200 h-[180px] bg-gradient-to-tr relative">
                            <CardHeader className="pb-12"> {/* Extra padding at bottom */}
                                <CardTitle className="text-sm font-medium text-muted">Future Height</CardTitle>
                                <CardDescription className="text-black font-bold text-4xl">
                                    {verbana?.future_height}
                                </CardDescription>
                            </CardHeader>
                            <PersonSimple weight='regular' className="absolute size-8 text-black/35 right-6 bottom-6" />
                        </Card>
                    </FadeIn>

                    <FadeIn delay={800} className=''>
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

                    <FadeIn className="" delay={1200}>
                        <Card className="bg-muted border-border/50 relative h-[180px]">
                            <CardHeader className="pb-12">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Growth Percentage
                                </CardTitle>
                                <CardContent className="p-0 pt-2">
                                    <p className="text-2xl font-bold">
                                        {(verbana?.growth_completion_percentage).toFixed(1)}% done
                                    </p>
                                    <Progress
                                        value={verbana.growth_completion_percentage}
                                        className="h-3 rounded-xl bg-background mt-4"

                                    />
                                </CardContent>
                            </CardHeader>
                            <ChartLineUpIcon className="absolute size-7 text-muted-foreground/60 right-6 bottom-6" />
                        </Card>
                    </FadeIn>
                    <FadeIn className="w-full" delay={1600}>
                        <Card className="bg-muted border-border/50 relative h-[180px]">
                            <CardHeader className="pb-12">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Dream Height Odds
                                </CardTitle>
                                <CardDescription className="text-4xl mt-3 font-bold text-foreground">
                                    {verbana.dream_height_odds_ratio}
                                </CardDescription>
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
                                {verbana?.future_optimizations?.map((step: any, index: any) => (<div
                                    key={index}
                                    className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed">{step}</p>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </>

    }
}