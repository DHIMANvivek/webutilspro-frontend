'use client';

import { useState, useEffect, useRef } from 'react';
import {
    X,
    ChevronLeft,
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
    selector?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Welcome to WebUtilsPro!",
        description: "Your all-in-one suite for professional developer tools. Let's take a quick look around.",
        icon: Sparkles,
        position: 'center'
    },
    {
        title: "Dynamic Search: ⌘K",
        description: "Press ⌘K (or Ctrl+K) anywhere to instantly search and hop between 25+ tools.",
        icon: CommandIcon,
        selector: "#command-palette-trigger",
        position: 'bottom'
    },
    {
        title: "Smart Navigation",
        description: "Browse tools by categories or use the sidebar to find exactly what you need.",
        icon: MousePointer2,
        selector: "header",
        position: 'bottom'
    },
    {
        title: "Premium Tools",
        description: "Don't miss our MCP-powered tools for advanced integrations like WooCommerce.",
        icon: Sparkles,
        selector: "section:nth-of-type(2)", // Focus on MCP section
        position: 'top'
    }
];

interface ProductTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductTour({ isOpen, onClose }: ProductTourProps) {
    const [step, setStep] = useState(0);
    const [spotlight, setSpotlight] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const tourRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            return;
        }

        const currentStep = TOUR_STEPS[step];
        if (currentStep.selector) {
            const element = document.querySelector(currentStep.selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const updateSpotlight = () => {
                    const rect = element.getBoundingClientRect();
                    setSpotlight({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    });
                };
                // Wait for scroll to finish
                const timer = setTimeout(updateSpotlight, 500);
                window.addEventListener('resize', updateSpotlight);
                window.addEventListener('scroll', updateSpotlight);
                return () => {
                    clearTimeout(timer);
                    window.removeEventListener('resize', updateSpotlight);
                    window.removeEventListener('scroll', updateSpotlight);
                };
            } else {
                setSpotlight(null);
            }
        } else {
            setSpotlight(null);
        }
    }, [isOpen, step]);

    if (!isMounted || !isOpen) return null;

    const currentStep = TOUR_STEPS[step];

    const nextStep = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop with Hole (Spotlight) */}
            <div className="absolute inset-0 z-0 pointer-events-auto bg-slate-950/70 backdrop-blur-sm transition-all duration-500"
                style={spotlight ? {
                    clipPath: `polygon(
                        0% 0%, 
                        0% 100%, 
                        ${spotlight.left}px 100%, 
                        ${spotlight.left}px ${spotlight.top}px, 
                        ${spotlight.left + spotlight.width}px ${spotlight.top}px, 
                        ${spotlight.left + spotlight.width}px ${spotlight.top + spotlight.height}px, 
                        ${spotlight.left}px ${spotlight.top + spotlight.height}px, 
                        ${spotlight.left}px 100%, 
                        100% 100%, 
                        100% 0%
                    )`
                } : undefined}
                onClick={onClose}
            />

            {/* Tooltip Card */}
            <div
                className={`absolute pointer-events-auto transition-all duration-500 ease-out z-[101] w-[calc(100%-2rem)] md:w-full max-w-sm`}
                style={spotlight ? (
                    isMobile ? {
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    } : {
                        top: currentStep.position === 'bottom' ? spotlight.top + spotlight.height + 20 :
                            currentStep.position === 'top' ? spotlight.top - 320 : '50%',
                        left: spotlight.left + (spotlight.width / 2),
                        transform: `translateX(-50%) ${!spotlight ? 'translateY(-50%)' : ''}`,
                    }
                ) : {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden group animate-in zoom-in-95 duration-300">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px]"></div>

                    <button
                        onClick={onClose}
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
                                        className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-blue-500' : 'w-2 bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {step > 0 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                                >
                                    {step === TOUR_STEPS.length - 1 ? (
                                        <>Finish <CheckCircle2 className="w-3.5 h-3.5" /></>
                                    ) : (
                                        <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
