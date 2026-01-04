'use client';

import React, { useState } from 'react';
import { Copy, Sparkles, Zap, Settings2, Info, CheckCircle2, LayoutGrid } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Animation {
    id: string;
    name: string;
    description: string;
    category: 'layout' | 'buttons' | 'text' | 'decor';
    html: (config: Config) => string;
}

interface Config {
    accentColor: string;
    speed: number;
    intensity: number;
    radius: number;
    scale: number;
    trigger: 'hover' | 'loop' | 'click';
    background: 'mesh' | 'grid' | 'dot' | 'dark' | 'none';
}

const ANIMATIONS: Animation[] = [
    {
        id: 'rotating-border',
        name: 'Glowy Border Hero',
        description: 'A professional rotating gradient border perfect for feature cards or CTA sections.',
        category: 'layout',
        html: (c) => {
            const isLoop = c.trigger === 'loop';
            const hoverScale = c.trigger === 'hover' ? `hover:scale-[${c.scale}]` : '';
            const borderRadius = `${c.radius}rem`;
            const innerRadius = `${Math.max(0, c.radius - 0.5)}rem`;

            return `
<div class="relative p-[2px] overflow-hidden group transition-all duration-500 ${hoverScale}" style="border-radius: ${borderRadius}">
  <div class="absolute inset-[-1000%] ${isLoop ? `animate-[spin_${c.speed}s_linear_infinite]` : 'opacity-0 group-hover:opacity-100 group-hover:animate-[spin_' + c.speed + 's_linear_infinite]'} transition-all duration-500" 
       style="background: conic-gradient(from 90deg at 50% 50%, #E2E8F0 0%, ${c.accentColor} 50%, #E2E8F0 100%)"></div>
  <div class="relative flex h-full w-full items-center justify-center bg-slate-950 px-8 py-10 shadow-inner" style="border-radius: ${innerRadius}">
    <span class="text-slate-200 font-medium tracking-tight">Premium Architecture</span>
  </div>
</div>`;
        }
    },
    {
        id: 'neon-ripple',
        name: 'Neon Pulse Button',
        description: 'A high-impact button with a subtle radiating pulse effect.',
        category: 'buttons',
        html: (c) => {
            const isLoop = c.trigger === 'loop';
            const borderRadius = `${c.radius}rem`;
            const pulseAnim = isLoop ? 'animate-pulse' : 'group-hover:animate-pulse';

            return `
<button class="relative inline-flex items-center px-10 py-5 bg-slate-950 text-white font-bold overflow-hidden group transition-all active:scale-95" 
        style="border-radius: ${borderRadius}; box-shadow: 0 0 ${c.intensity * 4}px ${c.accentColor}${Math.floor(c.intensity * 2.5).toString(16).padStart(2, '0')}">
  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background-color: ${c.accentColor}"></div>
  <div class="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${pulseAnim}" style="background-color: ${c.accentColor}"></div>
  <span class="relative z-10">Launch Project</span>
</button>`;
        }
    },
    {
        id: 'shimmer-text',
        name: 'Royal Shimmer Text',
        description: 'An elegant text effect that shines as light passes over it.',
        category: 'text',
        html: (c) => `
<h2 class="text-5xl font-black bg-clip-text text-transparent animate-[shimmer_${c.speed}s_linear_infinite] tracking-tighter" 
    style="background-image: linear-gradient(to right, #64748b, ${c.accentColor}, #64748b); background-size: 200% auto;">
  The Next Dimension
</h2>`
    },
    {
        id: 'glass-card',
        name: 'Glassmorphic Float',
        description: 'Modern glass card with a subtle floating hover effect.',
        category: 'layout',
        html: (c) => {
            const borderRadius = `${c.radius}rem`;
            const hoverEffect = c.trigger === 'hover' ? `hover:-translate-y-4 hover:scale-[${c.scale}]` : '';

            return `
<div class="p-10 backdrop-blur-3xl bg-slate-900/40 border border-white/10 shadow-2xl transition-all duration-700 ${hoverEffect} group cursor-pointer" 
     style="border-radius: ${borderRadius}; --tw-shadow-color: ${c.accentColor}${Math.floor(c.intensity * 2).toString(16).padStart(2, '0')}; shadow: var(--tw-shadow-glow)">
  <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style="background-color: ${c.accentColor}33">
    <svg class="w-8 h-8" style="color: ${c.accentColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
  </div>
  <h3 class="text-2xl font-bold text-white mb-3">Enterprise Flow</h3>
  <p class="text-slate-400 leading-relaxed text-sm">Experience performance without compromise in the modern era of web architecture.</p>
</div>`;
        }
    },
    {
        id: 'spotlight-card',
        name: 'Interactive Spotlight',
        description: 'Perfect for feature lists with a localized glow follow.',
        category: 'decor',
        html: (c) => {
            const borderRadius = `${c.radius}rem`;
            return `
<div class="relative group overflow-hidden bg-slate-950 p-12 border border-slate-800 transition-colors" 
     style="border-radius: ${borderRadius}; --spotlight-color: ${c.accentColor}${Math.floor(c.intensity * 3).toString(16).padStart(2, '0')}">
  <div class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" 
       style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 40%)"></div>
  <div class="relative z-10">
    <div class="mb-6 flex gap-1 font-mono text-xs tracking-[0.2em] uppercase font-black" style="color: ${c.accentColor}">Strategic Tier</div>
    <h3 class="text-3xl font-black text-white mb-4 tracking-tight">Spotlight Logic</h3>
    <p class="text-slate-500 leading-relaxed font-medium">Move your mouse across this card to reveal the localized interaction surface.</p>
  </div>
</div>`;
        }
    }
];

export default function TailwindAnimationsClient() {
    const [config, setConfig] = useState<Config>({
        accentColor: '#6366f1',
        speed: 3,
        intensity: 5,
        radius: 2.5,
        scale: 1.05,
        trigger: 'hover',
        background: 'grid'
    });

    const [selectedAnim, setSelectedAnim] = useState<Animation>(ANIMATIONS[0]);
    const [copied, setCopied] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const BackgroundStyles = {
        grid: "bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]",
        dot: "bg-white dark:bg-slate-950 bg-[radial-gradient(#80808012_1px,transparent_1px)] bg-[size:24px_24px]",
        mesh: "bg-white dark:bg-slate-950 bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.15)_0,transparent_50%),radial-gradient(at_100%_0%,rgba(59,130,246,0.15)_0,transparent_50%)]",
        dark: "bg-slate-900 shadow-inner",
        none: "bg-slate-50 dark:bg-slate-950"
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Configuration Panel - Sticky Sidebar */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-4 custom-scrollbar space-y-8 pb-10">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                <Settings2 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Studio Controls</h3>
                        </div>

                        <div className="space-y-8">
                            {/* Color & Trigger Layer */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest leading-none">Accent Architecture</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={config.accentColor}
                                            onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                                        />
                                        <input
                                            type="text"
                                            value={config.accentColor}
                                            onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 font-mono text-sm dark:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest leading-none">Trigger Mode</label>
                                    <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/5">
                                        {(['hover', 'loop', 'click'] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setConfig({ ...config, trigger: mode })}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${config.trigger === mode
                                                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Fine-tuning Sliders */}
                            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-white/5">
                                {[
                                    { label: 'Cycle Speed', key: 'speed', min: 1, max: 10, step: 0.1, unit: 's' },
                                    { label: 'Visual Intensity', key: 'intensity', min: 1, max: 10, step: 1, unit: '' },
                                    { label: 'Border Radius', key: 'radius', min: 0, max: 4, step: 0.1, unit: 'rem' },
                                    { label: 'Hover Scale', key: 'scale', min: 1, max: 1.2, step: 0.01, unit: 'x' }
                                ].map((slider) => (
                                    <div key={slider.key}>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{slider.label}</label>
                                            <span className="text-[10px] font-mono font-bold text-indigo-500">{(config as any)[slider.key]}{slider.unit}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={slider.min} max={slider.max} step={slider.step}
                                            value={(config as any)[slider.key]}
                                            onChange={(e) => setConfig({ ...config, [slider.key]: Number(e.target.value) })}
                                            className="w-full accent-indigo-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Library Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Motion Library</h4>
                        {ANIMATIONS.map(anim => (
                            <button
                                key={anim.id}
                                onClick={() => setSelectedAnim(anim)}
                                className={`group p-6 rounded-[2rem] border text-left transition-all duration-300 ${selectedAnim.id === anim.id
                                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20 text-white'
                                    : 'bg-white dark:bg-slate-900/30 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:scale-[1.02]'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black uppercase tracking-widest">{anim.name}</span>
                                    <Zap className={`w-3 h-3 ${selectedAnim.id === anim.id ? 'text-indigo-200' : 'text-indigo-500 opacity-50'}`} />
                                </div>
                                <p className={`text-[10px] leading-relaxed opacity-70 font-medium ${selectedAnim.id === anim.id ? 'text-indigo-50' : ''}`}>
                                    {anim.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview & Editor Panel */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Live Canvas */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition pb-8"></div>
                        <div
                            onMouseMove={handleMouseMove}
                            className={`relative h-[550px] w-full rounded-[3rem] border border-slate-100 dark:border-white/5 flex items-center justify-center p-20 overflow-hidden shadow-2xl transition-all duration-500 ${BackgroundStyles[config.background]}`}
                        >
                            <div className="absolute top-8 left-10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Live Stage</span>
                            </div>

                            <div className="absolute top-8 right-10 flex gap-2">
                                {(['grid', 'dot', 'mesh', 'dark'] as const).map((bg) => (
                                    <button
                                        key={bg}
                                        onClick={() => setConfig({ ...config, background: bg })}
                                        className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[8px] font-black uppercase transition-all ${config.background === bg
                                            ? 'bg-indigo-600 text-white border-indigo-500 scale-110 shadow-lg'
                                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-white/5 hover:border-indigo-400'
                                            }`}
                                    >
                                        {bg[0]}
                                    </button>
                                ))}
                            </div>

                            <div className="w-full max-w-md scale-110" dangerouslySetInnerHTML={{ __html: selectedAnim.html(config) }}></div>
                        </div>
                    </div>

                    {/* Code Studio */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        <div className="flex items-center justify-between p-6 bg-slate-950/50 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <LayoutGrid className="w-4 h-4 text-slate-500" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tailwind Architecture</span>
                            </div>
                            <button
                                onClick={() => copyCode(selectedAnim.html(config))}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
                            >
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'COPIED!' : 'COPY CODE'}
                            </button>
                        </div>
                        <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <pre className="text-sm font-mono leading-relaxed group">
                                <code className="text-indigo-100 block whitespace-pre-wrap">
                                    {selectedAnim.html(config).trim()}
                                </code>
                            </pre>
                        </div>

                        <div className="p-6 bg-slate-950/30 flex items-center gap-4 border-t border-white/5">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                This component uses standard Tailwind CSS classes. No extra CSS packages required. Just paste it directly into your Next.js or React project.
                            </p>
                        </div>
                    </div>

                    {/* Pro Insight */}
                    <div className="p-8 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <h4 className="font-bold text-slate-900 dark:text-indigo-400 uppercase tracking-widest text-sm">Performance Architecture</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            These animations leverage <strong>GPU-accelerated</strong> properties to minimize Repaints and Reflows. By using <code className="bg-white/50 px-1 rounded font-mono">transform</code> and <code className="bg-white/50 px-1 rounded font-mono">opacity</code>, we ensure smooth 60FPS interactions even on low-powered devices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
