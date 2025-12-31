'use client';

import { useState, useEffect } from 'react';
import {
    X,
    ChevronRight,
    Command as CommandIcon,
    Sparkles,
    MousePointer2,
    CheckCircle2
} from 'lucide-react';

interface TourStep {
    title: string;
    description: string;
    icon: any;
    position: string; // Tailwing classes for positioning
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Welcome to WebUtilsPro!",
        description: "Your all-in-one suite for professional developer tools. Let's take a quick look around.",
        icon: Sparkles,
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    },
    {
        title: "The Super Power: ⌘K",
        description: "Press ⌘K (or Ctrl+K) anywhere to instantly search and hop between 25+ tools.",
        icon: CommandIcon,
        position: "top-24 left-1/2 -translate-x-1/2"
    },
    {
        title: "Smart Navigation",
        description: "Browse tools by categories or use the sidebar to find exactly what you need.",
        icon: MousePointer2,
        position: "top-24 right-4 md:right-32"
    },
    {
        title: "AI-Powered Help",
        description: "Encounter an error? Our Smart Diagnostic system will help you fix it with AI.",
        icon: Sparkles,
        position: "bottom-32 right-4 md:right-32"
    }
];

export default function ProductTour() {
    const [step, setStep] = useState(-1);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const hasSeenTour = localStorage.getItem('webutilspro_tour_seen');
        if (!hasSeenTour) {
            // Delay start slightly for effect
            const timer = setTimeout(() => setStep(0), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const nextStep = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            completeTour();
        }
    };

    const completeTour = () => {
        localStorage.setItem('webutilspro_tour_seen', 'true');
        setStep(-1);
    };

    if (!isMounted || step === -1) return null;

    const currentStep = TOUR_STEPS[step];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={completeTour}
            />

            {/* Tooltip Card */}
            <div className={`absolute ${currentStep.position} w-full max-w-sm animate-in zoom-in-95 duration-500`}>
                <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden group">
                    {/* Animated background glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px] group-hover:bg-blue-600/30 transition-all duration-1000"></div>

                    <button
                        onClick={completeTour}
                        className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                            <currentStep.icon className="w-6 h-6 text-blue-400" />
                        </div>

                        <h3 className="text-xl font-black text-white mb-3 tracking-tight">
                            {currentStep.title}
                        </h3>

                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                            {currentStep.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                                {TOUR_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-blue-500' : 'w-2 bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                            >
                                {step === TOUR_STEPS.length - 1 ? (
                                    <>
                                        Finish <CheckCircle2 className="w-3.5 h-3.5" />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight className="w-3.5 h-3.5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
