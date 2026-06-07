"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowCounterClockwiseIcon, ArrowUp, Briefcase, BriefcaseIcon, Copy, Funnel, FunnelIcon, MaskHappy, MaskHappyIcon, MaskSadIcon, PaperPlaneIcon, PersonSimpleRunIcon, SprayBottleIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { fetchAI, fetchAIJson } from "@/lib/fetch";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Rainbow, Trash, X, Mic, MicOff, CheckCircle, Circle, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";
import { FunnelSimpleIcon, GenderFemaleIcon, GenderMale, GenderNeuterIcon, InstagramLogoIcon, OpenAiLogoIcon, Sparkle, TwitterLogoIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FadeIn from "react-fade-in";
import { Confetti } from '@neoconfetti/react';
import { Anybody } from "next/font/google";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PurchaseContext, UserContext } from "@/app/rootprovider";
import initialScenarios from "@/data/scenarios.json";

const RIZZ_WORDS = [
    "That's actually really interesting",
    "I feel like we'd get along",
    "You seem like trouble in the best way",
    "Okay you've got my attention",
    "I wasn't expecting that but I like it",
    "You intrigue me",
    "I can't tell if you're serious or flirting",
    "That's a bold move — I respect it",
    "You're trouble, aren't you",
    "Tell me more",
];

export default function Page() {
    // Use a fixed initial scenario to avoid SSR/client Math.random() mismatch
    const [currentScenario, setCurrentScenario] = useState<any>(initialScenarios[0]);
    const [score, setScore] = useState(0);
    
    const [responses, setResponses] = useState<any>([]);
    const [userResponse, setUserResponse] = useState("");
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [evaluationText, setEvaluationText] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState("female");
    const [selectedPersonality, setSelectedPersonality] = useState("extroverted");
    const [isListening, setIsListening] = useState(false);
    // Full conversation mode
    const [convMode, setConvMode] = useState<"full" | "1liner">("full");
    const [convMessages, setConvMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
    const [dateAgreed, setDateAgreed] = useState(false);
    const [socialExchanged, setSocialExchanged] = useState(false);
    const [convFailed, setConvFailed] = useState(false);
    const [convWon, setConvWon] = useState(false);
    const [convReport, setConvReport] = useState<string>("");
    const [convInput, setConvInput] = useState("");

    const { user, setUser } = useContext<any>(UserContext);
    const { showPurchase, setShowPurchase } = useContext(PurchaseContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom whenever messages change or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [convMessages, loading]);

    // Randomize scenario after hydration to avoid SSR mismatch
    useEffect(() => {
        const filtered = initialScenarios.filter((s) =>
            s.gender === selectedGender && s.personality === selectedPersonality
        );
        const pool = filtered.length > 0 ? filtered : initialScenarios;
        setCurrentScenario(pool[Math.floor(Math.random() * pool.length)]);
    }, []);

    // Voice-to-text using Web Speech API
    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => {
            setIsListening(false);
            toast.error("Voice input failed. Please try again.");
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserResponse((prev) => (prev ? prev + " " + transcript : transcript));
        };
        recognition.start();
    };

    // Full conversation mode — send message, get AI reply
    const sendConvMessage = async () => {
        if (!convInput.trim() || loading) return;
        if (!user?.subscription) { setShowPurchase(true); return; }

        const userMsg = convInput.trim();
        setConvInput("");
        const updatedMsgs = [...convMessages, { role: "user" as const, text: userMsg }];
        setConvMessages(updatedMsgs);
        setLoading(true);

        // Build conversation history as readable text (safe for all model versions)
        const seedHistory = currentScenario.messages.join("\n");
        const liveHistory = convMessages.map((m) => `${m.role === "user" ? "You" : currentScenario.name}: ${m.text}`).join("\n");
        const fullHistory = [seedHistory, liveHistory].filter(Boolean).join("\n");

        const raw = await fetchAI([
            {
                role: "system",
                content: `You are roleplaying as ${currentScenario.name}, a ${currentScenario.age}-year-old ${currentScenario.job}. Personality: ${currentScenario.personality}. Traits: ${currentScenario.traits}. Enjoys: ${currentScenario.hobbies}.

Reply the way a real person texts on a dating app — short (1–3 sentences), lowercase, occasional emoji, flirty but realistic.

Conversation so far:
${fullHistory}
You: ${userMsg}

Evaluate these signals:
- date_agreed: true ONLY if the user clearly asked you on a date and you genuinely agree (must feel earned, not assumed).
- social_exchanged: true ONLY if the user asked for your social media handle and you are happy to share it.
- conversation_failed: true ONLY if the user has been rude, very boring, or you have genuinely lost interest after several messages.

Default all to false unless clearly triggered.

You MUST reply with ONLY a JSON object, no markdown:
{"reply":"<your short text reply>","date_agreed":<true|false>,"social_exchanged":<true|false>,"conversation_failed":<true|false>}`,
            },
            { role: "user", content: userMsg },
        ]);

        setLoading(false);

        let aiResult: { reply: string; date_agreed: boolean; social_exchanged: boolean; conversation_failed: boolean } | null = null;
        try {
            const cleaned = raw.replace(/```json|```/g, "").trim();
            aiResult = JSON.parse(cleaned);
        } catch {
            // fallback: treat raw as plain reply
            aiResult = { reply: raw.trim() || "...", date_agreed: false, social_exchanged: false, conversation_failed: false };
        }

        if (!aiResult) {
            setConvMessages(prev => [...prev, { role: "ai", text: "..." }]);
            return;
        }

        const cleanReply = aiResult.reply?.trim() ?? "";
        setConvMessages(prev => [...prev, { role: "ai", text: cleanReply }]);

        if (aiResult.date_agreed && !dateAgreed) setDateAgreed(true);
        if (aiResult.social_exchanged && !socialExchanged) setSocialExchanged(true);
        if (aiResult.conversation_failed) { setConvFailed(true); return; }

        // Win condition
        const newDateAgreed = dateAgreed || aiResult.date_agreed;
        const newSocialExchanged = socialExchanged || aiResult.social_exchanged;
        if (newDateAgreed && newSocialExchanged && !convWon) {
            // Generate report — build readable history from seed + live messages
            const allMsgs = [
                ...currentScenario.messages.map((m: string) => m),
                ...updatedMsgs.map((m) => `${m.role === "user" ? "You" : currentScenario.name}: ${m.text}`),
            ].join("\n");
            setLoading(true);
            const report = await fetchAI([
                {
                    role: "system",
                    content: `You are a dating coach. Analyze this full conversation between a user and ${currentScenario.name} and write a short 3–4 sentence report on how well the user performed. Highlight what worked, what was charming, and one area to improve. Be encouraging and specific. Respond with plain text only.

Conversation:
${allMsgs}`,
                },
                { role: "user", content: "Give me my performance report." },
            ]);
            setLoading(false);
            setConvReport(report);
            setConvWon(true);
        }
    };

    const resetConv = () => {
        setConvMessages([]);
        setConvInput("");
        setDateAgreed(false);
        setSocialExchanged(false);
        setConvFailed(false);
        setConvWon(false);
        setConvReport("");
        setRandomScenario(selectedGender, selectedPersonality);
    };

    const setRandomScenario = (gender: string, personality: string) => {
        const filteredScenarios = initialScenarios.filter((scenario: any) =>
            (gender === "any" || scenario.gender === gender) &&
            (personality === "any" || scenario.personality === personality)
        );
        const randomIndex = Math.floor(Math.random() * filteredScenarios.length);
        setCurrentScenario(filteredScenarios[randomIndex]);
        setResponses([]);
    };

    const handleResponse = async () => {

        if(!user?.subscription) {
            setShowPurchase(true);
            return;
        }

        setLoading(true);
        const newHistory = [...responses];
        const fullMessages = currentScenario.messages ?
            currentScenario.messages.concat(newHistory.map(r => r.response)).join("\n") : "";

        const t = toast.loading("Analysing your response");

        const rawEval = await fetchAI([
            {
                role: "system",
                content: `You are a dating coach AI. Evaluate the user's reply in this dating chat.

Conversation: ${fullMessages}
Character traits: ${currentScenario.traits}, hobbies: ${currentScenario.hobbies}, personality: ${currentScenario.personality}, job: ${currentScenario.job}.

Score the user's reply on three dimensions (0-100 each):
- engagement_score: Is the reply flirty, witty, or emotionally engaging?
- forward_momentum_score: Does it keep the conversation going?
- personalization_score: Does it reference their hobbies, job, or personality?

Also write:
- feedback: 1-2 sentences of friendly coaching
- reply_example: How ${currentScenario.name} would realistically reply, in their voice (${currentScenario.traits}, ${currentScenario.personality}), 1-2 sentences

Respond ONLY with a valid JSON object, no markdown:
{"engagement_score":<0-100>,"forward_momentum_score":<0-100>,"personalization_score":<0-100>,"score":<0-100>,"feedback":"<string>","reply_example":"<string>"}`,
            },
            { role: "user", content: `My reply: ${userResponse}` },
        ]);

        toast.dismiss(t);

        let responseObject: any = null;
        try {
            const cleaned = rawEval.replace(/```json|```/g, "").trim();
            responseObject = JSON.parse(cleaned);
        } catch {
            // ignore parse error, responseObject stays null
        }

        if (!responseObject) {
            toast("Your response was inappropriate");
            setLoading(false);
            setUserResponse("");
            nextScenario();
            return;
        }

        // Ensure each sub-score is 0-100 and compute total as average
        const eng = Math.min(100, Math.max(0, Number(responseObject.engagement_score) || 0));
        const mom = Math.min(100, Math.max(0, Number(responseObject.forward_momentum_score) || 0));
        const per = Math.min(100, Math.max(0, Number(responseObject.personalization_score) || 0));
        const total = Math.round((eng + mom + per) / 3);

        const normalized = { ...responseObject, engagement_score: eng, forward_momentum_score: mom, personalization_score: per, score: total };

        setEvaluationText(normalized);
        setScore(total);
        setShowEvaluation(true);
        setDialogOpen(true);
        setLoading(false);
        setUserResponse("");






    };

    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && userResponse.trim()) {
            handleResponse();
        }
    };

    const nextScenario = () => {
        setShowEvaluation(false);
        setUserResponse("");
        setRandomScenario(selectedGender, selectedPersonality);
    };

    const resetGame = () => {
        setScore(0);
        setResponses([]);
        setShowEvaluation(false);
        setDialogOpen(false);
        setRandomScenario(selectedGender, selectedPersonality);
    };

    const handleGenderChange = (gender: string) => {
        setSelectedGender(gender);
        setRandomScenario(gender, selectedPersonality);
    };

    const handlePersonalityChange = (personality: string) => {
        setSelectedPersonality(personality);
        setRandomScenario(selectedGender, personality);
    };

    const fetchConversationStarters = async () => {
        if(!user?.subscription) {
            setShowPurchase(true);
            return;
        }
        setLoading(true);
        const newHistory = [...responses];
        const fullMessages = currentScenario.messages ?
            currentScenario.messages.concat(newHistory.map(r => r.response)).join("\n") : "";
        const t = toast.loading("Generating a response")
        const starters = await fetchAI([
            {
                role: "system",
                content: `Write a short, natural one-line response for a dating chat with ${currentScenario.gender} who's into ${currentScenario.hobbies} and works at/as '${currentScenario.job}', and the past chat has been: '${fullMessages}'. Keep it:

- Conversational (like something you'd actually say)
- Lightly flirty but not overbearing
- Slightly playful if it fits naturally
- Reference their hobbies if it flows
- No forced slang or internet speak
- No obvious pickup lines
- No quotation marks

Example good responses:
Those hiking photos must have some good stories behind them
You had me at landscape architect - got any secret spots?
I feel like you'd be dangerous with a paintbrush
So is the cooking skill as good as the food pics suggest?

Do not respond with anything but the your response, nothing else.`,
            },
        ]);
        setLoading(false);
        toast.dismiss(t);
        if (starters) {
            toast.success("Generated a response")
        }
        setUserResponse(starters ?? "");
    };

   
    return (
  <>{(showEvaluation && score >= 70) && <div className="absolute top-0 right-[50vw]">
      <Confetti particleCount={100} force={0.2} particleSize={8} destroyAfterDone />
  </div>}
      <div className="flex flex-col h-full p-4 md:p-0">

          <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
              <DialogTitle className="sr-only">Score</DialogTitle>
              <DialogContent className="flex flex-col p-12 w-[400px] h-[80vh] gap-6 overflow-y-auto">
                  <div className="flex w-full justify-between items-center">
                      <Rainbow className="size-8" />
                      <p className="border p-2 px-3 w-fit text-sm flex rounded-xl items-center flex space-x-2">
                          <OpenAiLogoIcon weight="bold" />
                          <span>Evaluation</span>
                      </p>
                  </div>
                  <p className="text-4xl font-semibold w-full">{score ?? 0}/100</p>
                  {showEvaluation && (
                      <DialogClose asChild>
                          <Button disabled={loading} className="glass" variant="outline" onClick={nextScenario}>
                              {loading ? <LoadingSpinner /> : <>Next Scenario</>}
                          </Button>
                      </DialogClose>
                  )}
                  <div className="flex flex-col gap-3 w-full max-w-md">
                      <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                  Engagement
                              </span>
                              <span className="text-sm font-medium">
                                  {evaluationText?.engagement_score}%
                              </span>
                          </div>
                          <Progress
                              value={evaluationText?.engagement_score}
                              className="[&>*]:bg-chart- h-2"
                          />
                      </div>

                      <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                  Forward Momentum
                              </span>
                              <span className="text-sm font-medium">
                                  {evaluationText?.forward_momentum_score}%
                              </span>
                          </div>
                          <Progress
                              value={evaluationText?.forward_momentum_score}
                              className="h-2"
                          />
                      </div>

                      <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                  Personalization
                              </span>
                              <span className="text-sm font-medium">
                                  {evaluationText?.personalization_score}%
                              </span>
                          </div>
                          <Progress
                              value={evaluationText?.personalization_score}
                              className="h-2"
                          />
                      </div>
                  </div>
                  
                  <div className="rounded-2xl p-6 bg-muted h-fit text-white/75 leading-6">
                      {evaluationText?.feedback ?? "Something went wrong"}
                  </div>

                  {evaluationText?.reply_example && (
                      <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">💬 {currentScenario.name}'s likely reply</p>
                          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 text-white/80 leading-6 italic text-sm">
                              "{evaluationText.reply_example}"
                          </div>
                      </div>
                  )}
              </DialogContent>
          </Dialog>

          {/* Win dialog */}
          <Dialog open={convWon} onOpenChange={() => {}}>
              <DialogTitle className="sr-only">You Won!</DialogTitle>
              <DialogContent className="flex flex-col p-10 w-[420px] gap-6">
                  {convWon && <Confetti particleCount={120} force={0.25} particleSize={8} destroyAfterDone />}
                  <div className="flex items-center gap-3">
                      <Trophy className="size-8 text-yellow-400" />
                      <h2 className="text-2xl font-bold">You did it! 🎉</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">You got a date <strong>and</strong> exchanged socials with {currentScenario.name}. Here's your performance report:</p>
                  <div className="rounded-2xl p-5 bg-muted text-white/80 leading-6 text-sm">
                      {loading ? <LoadingSpinner /> : convReport}
                  </div>
                  <Button onClick={resetConv} variant="outline">
                      <ArrowCounterClockwiseIcon weight="bold" />
                      Try Another
                  </Button>
              </DialogContent>
          </Dialog>

          {/* Fail dialog */}
          <Dialog open={convFailed} onOpenChange={() => {}}>
              <DialogTitle className="sr-only">Conversation Failed</DialogTitle>
              <DialogContent className="flex flex-col p-10 w-[420px] gap-6">
                  <div className="flex items-center gap-3">
                      <XCircle className="size-8 text-red-400" />
                      <h2 className="text-2xl font-bold">Lost the connection 😬</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentScenario.name} lost interest. It happens! Try a different approach next time.</p>
                  <Button onClick={resetConv} variant="outline">
                      <ArrowCounterClockwiseIcon weight="bold" />
                      Try Again
                  </Button>
              </DialogContent>
          </Dialog>

          <div className="flex-shrink-0 flex items-start w-full justify-between flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-[500]">Rizz Practice</h1>
                  <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${convMode === "1liner" ? "text-white" : "text-white/40"}`}>1-Liner</span>
                      <Switch
                          checked={convMode === "full"}
                          onCheckedChange={(v) => {
                              setConvMode(v ? "full" : "1liner");
                              if (v) resetConv();
                          }}
                      />
                      <span className={`text-xs font-medium ${convMode === "full" ? "text-white" : "text-white/40"}`}>Full Convo</span>
                  </div>
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                  <Dialog>
                      <DialogTitle className="sr-only">Filters</DialogTitle>
                      <DialogTrigger asChild disabled={loading}>
                          <div className="space-x-3 flex w-full md:w-auto cursor-pointer">
                              <Button disabled={loading} className="glass w-full md:w-auto pointer-events-none" variant="secondary">
                                  {selectedGender == "any" && <GenderNeuterIcon weight="bold" />}
                                  {selectedGender == "male" && <GenderMale weight="bold" />}
                                  {selectedGender == "female" && <GenderFemaleIcon weight="bold" />}
                                  {isMobile ? 'Filter' : selectedGender}
                              </Button>
                              <Button disabled={loading} className="glass w-full md:w-auto pointer-events-none" variant="secondary">
                                  {selectedPersonality == "introverted" ? <MaskSadIcon weight="bold" /> : <MaskHappyIcon weight="bold" />}
                                  {isMobile ? '' : selectedPersonality}
                              </Button>
                          </div>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col p-6 md:p-12 w-full md:w-[400px] h-[80vh] gap-6">
                          <h2 className="text-xl font-semibold">Select Filters</h2>
                          <div className="flex flex-col space-y-4">
                              <DialogClose className="flex w-full space-x-4">
                                  <Button variant={selectedGender == "male" ? "outline" : "secondary"} onClick={() => handleGenderChange("male")}>Male</Button>
                                  <Button variant={selectedGender == "female" ? "outline" : "secondary"} onClick={() => handleGenderChange("female")}>Female</Button>
                                  <Button variant={selectedGender == "any" ? "outline" : "secondary"} onClick={() => handleGenderChange("any")}>Any</Button>
                              </DialogClose>
                              <DialogClose className="flex w-full space-x-4">
                                  <Button variant={selectedPersonality == "extroverted" ? "outline" : "secondary"} onClick={() => handlePersonalityChange("extroverted")}>Extroverted</Button>
                                  <Button variant={selectedPersonality == "introverted" ? "outline" : "secondary"} onClick={() => handlePersonalityChange("introverted")}>Introverted</Button>
                                  <Button variant={selectedPersonality == "any" ? "outline" : "secondary"} onClick={() => handlePersonalityChange("any")}>Any</Button>
                              </DialogClose>
                          </div>
                      </DialogContent>
                  </Dialog>
              </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-6 mt-4 overflow-hidden">

              {/* ── FULL CONVERSATION MODE ── */}
              {convMode === "full" ? (
              <div className="border flex-1 min-h-0 flex flex-col rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div className="flex w-full justify-between bg-muted p-3 px-4 space-x-2">
                      <div className="flex space-x-2 items-center w-full">
                          <Avatar>
                              <AvatarFallback className="bg-background text-sm">{currentScenario.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm">{currentScenario?.name}</span>
                      </div>
                      <Button disabled={loading} className="h-9" variant="outline" onClick={resetConv}>
                          <ArrowCounterClockwiseIcon weight="bold" />
                          New
                      </Button>
                  </div>

                  {/* Checklists */}
                  <div className="flex gap-4 px-5 pt-4">
                      <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${dateAgreed ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-white/10 text-white/40"}`}>
                          {dateAgreed ? <CheckCircle className="size-3.5" /> : <Circle className="size-3.5" />}
                          Get a date
                      </div>
                      <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${socialExchanged ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-white/10 text-white/40"}`}>
                          {socialExchanged ? <CheckCircle className="size-3.5" /> : <Circle className="size-3.5" />}
                          Exchange socials
                      </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 min-h-0 flex flex-col space-y-3 p-5 overflow-y-auto">
                      {/* Seed messages */}
                      {currentScenario.messages && currentScenario.messages.map((msg: string, i: number) => (
                          <div key={i} className={`flex ${msg.startsWith("You:") ? "justify-end" : "justify-start"}`}>
                              <div className={`p-2.5 px-4 w-fit max-w-[80%] rounded-xl text-sm ${msg.startsWith("You:") ? "bg-white text-black rounded-tr-sm" : "bg-muted text-white rounded-tl-sm"}`}>
                                  {msg.replace(/^[^:]+:\s*/, "")}
                              </div>
                          </div>
                      ))}
                      {/* Live conv messages */}
                      {convMessages.map((m, i) => (
                          <FadeIn key={`conv-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`p-2.5 px-4 w-fit max-w-[80%] rounded-xl text-sm ${m.role === "user" ? "bg-white text-black rounded-tr-sm" : "bg-muted text-white rounded-tl-sm"}`}>
                                  {m.text}
                              </div>
                          </FadeIn>
                      ))}
                      {loading && (
                          <div className="flex justify-start">
                              <div className="bg-muted px-4 py-3 rounded-xl rounded-tl-sm text-sm text-white/50 flex items-center gap-2">
                                  <LoadingSpinner /> typing…
                              </div>
                          </div>
                      )}
                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex space-x-3 items-end p-4 border-t border-white/10">
                      <Textarea
                          disabled={loading}
                          placeholder={`Message ${currentScenario?.name}…`}
                          className="p-4 resize-none"
                          rows={2}
                          value={convInput}
                          onChange={(e) => setConvInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && convInput.trim()) { e.preventDefault(); sendConvMessage(); } }}
                      />
                      <div className="flex flex-col space-y-2">
                          <Button className="rounded-xl" disabled={loading || !convInput.trim()} variant="outline" onClick={sendConvMessage}>
                              {loading ? <LoadingSpinner /> : <PaperPlaneIcon weight="bold" />}
                          </Button>
                          <Button
                              disabled={loading}
                              variant={isListening ? "default" : "ghost"}
                              className={isListening ? "rounded-xl animate-pulse" : "rounded-xl"}
                              onClick={() => {
                                  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                  if (!SR) { toast.error("Voice not supported"); return; }
                                  const r = new SR(); r.lang = "en-US"; r.interimResults = false;
                                  r.onstart = () => setIsListening(true);
                                  r.onend = () => setIsListening(false);
                                  r.onerror = () => { setIsListening(false); toast.error("Voice failed"); };
                                  r.onresult = (ev: any) => setConvInput((p) => p ? p + " " + ev.results[0][0].transcript : ev.results[0][0].transcript);
                                  r.start();
                              }}
                          >
                              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                          </Button>
                      </div>
                  </div>
              </div>
              ) : (
              /* ── 1-LINER MODE (existing) ── */
              <div className="border w-full flex flex-col h-fit justify-between rounded-3xl space-y-4">
                  <div className="flex flex-col space-y-3">
                      <div className="flex w-full justify-between bg-muted rounded-t-3xl p-3 px-4 space-x-2">
                          <div className="flex space-x-2 items-center w-full">
                              <Avatar className="">
                                  <AvatarFallback className="bg-background text-sm">
                                      {currentScenario.name.substring(0, 2)}
                                  </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-sm">{currentScenario?.name}</span>
                          </div>
                          {!showEvaluation && <Button className="bg-white/5 hover:bg-white/15 text-white" disabled={loading} onClick={fetchConversationStarters}>
                              <OpenAiLogoIcon weight="regular" />
                              AI Help
                          </Button>}
                          <Button disabled={loading} className="h-9" variant="outline" onClick={resetGame}>
                              <ArrowCounterClockwiseIcon weight="bold" />
                              New
                          </Button>
                      </div>
                      <div className="p-8 px-4 flex flex-col w-full space-y-4">
                          {currentScenario.messages && currentScenario.messages.map((msg: any, index: any) => (
                              <FadeIn key={index} className={`w-full flex ${msg.startsWith("You:") ? "justify-end" : "justify-start"}`} delay={500 + 500 * (index + 1)}>
                                  <div
                                      className={`p-2.5 px-5 w-fit rounded-xl ${msg.startsWith("You:") ? "bg-white text-black self-end rounded-tr-sm" : "bg-muted text-white rounded-tl-sm"}`}>
                                      {msg.replace("You: ", "")}
                                  </div>
                              </FadeIn>
                          ))}
                      </div>
                  </div>
                  <div className="flex space-x-3 items-end p-4">
                      {showEvaluation ? <div className="w-full">
                          <Button onClick={() => setDialogOpen(true)} className="h-9">
                              <OpenAiLogoIcon weight="regular" />
                              Show Evaluation
                          </Button>
                      </div> : <Textarea
                          disabled={loading || showEvaluation}
                          placeholder={`Your response to ${currentScenario?.name}'s message`}
                          className="p-4"
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          onKeyPress={handleKeyPress}
                      />}
                      <div className="flex flex-col space-y-2">
                          <Button className="rounded-xl" disabled={loading || !userResponse.trim() || showEvaluation} variant={"outline"} onClick={handleResponse}>
                              {loading ? <LoadingSpinner /> : <PaperPlaneIcon weight="bold" />}
                          </Button>
                          {!showEvaluation && (
                              <Button
                                  disabled={loading}
                                  variant={isListening ? "default" : "ghost"}
                                  className={isListening ? "rounded-xl animate-pulse" : "rounded-xl"}
                                  onClick={startListening}
                                  title="Voice input"
                              >
                                  {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                              </Button>
                          )}
                          <Button disabled={loading || !userResponse.trim()} variant={"ghost"} onClick={() => {
                              setUserResponse("");
                              toast.info("Cleared your response");
                          }}>
                              <XIcon weight="bold" />
                          </Button>
                      </div>
                  </div>
              </div>
              )}

              {!isMobile && (
                  <div className="flex flex-col space-y-4 w-[300px] overflow-y-auto pb-2">
                      <div className="bg-muted w-full h-fit p-8 rounded-3xl space-y-3">
                          <h1 className="text-2xl font-semibold">{currentScenario.name}, {currentScenario.age}</h1>
                          <div className="flex flex-col items-start space-x-2">
                              <PersonSimpleRunIcon className="size-4" weight="bold" />
                              <span>{currentScenario.hobbies}</span>
                          </div>
                          <div className="flex flex-col items-start space-x-2">
                              <MaskHappy className="size-4" weight="bold" />
                              <span>{currentScenario.traits}</span>
                          </div>
                          <div className="flex flex-col items-start space-x-2">
                              <BriefcaseIcon className="size-4" weight="bold" />
                              <span>{currentScenario.job}</span>
                          </div>
                          <div className="flex flex-col items-start space-x-2">
                              <span className="text-sm px-2 py-1 rounded-sm bg-background text-white/75">{currentScenario.personality}</span>
                          </div>
                          {(showEvaluation) && <Button disabled={loading} className="glass" variant="outline" onClick={nextScenario}>
                              {loading ? <LoadingSpinner /> : <>Next Scenario</>}
                          </Button>}
                      </div>
                      {/* Rizz check words panel */}
                      <div className="bg-muted w-full h-fit p-6 rounded-3xl space-y-3">
                          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">✨ Rizz Phrases</h2>
                          <p className="text-xs text-white/40">Tap to insert into your reply</p>
                          <div className="flex flex-col space-y-2">
                              {RIZZ_WORDS.map((word) => (
                                  <button
                                      key={word}
                                      disabled={loading || showEvaluation}
                                      onClick={() => setUserResponse((prev) => prev ? `${prev} ${word}` : word)}
                                      className="text-left text-xs px-3 py-2 rounded-xl bg-background/60 hover:bg-background text-white/70 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                      {word}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {isMobile && (
                  <div className="bg-muted w-full h-fit p-6 rounded-3xl space-y-3">
                      <h1 className="text-xl font-semibold">{currentScenario.name}, {currentScenario.age}</h1>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                              <PersonSimpleRunIcon className="size-4" weight="bold" />
                              <span className="text-sm">{currentScenario.hobbies}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <MaskHappy className="size-4" weight="bold" />
                              <span className="text-sm">{currentScenario.traits}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <BriefcaseIcon className="size-4" weight="bold" />
                              <span className="text-sm">{currentScenario.job}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <span className="text-sm px-2 py-1 rounded-sm bg-background text-white/75">{currentScenario.personality}</span>
                          </div>
                      </div>
                      {(showEvaluation) && (
                          <Button disabled={loading} className="w-full mt-3" variant="outline" onClick={nextScenario}>
                              {loading ? <LoadingSpinner /> : <>Next Scenario</>}
                          </Button>
                      )}
                  </div>
              )}
          </div>
      </div>
  </>
);
}