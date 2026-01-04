import React from 'react';
import { Metadata } from 'next';
import SteamPricingClient from '@/components/tools/SteamPricing/SteamPricingClient';
import { Globe, TrendingDown, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Steam Regional Price Checker | Global Game Comparison',
    description: 'Compare Steam game prices across Argentina, Turkey, USA, and Europe instantly. Visualize Purchasing Power Parity and find global deals.',
    keywords: 'steam price history, steamdb alternative, steam regional pricing, cheap steam games, steam turkey price, steam argentina price',
};

export default function SteamPricingPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="pt-32 pb-24 container-custom">
                <div className="relative z-10 max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <Globe size={14} />
                        Global Market Analysis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        Steam <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient">Global Pricing</span> Map
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Games cost different amounts in different countries. We track the price of any Steam game across 30+ global regions to visualize the spread.
                    </p>
                </div>

                {/* Tool Interface */}
                <div id="pricing-explorer" className="relative z-10 mb-24">
                    <SteamPricingClient />
                </div>

                {/* SEO Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Live Currency Conversion</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            We automatically convert prices from Rubles, Lira, Yuan, and Rupees into USD so you can make direct apple-to-apple comparisons.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Find the Gap</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Discover the difference between "Tier 1" economies (USA, Zurich) and "Tier 3" pricing regions (LATAM, MENA) instantly.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">30+ Regions Tracked</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Our engine queries Steam endpoints for USA, UK, EU, Brazil, Turkey, Argentina, India, China, Russia, Japan and 20+ other countries.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
