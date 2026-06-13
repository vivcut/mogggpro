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
import Image from "next/image";
import { PurchaseContext, UserContext } from "@/app/rootprovider";

async function stitchImages(file1: File, file2: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img1 = new window.Image();
        const img2 = new window.Image();
        let loadedCount = 0;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error("Failed to get canvas context"));

                const targetHeight = 800;
                const scale1 = targetHeight / img1.height;
                const scale2 = targetHeight / img2.height;

                const w1 = img1.width * scale1;
                const w2 = img2.width * scale2;

                canvas.width = w1 + w2;
                canvas.height = targetHeight;

                ctx.drawImage(img1, 0, 0, w1, targetHeight);
                ctx.drawImage(img2, w1, 0, w2, targetHeight);

                resolve(canvas.toDataURL('image/jpeg', 0.85));
            }
        };

        img1.onload = onImageLoad;
        img2.onload = onImageLoad;
        img1.onerror = reject;
        img2.onerror = reject;

        img1.src = URL.createObjectURL(file1);
        img2.src = URL.createObjectURL(file2);
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
            const combinedUri = await stitchImages(frontFile, sideFile);

            const response = await fetch('/api/ai/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert facial aesthetics analyst. Respond with ONLY a valid JSON object string. Do not include markdown fences or explanations.

                            Required format:
                            {"score":72,"potential":85,"jawline_score":68,"cheekbones":74,"skin_quality":80,"dimorphism":70,"eyes":76,"facial_harmony":73,"psl_score":5.2,"eye_color":"Brown","upper_eyelid_exposure":"None","canthal_tilt":"Positive","improvements":["Tip 1","Tip 2"],"racial_attraction":{"Asian":70,"Caucasian":60,"Black":50,"Hispanic":65,"Middle Eastern":55,"South Asian":50}}`
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "Analyze this face composite and output raw JSON schema structure." },
                                { type: "image_url", image_url: { url: combinedUri } }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server communication issue. Status code: ${response.status}`);
            }

            const data = await response.json();

            try {
                const rawResponse = typeof data.response === "string" ? data.response.trim() : "";
                if (!rawResponse) throw new Error("Empty processing token index value returned.");

                let cleanJson = rawResponse.replace(/```json|```/g, '').trim();
                const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
                if (jsonMatch) cleanJson = jsonMatch[0];

                const parsed = JSON.parse(cleanJson);
                if (parsed.error) throw new Error(parsed.message || "Failed model analysis parameters.");

                setResult(parsed);
            } catch (parseError: any) {
                throw new Error("Unable to parse alignment metrics. Make sure your eyes and jaw are visible.");
            }
        } catch (error: any) {
            toast.error(error.message);
            console.error("Analysis route exception:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="text-2xl font-[500]">Face Analysis</h1>
            <div className="mt-2 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-400">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>This may take <strong>1–2 minutes</strong> — we scan your images through multiple trained AI models and perform a deep facial analysis. Please don't close the page.</span>
            </div>
            <div className="max-w-6xl mx-auto mt-6 h-full w-full">
                {!result ? (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
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

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-3xl p-5 bg-white/5 space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Overall Score</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">{result.score}</span>
                                        <span className="text-muted-foreground text-sm">/ 100</span>
                                    </div>
                                    <Progress value={result.score} className="h-2 mt-2" />
                                </div>
                                <div className="rounded-3xl p-5 bg-white/5 space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Potential Score</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-green-400">{result.potential}</span>
                                        <span className="text-muted-foreground text-sm">/ 100</span>
                                    </div>
                                    <Progress value={result.potential} className="h-2 mt-2 [&>*]:bg-green-400" />
                                </div>
                            </div>

                            <div className="mt-6 rounded-3xl p-6 bg-white/5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Feature Breakdown</h3>
                                {[
                                    { label: "Jawline",         value: result.jawline_score },
                                    { label: "Cheekbones",      value: result.cheekbones },
                                    { label: "Skin Quality",    value: result.skin_quality },
                                    { label: "Dimorphism",      value: result.dimorphism },
                                    { label: "Eyes",            value: result.eyes },
                                    { label: "Facial Harmony",  value: result.facial_harmony },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-muted-foreground shrink-0">{label}</span>
                                        <div className="flex-1">
                                            <Progress
                                                value={value}
                                                className={`h-2 ${value >= 70 ? '[&>*]:bg-[#34d399]' : value >= 50 ? '[&>*]:bg-[#fdfd96]' : '[&>*]:bg-[#fb923c]'}`}
                                            />
                                        </div>
                                        <span className="w-10 text-right text-sm font-semibold shrink-0">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {result.psl_score != null && (() => {
                                const tier = getPslTier(result.psl_score);
                                return (
                                    <div className="mt-6 rounded-3xl p-6 bg-white/5 space-y-3">
                                        <div className="flex items-start justify-between flex-wrap gap-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">PSL Score</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-bold" style={{ color: tier.color }}>{result.psl_score.toFixed(1)}</span>
                                                    <span className="text-muted-foreground text-sm">/ 8.0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}