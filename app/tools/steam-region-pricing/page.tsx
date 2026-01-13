import React from 'react';
import { Metadata } from 'next';
import SteamPricingClient from '@/components/tools/SteamPricing/SteamPricingClient';
import { Globe, TrendingDown, DollarSign, LayoutGrid } from 'lucide-react';
import ToolContentSection from '@/components/shared/ToolContentSection';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Steam Regional Price Checker | Global Game Comparison',
    description: 'Compare Steam game prices across Argentina, Turkey, USA, and Europe instantly. Visualize Purchasing Power Parity and find global deals.',
    keywords: 'steam price history, steamdb alternative, steam regional pricing, cheap steam games, steam turkey price, steam argentina price',
};

export default function SteamPricingPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="pt-32 pb-24 container-custom">
                <div className="max-w-5xl mx-auto px-4 mb-8">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { name: 'Steam Pricing Map', href: '/tools/steam-region-pricing' },
                        ]}
                    />
                </div>

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

            <ToolContentSection
                title="Understanding Steam Regional Pricing"
                intro="Steam games are not priced equally across the globe. Publishers set different prices for different regions based on local purchasing power, economic conditions, and currency stability. This tool helps you visualize these disparities, often revealing that a game costing $60 in the US might be sold for the equivalent of $30 or even $15 in other countries like Argentina, Turkey, or India."
                features={[
                    {
                        title: "Purchasing Power Parity (PPP)",
                        description: "Valve suggests pricing based on PPP, which means games are cheaper in countries with lower average incomes. This ensures fair access to entertainment globally, but creates significant price arbitrage opportunities."
                    },
                    {
                        title: "The 'Argentina' & 'Turkey' Effect",
                        description: "Historically, Argentina and Turkey had the lowest Steam prices due to currency devaluation. However, in late 2023, Steam switched these regions to USD pricing (LATAM-USD and MENA-USD) to stabilize revenue, significantly changing the global pricing landscape."
                    },
                    {
                        title: "Region Locking",
                        description: "To prevent abuse, Steam employs region locking. You typically cannot buy a game in a cheaper region and gift it to a more expensive one, nor can you easily switch your store region without a valid local payment method."
                    },
                    {
                        title: "Currency Conversion Realities",
                        description: "Our tool updates exchange rates daily. However, banks may charge foreign transaction fees, so the 'real' cost to you might be 2-3% higher than the raw conversion shown here."
                    }
                ]}
                howTo={[
                    "Enter the name of the game you want to check in the search bar above.",
                    "Select the correct game from the dropdown results.",
                    "View the map to see the price distribution relative to the US Base Price.",
                    "Check the 'League Table' to see a sorted list of the cheapest and most expensive countries.",
                    "Use the data to understand the global market value of the digital good."
                ]}
                faqs={[
                    {
                        question: "Why are games cheaper in some countries?",
                        answer: "Publishers lower prices in developing economies to maximize sales volume where disposable income is lower. If they charged US prices everywhere, they would sell very few copies in those regions."
                    },
                    {
                        question: "Can I use a VPN to buy games cheaper?",
                        answer: "Technically yes, but it violates Steam's Subscriber Agreement. Valve may ban accounts suspected of region-hopping to evade pricing restrictions. This tool is for educational and market research purposes only."
                    },
                    {
                        question: "How often is the price data updated?",
                        answer: "We query Steam's public APIs in real-time for game data, and update our currency exchange rates daily to ensure the converted values are accurate."
                    }
                ]}
            />
        </main>
    );
}
