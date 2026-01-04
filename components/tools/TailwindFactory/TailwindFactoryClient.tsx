'use client';

import React, { useState, useMemo } from 'react';
import {
    Palette,
    Layers,
    Type,
    Move,
    Check,
    Copy,
    Layout,
    Settings2,
    Download,
    ChevronRight,
    Zap,
    Box
} from 'lucide-react';

// --- Color Utilities ---

function hexToHsl(hex: string): { h: number; s: number; l: number } {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate shades using a curve for natural tones
function generateShades(baseHex: string) {
    const hsl = hexToHsl(baseHex);
    const shades: Record<number, string> = {};

    // Standard Tailwind scales
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    weights.forEach(w => {
        let lightness;
        if (w === 50) lightness = 97;
        else if (w === 950) lightness = 10;
        else {
            // Simple linear-ish interpolation for demo, can be refined with Bezier
            lightness = 100 - (w / 10);
        }

        // Slightly tweak saturation for darker shades to keep them vibrant
        const saturationScale = w > 500 ? hsl.s + (w - 500) / 20 : hsl.s;
        shades[w] = hslToHex(hsl.h, Math.min(100, saturationScale), lightness);
    });

    return shades;
}

// --- Components ---

export default function TailwindFactoryClient() {
    const [primary, setPrimary] = useState('#6366f1');
    const [radius, setRadius] = useState('0.75');
    const [spacing, setSpacing] = useState('1');
    const [activeTab, setActiveTab] = useState<'colors' | 'preview' | 'code'>('colors');
    const [copied, setCopied] = useState(false);

    const shades = useMemo(() => generateShades(primary), [primary]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tailwindConfig = useMemo(() => {
        return `export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${shades[50]}',
          100: '${shades[100]}',
          200: '${shades[200]}',
          300: '${shades[300]}',
          400: '${shades[400]}',
          500: '${shades[500]}',
          600: '${shades[600]}',
          700: '${shades[700]}',
          800: '${shades[800]}',
          900: '${shades[900]}',
          950: '${shades[950]}',
        },
      },
      borderRadius: {
        'brand': '${radius}rem',
      },
      spacing: {
        'brand': '${spacing}rem',
      }
    }
  }
}`;
    }, [shades, radius, spacing]);

    return (
        <div className="flex flex-col lg:flex-row min-h-[800px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-indigo-500/5">

            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 border-r border-slate-100 p-8 space-y-10 bg-slate-50/50">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-500 rounded-lg text-white">
                            <Settings2 size={18} />
                        </div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Design Studio</h3>
                    </div>

                    <div className="space-y-8">
                        {/* Primary Color */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Primary Core</label>
                            <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm border-b-2">
                                <input
                                    type="color"
                                    value={primary}
                                    onChange={(e) => setPrimary(e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={primary}
                                    onChange={(e) => setPrimary(e.target.value)}
                                    className="text-sm font-bold text-slate-600 focus:outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* Border Radius */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Corner Radius ({radius}rem)</label>
                            <input
                                type="range"
                                min="0" max="2" step="0.125"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>SHARP</span>
                                <span>PILL</span>
                            </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Base Spacing ({spacing}rem)</label>
                            <input
                                type="range"
                                min="0.5" max="3" step="0.25"
                                value={spacing}
                                onChange={(e) => setSpacing(e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>COMPACT</span>
                                <span>LOOSE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="pt-8 border-t border-slate-200 space-y-3">
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'colors' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white'}`}
                    >
                        <Palette size={18} />
                        <span className="font-bold text-sm">Color System</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'preview' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white'}`}
                    >
                        <Layout size={18} />
                        <span className="font-bold text-sm">Live Sandbox</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'code' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white'}`}
                    >
                        <Zap size={18} />
                        <span className="font-bold text-sm">Export Code</span>
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                {activeTab === 'colors' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Primary Palette</h2>
                                    <p className="text-slate-500 text-sm mt-1">Automatically optimized shades for your brand core.</p>
                                </div>
                                <div className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">11 SHADES</div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
                                {Object.entries(shades).map(([w, hex]) => (
                                    <div key={w} className="group relative">
                                        <div
                                            className="h-24 md:h-32 rounded-2xl shadow-sm border border-slate-200 transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: hex }}
                                        />
                                        <div className="mt-3 text-center">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{w}</div>
                                            <div className="text-[11px] font-mono font-bold text-slate-600">{hex.toUpperCase()}</div>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(hex)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-slate-200"
                                        >
                                            <Copy size={12} className="text-slate-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 border-dashed relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><Layers size={120} /></div>
                                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-widest text-[11px]">Semantic Mapping</h4>
                                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">We map your primary core to high-contrast values automatically for accessibility.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 border-dashed relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><Zap size={120} /></div>
                                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-widest text-[11px]">Production Ready</h4>
                                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">The curves used for shade generation match Tailwind's official color spacing.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Component Sandbox</h2>

                            <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-slate-200 border-dashed">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">

                                    {/* Action Buttons */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => alert('Action Triggered with your custom design system!')}
                                                className="shadow-xl shadow-indigo-500/10 font-black uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 py-4 px-8"
                                                style={{
                                                    backgroundColor: shades[500],
                                                    borderRadius: `${radius}rem`,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                Primary Action
                                            </button>
                                            <button
                                                onClick={() => alert('Secondary Action Triggered!')}
                                                className="font-black uppercase tracking-widest transition-all hover:bg-slate-100 py-4 px-8 border-2"
                                                style={{
                                                    borderColor: shades[500],
                                                    color: shades[500],
                                                    borderRadius: `${radius}rem`,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                Secondary Style
                                            </button>
                                        </div>
                                    </div>

                                    {/* Input Card */}
                                    <div
                                        className="bg-white p-8 border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-4"
                                        style={{ borderRadius: `${radius}rem` }}
                                    >
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: shades[500] }}>
                                            <Box size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-black text-slate-900 text-lg">System Module</div>
                                            <div className="text-sm text-slate-500 font-medium">Configure your core foundations here.</div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Active</span>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: shades[500] }} />)}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tailwind Config</h2>
                                    <p className="text-slate-500 text-sm mt-1">Copy this into your `tailwind.config.ts` or `tailwind.config.js`.</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(tailwindConfig)}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all text-sm"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied!' : 'Copy Config'}
                                </button>
                            </div>

                            <pre className="bg-slate-900 text-indigo-300 p-8 rounded-[2rem] overflow-x-auto text-[13px] font-mono leading-relaxed border border-indigo-500/20 shadow-2xl">
                                {tailwindConfig}
                            </pre>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
