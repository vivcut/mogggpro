"use client";
import { useState, useCallback, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DownloadCloudIcon, Copy } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ArrowClockwiseIcon, UploadIcon } from "@phosphor-icons/react/dist/ssr";
import { ArrowCounterClockwiseIcon, FileIcon, InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import FadeIn from "react-fade-in";
import Image from "next/image";
import { PurchaseContext, UserContext } from "@/app/rootprovider";

function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const PSL_TIERS = [
    { min: 7.75, max: 8.0,  label: "True Adam / Tera Chad", sub: "Top 0.001% — Theoretical genetic perfection",    color: "#a78bfa" },
    { min: 7.0,  max: 7.75, label: "Giga Chad",              sub: "Top 0.1% — Barely perceivable flaws",            color: "#34d399" },
    { min: 6.5,  max: 7.0,  label: "Chad",                   sub: "Top 0.5–2% — Exceptional bone structure",        color: "#34d399" },
    { min: 6.0,  max: 6.5,  label: "Chadlite",               sub: "Top 2–15% — Striking facial structure",          color: "#6ee7b7" },
    { min: 5.0,  max: 6.0,  label: "HTN – High-Tier Normie", sub: "50th–85th percentile — Conventionally attractive", color: "#fdfd96" },
    { min: 4.0,  max: 5.0,  label: "MTN – Mid-Tier Normie",  sub: "25th–50th percentile — The average human",      color: "#fdfd96" },
    { min: 3.0,  max: 4.0,  label: "LTN – Low-Tier Normie",  sub: "Bottom 5–25% — Slightly below average",         color: "#fb923c" },
    { min: 2.0,  max: 3.0,  label: "Sub-Average",            sub: "Bottom 1–5% — Noticeably unattractive",         color: "#f87171" },
    { min: 1.0,  max: 2.0,  label: "Subhuman",               sub: "Bottom 0.1% — Severe asymmetry or deformities", color: "#ef4444" },
];

function getPslTier(score: number) {
    return PSL_TIERS.find(t => score >= t.min && score <= t.max) ?? PSL_TIERS[PSL_TIERS.length - 1];
}

export default function FaceAnalysisPage() {
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [sideFile, setSideFile] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [sidePreview, setSidePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const { user } = useContext<any>(UserContext);
    const { setShowPurchase } = useContext(PurchaseContext);

    const handleFile = useCallback((slot: "front" | "side") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!VALID_TYPES.includes(file.type)) { toast.error("Please upload a JPEG, PNG, or WEBP image."); return; }
        if (file.size > MAX_SIZE) { toast.error("Image too large. Maximum 5MB allowed."); return; }
        const preview = URL.createObjectURL(file);
        if (slot === "front") { setFrontFile(file); setFrontPreview(preview); }
        else { setSideFile(file); setSidePreview(preview); }
        setResult(null);
    }, []);

    const resetSlot = (slot: "front" | "side") => {
        if (slot === "front") { setFrontFile(null); setFrontPreview(null); }
        else { setSideFile(null); setSidePreview(null); }
        setResult(null);
    };

    const resetAll = () => {
        setFrontFile(null); setFrontPreview(null);
        setSideFile(null); setSidePreview(null);
        setResult(null);
    };

    const handleAnalyse = async () => {
        if (!frontFile || !sideFile) { toast.error("Please upload both front-facing and side-facing photos."); return; }
        if (!user?.subscription) { setShowPurchase(true); return; }

        setIsLoading(true);
        setResult(null);

        try {
            const [frontUri, sideUri] = await Promise.all([fileToDataUri(frontFile), fileToDataUri(sideFile)]);

            const response = await fetch('/api/ai/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert facial aesthetics analyst. The user will send you TWO photos of the same person: a front-facing photo and a side-facing (profile) photo. Use both images together to give a comprehensive analysis.

You must respond with ONLY a valid JSON object — no markdown, no explanation, no extra text.

JSON fields required:
- score: integer 0-100 overall attractiveness score
- potential: integer 0-100 maximum achievable score with improvements
- jawline_score: integer 0-100 jawline definition and strength (use side photo heavily)
- cheekbones: integer 0-100 cheekbone prominence and structure
- skin_quality: integer 0-100 skin clarity, texture, and uniformity
- dimorphism: integer 0-100 sexual dimorphism (masculine/feminine features appropriate for gender)
- eyes: integer 0-100 eye shape, symmetry, and expressiveness
- facial_harmony: integer 0-100 overall facial symmetry and proportions
- improvements: array of 3-5 short actionable improvement tips as strings
- racial_attraction: object with keys "Asian", "Caucasian", "Black", "Hispanic", "Middle Eastern", "South Asian" — each value is an integer 0-100 representing estimated % attraction from that group based on facial features and aesthetics
- psl_score: a decimal number from 1.0 to 8.0 representing the PSL (Pretty Scale Lookism) rating. Use the following tiers exactly:
  * 1.0–2.0 = Subhuman (severe asymmetry/deformities, bottom 0.1%)
  * 2.0–3.0 = Sub-5 / Sub-Average (noticeably unattractive, bottom 1-5%)
  * 3.0–4.0 = LTN - Low-Tier Normie (slightly below average, bottom 5-25%)
  * 4.0–5.0 = MTN - Mid-Tier Normie (absolute average human, 25th-50th percentile)
  * 5.0–6.0 = HTN - High-Tier Normie (conventionally attractive, 50th-85th percentile)
  * 6.0–6.5 = Chadlite (strong striking structure, top 2-15%)
  * 6.5–7.0 = Chad (exceptional harmony and bone structure, top 0.5-2%)
  * 7.0–7.75 = Giga Chad (barely perceivable flaws, top 0.1%)
  * 7.75–8.0 = True Adam / Tera Chad (theoretical genetic perfection, 0.001%)

If the image quality is too poor, blurry, or the face is not clearly visible in either photo, respond with: {"error":"poor_image_quality","message":"<brief explanation of which photo is the issue and why>"}
If no face is visible at all, respond with: {"error":"no_face_detected"}

Example output format:
{"score":72,"potential":85,"jawline_score":68,"cheekbones":74,"skin_quality":80,"dimorphism":70,"eyes":76,"facial_harmony":73,"psl_score":5.2,"improvements":["Improve skin hydration","Consider a structured haircut to enhance jawline","Better lighting in photos can highlight your features"],"racial_attraction":{"Asian":78,"Caucasian":65,"Black":60,"Hispanic":70,"Middle Eastern":55,"South Asian":62}}`
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "Here are my two photos for face analysis. The first image is my front-facing photo and the second is my side-facing (profile) photo. Please analyze both and return the JSON." },
                                { type: "image_url", image_url: { url: frontUri } },
                                { type: "image_url", image_url: { url: sideUri } }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);

            const data = await response.json();
            console.log("[face] raw API data:", JSON.stringify(data));

            try {
                let parsed: any;
                if (data.response && typeof data.response === "object") {
                    parsed = data.response;
                } else {
                    const rawResponse: string = (typeof data.response === "string" ? data.response : "") ?? "";
                    const cleanJson = rawResponse.replace(/```json|```/g, '').trim();
                    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) {
                        console.error("[face] no JSON block found. Raw response was:", rawResponse);
                        throw new Error("No face analysis data returned. Try clearer, front-facing photos.");
                    }
                    const sanitized = jsonMatch[0].replace(/\\([^"\\/bfnrtu])/g, '$1');
                    parsed = JSON.parse(sanitized);
                }

                if (parsed.error === "no_face_detected") {
                    throw new Error("No face detected. Please upload clear photos with a visible face.");
                }
                if (parsed.error === "poor_image_quality") {
                    throw new Error(parsed.message || "Image quality too low. Please upload clearer, well-lit photos.");
                }
                if (parsed.error) {
                    throw new Error(parsed.message || "Could not analyze your photos. Please try again with better images.");
                }

                const requiredFields = ['score', 'potential', 'jawline_score', 'cheekbones', 'skin_quality', 'dimorphism', 'eyes', 'facial_harmony'];
                const missingFields = requiredFields.filter(f => parsed[f] === undefined || parsed[f] === null);
                if (missingFields.length > 0) {
                    throw new Error("Incomplete analysis. Please try with clearer photos.");
                }

                setResult(parsed);
            } catch (parseError: any) {
                throw new Error(parseError.message || "Couldn't analyze the images. Make sure both photos show a clear face.");
            }
        } catch (error: any) {
            toast.error(error.message);
            console.error("Analysis error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="text-2xl font-[500]">Face Analysis</h1>
            <div className="max-w-6xl mx-auto mt-6 h-full w-full">
                {!result ? (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Front Photo */}
                            {(["front", "side"] as const).map((slot) => {
                                const preview = slot === "front" ? frontPreview : sidePreview;
                                const label = slot === "front" ? "Front-Facing Photo" : "Side-Facing Photo";
                                const desc = slot === "front" ? "Look directly at the camera" : "Turn 90° to show your profile";
                                return (
                                    <Card key={slot} className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <UploadIcon className="h-5 w-5" />
                                                {label}
                                            </CardTitle>
                                            <CardDescription>{desc}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="relative border border-dashed rounded-3xl p-8 text-center border-2 hover:border-white/50 transition-colors">
                                                {preview ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={preview}
                                                            alt={label}
                                                            className="mx-auto max-h-56 rounded-2xl object-contain"
                                                        />
                                                        <button
                                                            onClick={(e: any) => { e.stopPropagation(); resetSlot(slot); }}
                                                            className="absolute top-2 right-2 p-2 rounded-3xl bg-white shadow-sm hover:bg-gray-100 transition-colors"
                                                        >
                                                            <ArrowClockwiseIcon className="h-4 w-4 text-black" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="mx-auto bg-muted border border-border p-4 rounded-2xl w-max">
                                                            <FileIcon className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                                                        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — Max 5MB</p>
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleFile(slot)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <Button
                            onClick={handleAnalyse}
                            disabled={!frontFile || !sideFile || isLoading}
                            variant="outline"
                            className="w-full h-12"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <LoadingSpinner />
                                    Analyzing both photos...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Analyze My Face
                                    {(!frontFile || !sideFile) && <span className="text-xs text-muted-foreground ml-1">(upload both photos first)</span>}
                                </span>
                            )}
                        </Button>
                    </div>
                ) : (
                    <Card className="border-none">
                        <CardHeader className="border-b">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="sr-only">Your Facial Report</CardTitle>
                                    <h1>Your Facial Report</h1>
                                    <CardDescription>Generated from your front & side photos</CardDescription>
                                </div>
                                <Button variant="default" onClick={resetAll}>
                                    <ArrowCounterClockwiseIcon />
                                    Scan Again
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 pt-0">
                            {/* Share buttons */}
                            <div className="flex w-full justify-between mt-4">
                                <Button variant={"outline"}>
                                    <DownloadCloudIcon />
                                    Download
                                </Button>
                                <div className="flex space-x-2 items-center">
                                    <Button variant="ghost" className="w-10" onClick={() => {
                                        const msg = `I just got my face rated and got a ${result.score} overall on ${window.location.href}, try it out!`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}><WhatsappLogoIcon className="size-6" /></Button>
                                    <Button variant="ghost" className="w-10" onClick={() => {
                                        const msg = `I just got my face rated and got a ${result.score} overall! Try it out: ${window.location.href}`;
                                        window.open(`https://www.instagram.com/share?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}><InstagramLogoIcon className="size-6" /></Button>
                                    <Button variant="ghost" className="w-10" onClick={() => {
                                        const msg = `I just got my face rated and got a ${result.score} overall on ${window.location.href}, try it out!`;
                                        navigator.clipboard.writeText(msg);
                                        toast.success('Copied to clipboard!');
                                    }}><Copy className="size-5" /></Button>
                                </div>
                            </div>

                            {/* Preview thumbnails */}
                            <div className="flex justify-center gap-4 w-full mt-4">
                                {frontPreview && (
                                    <div className="text-center">
                                        <Image alt="Front" width={90} height={90} className="rounded-2xl ring-2 ring-white object-cover" src={frontPreview} />
                                        <p className="text-xs text-muted-foreground mt-1">Front</p>
                                    </div>
                                )}
                                {sidePreview && (
                                    <div className="text-center">
                                        <Image alt="Side" width={90} height={90} className="rounded-2xl ring-2 ring-white object-cover" src={sidePreview} />
                                        <p className="text-xs text-muted-foreground mt-1">Side</p>
                                    </div>
                                )}
                            </div>

                            {/* PSL Scale */}
                            {result.psl_score != null && (() => {
                                const tier = getPslTier(result.psl_score);
                                const pslPct = ((result.psl_score - 1) / 7) * 100; // 1–8 mapped to 0–100%
                                return (
                                    <FadeIn delay={200}>
                                        <div className="mt-6 rounded-3xl p-6 bg-white/5 space-y-3">
                                            <div className="flex items-start justify-between flex-wrap gap-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">PSL Score</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold" style={{ color: tier.color }}>{result.psl_score.toFixed(1)}</span>
                                                        <span className="text-muted-foreground text-sm">/ 8.0</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg" style={{ color: tier.color }}>{tier.label}</p>
                                                    <p className="text-xs text-muted-foreground">{tier.sub}</p>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-3 rounded-full overflow-hidden bg-white/10">
                                                <div
                                                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${pslPct}%`, backgroundColor: tier.color }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>1.0 Subhuman</span>
                                                <span>4.5 Average</span>
                                                <span>8.0 Tera Chad</span>
                                            </div>
                                        </div>
                                    </FadeIn>
                                );
                            })()}

                            {/* Score metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 lg:grid-cols-4 gap-4 mb-8">
                            )}

                            {/* Most Attractive To */}
                            {result.racial_attraction && Object.keys(result.racial_attraction).length > 0 && (
                                <div className="space-y-4 mt-8">
                                    <div>
                                        <h3 className="font-medium">Most Attractive To</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Estimated attraction by demographic based on your facial features</p>
                                    </div>
                                    <div className="space-y-3">
                                        {(Object.entries(result.racial_attraction) as [string, number][])
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([race, pct], index) => (
                                                <div key={race} className="flex items-center gap-3">
                                                    <div className="w-5 text-xs text-muted-foreground text-right shrink-0">{index + 1}</div>
                                                    <div className="w-32 shrink-0"><span className="text-sm font-medium">{race}</span></div>
                                                    <div className="flex-1">
                                                        <Progress
                                                            value={pct}
                                                            className={`h-2.5 ${pct >= 70 ? '[&>*]:bg-[#34d399]' : pct >= 50 ? '[&>*]:bg-[#fdfd96]' : '[&>*]:bg-red-500'}`}
                                                        />
                                                    </div>
                                                    <div className="w-10 text-right text-sm font-semibold shrink-0">{pct}%</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
