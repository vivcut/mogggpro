"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "@phosphor-icons/react";
import Height from "@/components/height";
import { PurchaseContext, UserContext } from "@/app/rootprovider";

export default function Page() {
    const [data, setData] = useState<any>(null);
    const [step, setStep] = useState(0);
    const [fade, setFade] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    const { user } = useContext<any>(UserContext);
    const { setShowPurchase } = useContext(PurchaseContext);

    const [formData, setFormData] = useState({
        gender: "",
        currentHeightFeet: "",
        currentHeightInch: "",
        currentHeightCm: "",
        heightUnit: "imperial",
        currentWeightLbs: "",
        currentWeightKg: "",
        weightUnit: "imperial",
        age: "",
        motherHeightFeet: "",
        motherHeightInch: "",
        motherHeightCm: "",
        fatherHeightFeet: "",
        fatherHeightInch: "",
        fatherHeightCm: "",
        activityLevel: "",
        sleepingHours: "",
        footSizeUS: "",
        footSizeEU: "",
        footSizeUnit: "us",
        ethnicity: "",
        dreamHeightFeet: "",
        dreamHeightInch: "",
        dreamHeightCm: "",
    });

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isValidSavedData = (d: any): boolean => {
        try {
            return (
                (d.gender === "male" || d.gender === "female") &&
                typeof d.currentHeight === "string" &&
                typeof d.currentWeight === "string" &&
                Number(d.age) >= 5 && Number(d.age) <= 120 &&
                typeof d.motherHeight === "string" &&
                typeof d.fatherHeight === "string" &&
                ["sedentary", "light", "moderate", "active", "very-active"].includes(d.activityLevel) &&
                Number(d.sleepingHours) >= 3 && Number(d.sleepingHours) <= 16 &&
                typeof d.footSize === "string" &&
                typeof d.ethnicity === "string" &&
                typeof d.dreamHeight === "string"
            );
        } catch {
            return false;
        }
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("heightCoachData");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (isValidSavedData(parsed)) {
                    setSavedData(parsed);
                } else {
                    localStorage.removeItem("heightCoachData");
                }
            }
        } catch { /* ignore */ }
    }, []);

    const questions = [
        {
            title: "What is your gender?",
            content: (
                <div className="flex space-x-4">
                    <Button variant={formData.gender === "male" ? "default" : "secondary"} onClick={() => handleInputChange("gender", "male")}>Male</Button>
                    <Button variant={formData.gender === "female" ? "default" : "secondary"} onClick={() => handleInputChange("gender", "female")}>Female</Button>
                </div>
            ),
            validate: () => formData.gender !== "",
        },
        {
            title: "What is your current height?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="height-unit" checked={formData.heightUnit === "metric"} onCheckedChange={(c) => handleInputChange("heightUnit", c ? "metric" : "imperial")} />
                        <Label htmlFor="height-unit">{formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}</Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2 sm:w-[50%]">
                            <Input type="number" placeholder="Feet" value={formData.currentHeightFeet} onChange={(e) => handleInputChange("currentHeightFeet", e.target.value)} min="0" />
                            <Input type="number" placeholder="Inches" value={formData.currentHeightInch} onChange={(e) => handleInputChange("currentHeightInch", e.target.value)} min="0" max="11" />
                        </div>
                    ) : (
                        <Input type="number" className="sm:w-[50%]" placeholder="Centimeters" value={formData.currentHeightCm} onChange={(e) => handleInputChange("currentHeightCm", e.target.value)} min="0" />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.currentHeightFeet);
                    const inches = parseFloat(formData.currentHeightInch) || 0;
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const total = feet * 12 + inches;
                    return total >= 48 && total <= 84;
                } else {
                    const cm = parseFloat(formData.currentHeightCm);
                    if (isNaN(cm)) return false;
                    return cm >= 120 && cm <= 213;
                }
            },
        },
        {
            title: "What is your current weight?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="weight-unit" checked={formData.weightUnit === "metric"} onCheckedChange={(c) => handleInputChange("weightUnit", c ? "metric" : "imperial")} />
                        <Label htmlFor="weight-unit">{formData.weightUnit === "imperial" ? "Imperial (lbs)" : "Metric (kg)"}</Label>
                    </div>
                    {formData.weightUnit === "imperial" ? (
                        <Input type="number" placeholder="Pounds" className="sm:w-[50%]" value={formData.currentWeightLbs} onChange={(e) => handleInputChange("currentWeightLbs", e.target.value)} min="0" />
                    ) : (
                        <Input type="number" placeholder="Kilograms" className="sm:w-[50%]" value={formData.currentWeightKg} onChange={(e) => handleInputChange("currentWeightKg", e.target.value)} min="0" />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.weightUnit === "imperial") {
                    const lbs = parseFloat(formData.currentWeightLbs);
                    if (isNaN(lbs)) return false;
                    return lbs >= 50 && lbs <= 330;
                } else {
                    const kg = parseFloat(formData.currentWeightKg);
                    if (isNaN(kg)) return false;
                    return kg >= 22.7 && kg <= 150;
                }
            },
        },
        {
            title: "How old are you?",
            content: (
                <Input type="number" placeholder="Age" className="sm:w-[65vh] h-14" value={formData.age} onChange={(e) => handleInputChange("age", e.target.value)} min="0" max="120" />
            ),
            validate: () => {
                const age = parseInt(formData.age);
                return !isNaN(age) && age >= 5 && age <= 120;
            },
        },
        {
            title: "What is your mother's height?",
            content: (
                <div className="space-y-4 sm:w-[50%]">
                    <div className="flex items-center space-x-2">
                        <Switch id="mother-height-unit" checked={formData.heightUnit === "metric"} onCheckedChange={(c) => handleInputChange("heightUnit", c ? "metric" : "imperial")} />
                        <Label htmlFor="mother-height-unit">{formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}</Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input type="number" placeholder="Feet" value={formData.motherHeightFeet} onChange={(e) => handleInputChange("motherHeightFeet", e.target.value)} min="0" />
                            <Input type="number" placeholder="Inches" value={formData.motherHeightInch} onChange={(e) => handleInputChange("motherHeightInch", e.target.value)} min="0" max="11" />
                        </div>
                    ) : (
                        <Input type="number" placeholder="Centimeters" value={formData.motherHeightCm} onChange={(e) => handleInputChange("motherHeightCm", e.target.value)} min="0" />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.motherHeightFeet);
                    const inches = parseFloat(formData.motherHeightInch) || 0;
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const total = feet * 12 + inches;
                    return total >= 48 && total <= 84;
                } else {
                    const cm = parseFloat(formData.motherHeightCm);
                    if (isNaN(cm)) return false;
                    return cm >= 120 && cm <= 213;
                }
            },
        },
        {
            title: "What is your father's height?",
            content: (
                <div className="space-y-4 sm:w-[50%]">
                    <div className="flex items-center space-x-2">
                        <Switch id="father-height-unit" checked={formData.heightUnit === "metric"} onCheckedChange={(c) => handleInputChange("heightUnit", c ? "metric" : "imperial")} />
                        <Label htmlFor="father-height-unit">{formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}</Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input type="number" placeholder="Feet" value={formData.fatherHeightFeet} onChange={(e) => handleInputChange("fatherHeightFeet", e.target.value)} min="0" />
                            <Input type="number" placeholder="Inches" value={formData.fatherHeightInch} onChange={(e) => handleInputChange("fatherHeightInch", e.target.value)} min="0" max="11" />
                        </div>
                    ) : (
                        <Input type="number" placeholder="Centimeters" value={formData.fatherHeightCm} onChange={(e) => handleInputChange("fatherHeightCm", e.target.value)} min="0" />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.fatherHeightFeet);
                    const inches = parseFloat(formData.fatherHeightInch) || 0;
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const total = feet * 12 + inches;
                    return total >= 48 && total <= 84;
                } else {
                    const cm = parseFloat(formData.fatherHeightCm);
                    if (isNaN(cm)) return false;
                    return cm >= 120 && cm <= 213;
                }
            },
        },
        {
            title: "What is your activity level?",
            content: (
                <div className="flex flex-col space-y-2 sm:w-[65vh]">
                    {[
                        { val: "sedentary", label: "Sedentary (little or no exercise)" },
                        { val: "light", label: "Light (exercise 1-3 days/week)" },
                        { val: "moderate", label: "Moderate (exercise 3-5 days/week)" },
                        { val: "active", label: "Active (exercise 6-7 days/week)" },
                        { val: "very-active", label: "Very Active (hard exercise 6-7 days/week)" },
                    ].map(({ val, label }) => (
                        <Button key={val} variant={formData.activityLevel === val ? "default" : "secondary"} onClick={() => handleInputChange("activityLevel", val)}>{label}</Button>
                    ))}
                </div>
            ),
            validate: () => formData.activityLevel !== "",
        },
        {
            title: "How many hours do you sleep on average?",
            content: (
                <Input type="number" placeholder="Hours" className="sm:w-[50%] h-14" value={formData.sleepingHours} onChange={(e) => handleInputChange("sleepingHours", e.target.value)} min="0" max="24" step="0.5" />
            ),
            validate: () => {
                const hours = parseFloat(formData.sleepingHours);
                return !isNaN(hours) && hours >= 3 && hours <= 16;
            },
        },
        {
            title: "What is your foot size?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="foot-size-unit" checked={formData.footSizeUnit === "eu"} onCheckedChange={(c) => handleInputChange("footSizeUnit", c ? "eu" : "us")} />
                        <Label htmlFor="foot-size-unit">{formData.footSizeUnit === "us" ? "US Size" : "EU Size"}</Label>
                    </div>
                    {formData.footSizeUnit === "us" ? (
                        <Input type="number" placeholder="US Size" value={formData.footSizeUS} onChange={(e) => handleInputChange("footSizeUS", e.target.value)} min="0" />
                    ) : (
                        <Input type="number" placeholder="EU Size" value={formData.footSizeEU} onChange={(e) => handleInputChange("footSizeEU", e.target.value)} min="0" />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.footSizeUnit === "us") {
                    const size = parseFloat(formData.footSizeUS);
                    return !isNaN(size) && size >= 1 && size <= 15;
                } else {
                    const size = parseFloat(formData.footSizeEU);
                    return !isNaN(size) && size >= 30 && size <= 50;
                }
            },
        },
        {
            title: "What is your ethnicity?",
            content: (
                <Select value={formData.ethnicity} onValueChange={(v) => handleInputChange("ethnicity", v)}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select ethnicity" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="white">White/Caucasian</SelectItem>
                        <SelectItem value="african">African/Black</SelectItem>
                        <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                        <SelectItem value="pacific-islander">Indigenous</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                </Select>
            ),
            validate: () => formData.ethnicity !== "",
        },
        {
            title: "What is your dream height?",
            content: (
                <div className="space-y-4 sm:w-[50%]">
                    <div className="flex items-center space-x-2">
                        <Switch id="dream-height-unit" checked={formData.heightUnit === "metric"} onCheckedChange={(c) => handleInputChange("heightUnit", c ? "metric" : "imperial")} />
                        <Label htmlFor="dream-height-unit">{formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}</Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input type="number" placeholder="Feet" value={formData.dreamHeightFeet} onChange={(e) => handleInputChange("dreamHeightFeet", e.target.value)} min="0" />
                            <Input type="number" placeholder="Inches" value={formData.dreamHeightInch} onChange={(e) => handleInputChange("dreamHeightInch", e.target.value)} min="0" max="11" />
                        </div>
                    ) : (
                        <Input type="number" placeholder="Centimeters" value={formData.dreamHeightCm} onChange={(e) => handleInputChange("dreamHeightCm", e.target.value)} min="0" />
                    )}
                    <p className="text-xs text-muted-foreground">Must be taller than your current height</p>
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const dreamFeet = parseFloat(formData.dreamHeightFeet);
                    const dreamInches = parseFloat(formData.dreamHeightInch) || 0;
                    if (isNaN(dreamFeet) || dreamInches < 0 || dreamInches >= 12) return false;
                    const dreamTotal = dreamFeet * 12 + dreamInches;
                    if (dreamTotal < 48 || dreamTotal > 84) return false;
                    const curFeet = parseFloat(formData.currentHeightFeet);
                    const curInches = parseFloat(formData.currentHeightInch) || 0;
                    const curTotal = curFeet * 12 + curInches;
                    return dreamTotal > curTotal;
                } else {
                    const dreamCm = parseFloat(formData.dreamHeightCm);
                    if (isNaN(dreamCm) || dreamCm < 120 || dreamCm > 213) return false;
                    const curCm = parseFloat(formData.currentHeightCm);
                    return dreamCm > curCm;
                }
            },
        },
    ];

    const handleNext = () => {
        if (!questions[step].validate()) return;
        setFade(true);
        setTimeout(() => { setStep(step + 1); setFade(false); }, 300);
    };

    const handleBack = () => {
        setFade(true);
        setTimeout(() => { setStep(step - 1); setFade(false); }, 300);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Enter" && step < questions.length) {
                e.preventDefault();
                if (questions[step].validate()) {
                    setFade(true);
                    setTimeout(() => { setStep(step + 1); setFade(false); }, 300);
                }
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [step, formData]);

    const handleSubmit = () => {
        const finalData = {
            gender: formData.gender,
            currentHeight: formData.heightUnit === "imperial"
                ? `${formData.currentHeightFeet}'${formData.currentHeightInch}"`
                : `${formData.currentHeightCm} cm`,
            currentWeight: formData.weightUnit === "imperial"
                ? `${formData.currentWeightLbs} lbs`
                : `${formData.currentWeightKg} kg`,
            age: formData.age,
            motherHeight: formData.heightUnit === "imperial"
                ? `${formData.motherHeightFeet}'${formData.motherHeightInch}"`
                : `${formData.motherHeightCm} cm`,
            fatherHeight: formData.heightUnit === "imperial"
                ? `${formData.fatherHeightFeet}'${formData.fatherHeightInch}"`
                : `${formData.fatherHeightCm} cm`,
            activityLevel: formData.activityLevel,
            sleepingHours: formData.sleepingHours,
            footSize: formData.footSizeUnit === "us"
                ? `${formData.footSizeUS} US`
                : `${formData.footSizeEU} EU`,
            ethnicity: formData.ethnicity,
            dreamHeight: formData.heightUnit === "imperial"
                ? `${formData.dreamHeightFeet}'${formData.dreamHeightInch}"`
                : `${formData.dreamHeightCm} cm`,
        };

        if (!user?.subscription) {
            setShowPurchase(true);
            return;
        }

        setData(finalData);
        localStorage.setItem("heightCoachData", JSON.stringify(finalData));
    };

    return (
        <div className="flex flex-col space-y-5 h-full w-full">
            <h1 className="text-2xl font-[500]">Height Coach</h1>

            {data && <Height data={data} />}

            {savedData && !data && (
                <div className="px-2 pr-4 py-2 rounded-2xl border border-border bg-secondary w-fit flex space-x-3 items-center">
                    <Button onClick={() => {
                        if (!user?.subscription) { setShowPurchase(true); return; }
                        setData(savedData);
                    }} className="h-9">
                        Continue
                    </Button>
                    <span className="text-sm not-sm:text-xs not-sm:text-muted-foreground">You have saved data from a previous form</span>
                </div>
            )}

            {!data && (
                <div className={`w-full p-4 bg-muted rounded-3xl border border-border transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
                    {step < questions.length ? (
                        <>
                            <h2 className="text-xl font-medium mb-4">{questions[step].title}</h2>
                            {questions[step].content}
                            <div className="flex justify-between mt-6">
                                <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
                                    <ArrowLeft weight="bold" />
                                </Button>
                                <Button variant="outline" onClick={handleNext} disabled={!questions[step].validate()}>
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-medium mb-4">Review your information</h2>
                            <p className="text-muted-foreground">Our coach will use your information to calculate your estimated height</p>
                            <div className="flex justify-between mt-4">
                                <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
                                    <ArrowLeft weight="bold" />
                                </Button>
                                <Button variant="default" onClick={handleSubmit}>Submit</Button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {!data && (
                <div className="rounded-3xl bg-muted p-4 flex flex-col gap-3">
                    <p className="text-lg font-semibold">What you'll get</p>
                    <img src="/HIGH.png" alt="Height Coach Preview" className="w-full h-auto rounded-2xl object-contain" />
                    <div>
                        <p className="text-sm font-semibold">Height Prediction & Maximisation</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Using your genetics, age, weight, sleep, and activity level, we predict your adult height, calculate how close you are to your dream height, and give you personalised tips to maximise your growth potential.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
