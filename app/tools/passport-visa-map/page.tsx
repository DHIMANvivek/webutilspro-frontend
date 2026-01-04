import React from 'react';
import { Metadata } from 'next';
import PassportMapClient from '@/components/tools/PassportMap/PassportMapClient';
import { Shield, Globe, Plane } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Passport Visa Free Countries Checker | Travel Freedom Map',
    description: 'Check visa requirements for any passport. See where you can travel visa-free, visa-on-arrival, or with an e-Visa. Updated for 2025.',
    keywords: 'visa requirements map, passport power rank, travel freedom checker, visa free countries',
};

export default function PassportMapPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="pt-32 pb-24 container-custom">
                <div className="relative z-10 max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <Plane size={14} />
                        Global Travel Freedom Index
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        Where Can You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient">Travel Now?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Discover your passport's true power. See exactly which countries grant you Visa-Free access, Visa-on-Arrival, or require a Consulate visit.
                    </p>
                </div>

                {/* Tool Interface */}
                <div id="passport-checker" className="relative z-10 mb-24">
                    <PassportMapClient />
                </div>

                {/* SEO Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <CheckCircle2Icon />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Visa Free Access</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Countries where you can just land and enter. No paperwork, no fees, just your passport.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <Plane size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Visa On Arrival</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Destinations that grant you a visa when you land at the airport, usually for a small fee.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Embassy Required</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Regions where you must apply for a visa at an embassy or consulate before you fly.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function CheckCircle2Icon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
    )
}
