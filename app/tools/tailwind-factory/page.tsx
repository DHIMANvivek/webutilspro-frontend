import React from 'react';
import { Metadata } from 'next';
import TailwindFactoryClient from '@/components/tools/TailwindFactory/TailwindFactoryClient';
import { Palette, Zap, Code2, Share2, ShieldCheck, Cpu } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Tailwind Design System Factory | Generate Palette & Config',
    description: 'Build complete Tailwind CSS design systems visually. Generate 50-950 color shades, configure spacing, radius, and export ready-to-use tailwind.config.ts.',
    keywords: 'tailwind config generator, color palette generator, tailwind css shades, design system studio, tailwind explorer',
};

export default function TailwindFactoryPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">


            <div className="pt-32 pb-24 container-custom relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center mb-20 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <Palette size={14} />
                        Professional Series
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        Tailwind <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-emerald-500 to-indigo-600 animate-gradient">Design Factory</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ultimate studio for engineering design systems. Visually build palettes, spacing, and radius anchors for your Next.js projects.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#factory-studio"
                            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:scale-105 transition-all text-sm group inline-block"
                        >
                            Start Designing <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
                        </a>
                    </div>
                </div>

                {/* Main Studio Area */}
                <div id="factory-studio" className="relative z-10 scroll-mt-24">
                    <TailwindFactoryClient />
                </div>

                {/* Professional Insights Section */}
                <div className="mt-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 w-fit mb-6">
                            <Cpu size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">Color DNA Engine</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Our proprietary algorithm calculates HSL step curves that mirror Tailwind's official scales, ensuring accessible and balanced UI foundations.
                        </p>
                    </div>
                    <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 w-fit mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">Zero-Code Config</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Export production-ready `tailwind.config.ts` modules. No more trial and error with hex values in your config files.
                        </p>
                    </div>
                    <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 w-fit mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">Theme Export</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Designed specifically for Shadcn/UI and modern Next.js architectures. Build once, deploy everywhere across your ecosystem.
                        </p>
                    </div>
                </div>

                {/* FAQ / Info Section for SEO */}
                <div className="mt-32 max-w-4xl mx-auto px-4 prose prose-slate prose-lg text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 border-l-4 border-emerald-500 pl-6 uppercase tracking-tight">Technical Deep-Dive</h2>

                    <div className="space-y-12">
                        <div>
                            <h4 className="font-black text-slate-800 mb-2">How are the Tailwind shades calculated?</h4>
                            <p className="text-slate-600">
                                Most color generators use simple linear transparency, which leads to "muddy" colors. Our generator uses a non-linear HSL lightness curve combined with adaptive saturation shifts. This keeps the 500-900 range vibrant and the 50-400 range clean and usable for backgrounds.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-slate-800 mb-2">Is this compatible with Tailwind v3?</h4>
                            <p className="text-slate-600">
                                Yes, it generates standard ESM/TypeScript modules that can be dropped directly into Tailwind v3 projects. It also supports custom spacing and border-radius extensions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
