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
import { toast } from "sonner";
import { ArrowLeft } from "@phosphor-icons/react";
import { PassThrough } from "stream";
import Height from "@/components/height";
import { PurchaseContext, UserContext } from "@/app/rootprovider";

export default function Page() {
    const [data, setData] = useState<any>(null);
    const [step, setStep] = useState(0);
    const [fade, setFade] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    const { user, setUser } = useContext<any>(UserContext);
    const { showPurchase, setShowPurchase } = useContext(PurchaseContext);

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


    const isValidSavedData = (data: any): boolean => {
        try {
            return (
                (data.gender === "male" || data.gender === "female") &&
                typeof data.currentHeight === "string" &&
                typeof data.currentWeight === "string" &&
                Number(data.age) >= 5 && Number(data.age) <= 120 &&
                typeof data.motherHeight === "string" &&
                typeof data.fatherHeight === "string" &&
                ["sedentary", "light", "moderate", "active", "very-active"].includes(data.activityLevel) &&
                Number(data.sleepingHours) >= 3 && Number(data.sleepingHours) <= 16 &&
                typeof data.footSize === "string" &&
                typeof data.ethnicity === "string" &&
                typeof data.dreamHeight === "string"
            );
        } catch {
            return false;
        }
    };

    // In your useEffect for loading data
    useEffect(() => {
        const loadSavedData = () => {
            try {
                const savedData = localStorage.getItem('heightCoachData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    if (isValidSavedData(parsedData)) {
                        console.log("Loaded valid saved data:", parsedData);
                        setSavedData(parsedData)
                        // Optional: Pre-fill form with validated data
                        // setFormData(parsedData); 
                    } else {
                        console.warn("Saved data failed validation");
                        localStorage.removeItem('heightCoachData'); // Clean invalid data
                    }
                }
            } catch (error) {
                console.error("Error loading saved data:", error);
            }
        };

        loadSavedData();
    }, [])

    const questions = [
        {
            title: "What is your gender?",
            content: (
                <div className="flex space-x-4">
                    <Button
                        variant={formData.gender === "male" ? "default" : "secondary"}
                        onClick={() => handleInputChange("gender", "male")}
                    >
                        Male
                    </Button>
                    <Button
                        variant={formData.gender === "female" ? "default" : "secondary"}
                        onClick={() => handleInputChange("gender", "female")}
                    >
                        Female
                    </Button>
                </div>
            ),
            validate: () => formData.gender !== "",
        },
        {
            title: "What is your current height?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="height-unit"
                            checked={formData.heightUnit === "metric"}
                            onCheckedChange={(checked) =>
                                handleInputChange("heightUnit", checked ? "metric" : "imperial")
                            }
                        />
                        <Label htmlFor="height-unit">
                            {formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}
                        </Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2 sm:w-[50%]">
                            <Input
                                type="number"
                                placeholder="Feet"
                                value={formData.currentHeightFeet}
                                onChange={(e) => handleInputChange("currentHeightFeet", e.target.value)}
                                min="0"
                            />
                            <Input
                                type="number"
                                placeholder="Inches"
                                value={formData.currentHeightInch}
                                onChange={(e) => handleInputChange("currentHeightInch", e.target.value)}
                                min="0"
                                max="11"
                            />
                        </div>
                    ) : (
                        <Input
                            type="number"
                            className="sm:w-[50%]"
                            placeholder="Centimeters"
                            value={formData.currentHeightCm}
                            onChange={(e) => handleInputChange("currentHeightCm", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.currentHeightFeet);
                    const inches = parseFloat(formData.currentHeightInch);
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const totalInches = feet * 12 + inches;
                    if (totalInches < 48 || totalInches > 84) {
                        // toast.error("Height should be between 4ft (48in) and 7ft (84in)");
                        return false;
                    }
                    return true;
                } else {
                    const cm = parseFloat(formData.currentHeightCm);
                    if (isNaN(cm)) return false;
                    if (cm < 120 || cm > 213) {
                        // toast.error("Height should be between 120cm and 213cm");
                        return false;
                    }
                    return true;
                }
            },
        },
        {
            title: "What is your current weight?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="weight-unit"
                            checked={formData.weightUnit === "metric"}
                            onCheckedChange={(checked) =>
                                handleInputChange("weightUnit", checked ? "metric" : "imperial")
                            }
                        />
                        <Label htmlFor="weight-unit">
                            {formData.weightUnit === "imperial" ? "Imperial (lbs)" : "Metric (kg)"}
                        </Label>
                    </div>
                    {formData.weightUnit === "imperial" ? (
                        <Input
                            type="number"
                            placeholder="Pounds"
                            className="sm:w-[50%]"
                            value={formData.currentWeightLbs}
                            onChange={(e) => handleInputChange("currentWeightLbs", e.target.value)}
                            min="0"
                        />
                    ) : (
                        <Input
                            type="number"
                            placeholder="Kilograms"
                            className="sm:w-[50%]"
                            value={formData.currentWeightKg}
                            onChange={(e) => handleInputChange("currentWeightKg", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.weightUnit === "imperial") {
                    const lbs = parseFloat(formData.currentWeightLbs);
                    if (isNaN(lbs)) return false;
                    if (lbs < 50 || lbs > 330) {
                        // toast.error("Weight should be between 50lbs and 330lbs");
                        return false;
                    }
                    return true;
                } else {
                    const kg = parseFloat(formData.currentWeightKg);
                    if (isNaN(kg)) return false;
                    if (kg < 22.7 || kg > 150) {
                        // toast.error("Weight should be between 22.7kg and 150kg");
                        return false;
                    }
                    return true;
                }
            },
        },
        {
            title: "How old are you?",
            content: (
                <Input
                    type="number"
                    placeholder="Age"
                    className="sm:w-[65vh] h-14"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    min="0"
                    max="120"
                />
            ),
            validate: () => {
                const age = parseInt(formData.age);
                if (isNaN(age)) return false;
                if (age < 5 || age > 120) {
                    //   toast.error("Age should be between 5 and 120");
                    return false;
                }
                return true;
            },
        },
        {
            title: "What is your mother's height?",
            content: (
                <div className="space-y-4 sm:w-[50%]">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="mother-height-unit"
                            checked={formData.heightUnit === "metric"}
                            onCheckedChange={(checked) =>
                                handleInputChange("heightUnit", checked ? "metric" : "imperial")
                            }
                        />
                        <Label htmlFor="mother-height-unit">
                            {formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}
                        </Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Feet"
                                value={formData.motherHeightFeet}
                                onChange={(e) => handleInputChange("motherHeightFeet", e.target.value)}
                                min="0"
                            />
                            <Input
                                type="number"
                                placeholder="Inches"
                                value={formData.motherHeightInch}
                                onChange={(e) => handleInputChange("motherHeightInch", e.target.value)}
                                min="0"
                                max="11"
                            />
                        </div>
                    ) : (
                        <Input
                            type="number"
                            placeholder="Centimeters"
                            value={formData.motherHeightCm}
                            onChange={(e) => handleInputChange("motherHeightCm", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.motherHeightFeet);
                    const inches = parseFloat(formData.motherHeightInch);
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const totalInches = feet * 12 + inches;
                    if (totalInches < 48 || totalInches > 84) {
                        // toast.error("Height should be between 4ft (48in) and 7ft (84in)");
                        return false;
                    }
                    return true;
                } else {
                    const cm = parseFloat(formData.motherHeightCm);
                    if (isNaN(cm)) return false;
                    if (cm < 120 || cm > 213) {
                        // toast.error("Height should be between 120cm and 213cm");
                        return false;
                    }
                    return true;
                }
            },
        },
        {
            title: "What is your father's height?",
            content: (
                <div className="space-y-4 sm:w-[50%]">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="father-height-unit"
                            checked={formData.heightUnit === "metric"}
                            onCheckedChange={(checked) =>
                                handleInputChange("heightUnit", checked ? "metric" : "imperial")
                            }
                        />
                        <Label htmlFor="father-height-unit">
                            {formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}
                        </Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Feet"
                                value={formData.fatherHeightFeet}
                                onChange={(e) => handleInputChange("fatherHeightFeet", e.target.value)}
                                min="0"
                            />
                            <Input
                                type="number"
                                placeholder="Inches"
                                value={formData.fatherHeightInch}
                                onChange={(e) => handleInputChange("fatherHeightInch", e.target.value)}
                                min="0"
                                max="11"
                            />
                        </div>
                    ) : (
                        <Input
                            type="number"
                            placeholder="Centimeters"
                            value={formData.fatherHeightCm}
                            onChange={(e) => handleInputChange("fatherHeightCm", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.fatherHeightFeet);
                    const inches = parseFloat(formData.fatherHeightInch);
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const totalInches = feet * 12 + inches;
                    if (totalInches < 48 || totalInches > 84) {
                        // toast.error("Height should be between 4ft (48in) and 7ft (84in)");
                        return false;
                    }
                    return true;
                } else {
                    const cm = parseFloat(formData.fatherHeightCm);
                    if (isNaN(cm)) return false;
                    if (cm < 120 || cm > 213) {
                        // toast.error("Height should be between 120cm and 213cm");
                        return false;
                    }
                    return true;
                }
            },
        },
        {
            title: "What is your activity level?",
            content: (
                <div className="flex flex-col space-y-2 sm:w-[65vh]">
                    <Button
                        variant={formData.activityLevel === "sedentary" ? "default" : "secondary"}
                        onClick={() => handleInputChange("activityLevel", "sedentary")}
                    >
                        Sedentary (little or no exercise)
                    </Button>
                    <Button
                        variant={formData.activityLevel === "light" ? "default" : "secondary"}
                        onClick={() => handleInputChange("activityLevel", "light")}
                    >
                        Light (exercise 1-3 days/week)
                    </Button>
                    <Button
                        variant={formData.activityLevel === "moderate" ? "default" : "secondary"}
                        onClick={() => handleInputChange("activityLevel", "moderate")}
                    >
                        Moderate (exercise 3-5 days/week)
                    </Button>
                    <Button
                        variant={formData.activityLevel === "active" ? "default" : "secondary"}
                        onClick={() => handleInputChange("activityLevel", "active")}
                    >
                        Active (exercise 6-7 days/week)
                    </Button>
                    <Button
                        variant={formData.activityLevel === "very-active" ? "default" : "secondary"}
                        onClick={() => handleInputChange("activityLevel", "very-active")}
                    >
                        Very Active (hard exercise 6-7 days/week)
                    </Button>
                </div>
            ),
            validate: () => formData.activityLevel !== "",
        },
        {
            title: "How many hours do you sleep on average?",
            content: (
                <Input
                    type="number"
                    placeholder="Hours"
                    className="sm:w-[50%] h-14"
                    value={formData.sleepingHours}
                    onChange={(e) => handleInputChange("sleepingHours", e.target.value)}
                    min="0"
                    max="24"
                    step="0.5"
                />
            ),
            validate: () => {
                const hours = parseFloat(formData.sleepingHours);
                if (isNaN(hours)) return false;
                if (hours < 3 || hours > 16) {
                    //   toast.error("Sleeping hours should be between 3 and 16");
                    return false;
                }
                return true;
            },
        },
        {
            title: "What is your foot size?",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="foot-size-unit"
                            checked={formData.footSizeUnit === "eu"}
                            onCheckedChange={(checked) =>
                                handleInputChange("footSizeUnit", checked ? "eu" : "us")
                            }
                        />
                        <Label htmlFor="foot-size-unit">
                            {formData.footSizeUnit === "us" ? "US Size" : "EU Size"}
                        </Label>
                    </div>
                    {formData.footSizeUnit === "us" ? (
                        <Input
                            type="number"
                            placeholder="US Size"
                            value={formData.footSizeUS}
                            onChange={(e) => handleInputChange("footSizeUS", e.target.value)}
                            min="0"
                        />
                    ) : (
                        <Input
                            type="number"
                            placeholder="EU Size"
                            value={formData.footSizeEU}
                            onChange={(e) => handleInputChange("footSizeEU", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.footSizeUnit === "us") {
                    const size = parseFloat(formData.footSizeUS);
                    if (isNaN(size)) return false;
                    if (size < 1 || size > 15) {
                        // toast.error("US foot size should be between 1 and 15");
                        return false;
                    }
                    return true;
                } else {
                    const size = parseFloat(formData.footSizeEU);
                    if (isNaN(size)) return false;
                    if (size < 30 || size > 50) {
                        // toast.error("EU foot size should be between 30 and 50");
                        return false;
                    }
                    return true;
                }
            },
        },
        {
            title: "What is your ethnicity?",
            content: (
                <Select
                    value={formData.ethnicity}
                    onValueChange={(value) => handleInputChange("ethnicity", value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
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
                        <Switch
                            id="dream-height-unit"
                            checked={formData.heightUnit === "metric"}
                            onCheckedChange={(checked) =>
                                handleInputChange("heightUnit", checked ? "metric" : "imperial")
                            }
                        />
                        <Label htmlFor="dream-height-unit">
                            {formData.heightUnit === "imperial" ? "Imperial (ft/in)" : "Metric (cm)"}
                        </Label>
                    </div>
                    {formData.heightUnit === "imperial" ? (
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Feet"
                                value={formData.dreamHeightFeet}
                                onChange={(e) => handleInputChange("dreamHeightFeet", e.target.value)}
                                min="0"
                            />
                            <Input
                                type="number"
                                placeholder="Inches"
                                value={formData.dreamHeightInch}
                                onChange={(e) => handleInputChange("dreamHeightInch", e.target.value)}
                                min="0"
                                max="11"
                            />
                        </div>
                    ) : (
                        <Input
                            type="number"
                            placeholder="Centimeters"
                            value={formData.dreamHeightCm}
                            onChange={(e) => handleInputChange("dreamHeightCm", e.target.value)}
                            min="0"
                        />
                    )}
                </div>
            ),
            validate: () => {
                if (formData.heightUnit === "imperial") {
                    const feet = parseFloat(formData.dreamHeightFeet);
                    const inches = parseFloat(formData.dreamHeightInch);
                    if (isNaN(feet)) return false;
                    if (inches < 0 || inches >= 12) return false;
                    const totalInches = feet * 12 + inches;
                    if (totalInches < 48 || totalInches > 84) {
                        // toast.error("Height should be between 4ft (48in) and 7ft (84in)");
                        return false;
                    }
                    return true;
                } else {
                    const cm = parseFloat(formData.dreamHeightCm);
                    if (isNaN(cm)) return false;
                    if (cm < 120 || cm > 213) {
                        // toast.error("Height should be between 120cm and 213cm");
                        return false;
                    }
                    return true;
                }
            },
        },
    ];

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleNext = () => {
        if (!questions[step].validate()) return;

        setFade(true);
        setTimeout(() => {
            setStep(step + 1);
            setFade(false);
        }, 300);
    };

    const handleBack = () => {
        setFade(true);
        setTimeout(() => {
            setStep(step - 1);
            setFade(false);
        }, 300);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && step < questions.length) {
                e.preventDefault();
                if (questions[step].validate()) {
                    setFade(true);
                    setTimeout(() => {
                        setStep(step + 1);
                        setFade(false);
                    }, 300);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [step, formData]); // Re-run when step or formData changes

    const handleSubmit = () => {


        // Prepare the final data object
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

        setData(finalData)
        localStorage.setItem('heightCoachData', JSON.stringify(finalData));
        console.log("Form Data:", finalData);
    };

    return (
        <div className="flex flex-col space-y-5 h-full w-full">


            <h1 className="text-2xl font-[500]">Height Coach</h1>

            {data && <Height data={data} />}
            {(savedData && !data) && (
                <div className="px-2 pr-4 py-2 rounded-2xl border border-border bg-secondary w-fit flex space-x-3 items-center   ">

                    <Button onClick={() => {
                        if (!user?.subscription) {
                            setShowPurchase(true);
                            return;
                        }

                        setData(savedData)

                    }} className="h-9">
                        Continue
                    </Button>
                    <span className="text-sm not-sm:text-xs not-sm:text-muted-foreground">You have saved data from a previous form</span>
                </div>
            )}

            {!data && !savedData && (
                <p className="text-white/75">Estimate your future height, find your dream height's odds, and maximise your potential.</p>
            )}
            {!data && <div className={`w-full p-6 bg-muted h-full rounded-3xl rounded-b-none border border-border transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
                {step < questions.length ? (
                    <>
                        <h2 className="text-xl font-medium mb-4">{questions[step].title}</h2>
                        {questions[step].content}

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="secondary"
                                onClick={handleBack}
                                disabled={step === 0}
                            >
                                <ArrowLeft weight="bold" />
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={handleNext}
                                disabled={!questions[step].validate()}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-medium mb-4">Review your information</h2>
                        <p className="text-muted-foreground">Our coach will use your information to calculate your estimated height</p>

                        <div className="flex justify-between mt-4">
                            <Button
                                variant="secondary"
                                onClick={handleBack}
                                disabled={step === 0}
                            >
                                <ArrowLeft weight="bold" />
                            </Button>
                            <Button
                                variant={"default"}
                                onClick={handleSubmit}

                            >
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </div>}
        </div>
    );
}