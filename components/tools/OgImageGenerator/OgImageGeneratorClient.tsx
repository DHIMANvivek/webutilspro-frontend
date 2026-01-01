'use client';

import React, { useState } from 'react';
import { Copy, Download, Image as ImageIcon, Layout, Type, Palette, Code, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OgImageGeneratorClient() {
    const [title, setTitle] = useState('Amazing Content');
    const [description, setDescription] = useState('Learn how to build incredible things with modern web technologies.');
    const [siteName, setSiteName] = useState('WebUtilsPro');
    const [theme, setTheme] = useState<'dark' | 'light' | 'gradient'>('dark');
    const [accentColor, setAccentColor] = useState('#3b82f6');
    const [fontSize, setFontSize] = useState(64);
    const [alignment, setAlignment] = useState<'center' | 'left' | 'right'>('center');
    const [logoUrl, setLogoUrl] = useState('');

    const getPreviewStyle = (isResponsive = false) => {
        const base = {
            width: isResponsive ? '100%' : '1200px',
            height: isResponsive ? '100%' : '630px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: alignment === 'center' ? 'center' : alignment === 'left' ? 'flex-start' : 'flex-end',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            padding: '4rem',
            textAlign: alignment,
            position: 'relative' as const,
            overflow: 'hidden'
        };

        if (theme === 'dark') {
            return { ...base, background: '#0f172a', color: 'white' };
        } else if (theme === 'light') {
            return { ...base, background: '#ffffff', color: '#0f172a' };
        } else {
            return { ...base, background: `linear-gradient(135deg, #0f172a 0%, ${accentColor}40 100%)`, color: 'white' };
        }
    };

    const generateCode = () => {
        return `
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: '${alignment === 'center' ? 'center' : alignment === 'left' ? 'flex-start' : 'flex-end'}',
          justifyContent: 'center',
          backgroundColor: '${theme === 'light' ? '#ffffff' : '#0f172a'}',
          ${theme === 'gradient' ? `backgroundImage: 'linear-gradient(135deg, #0f172a 0%, ${accentColor}40 100%)',` : ''}
          color: '${theme === 'light' ? '#0f172a' : 'white'}',
          padding: '4rem',
          textAlign: '${alignment}',
        }}
      >
        ${logoUrl ? `<img src="${logoUrl}" style={{ width: 64, height: 64, marginBottom: 24, borderRadius: 12 }} />` : `<div style={{ fontSize: 32, marginBottom: 24, opacity: 0.8 }}>${siteName}</div>`}
        <div style={{ fontSize: ${fontSize}, fontWeight: 900, lineHeight: 1.2, marginBottom: 24, background: '${theme === 'gradient' ? 'linear-gradient(to bottom right, #ffffff, #94a3b8)' : 'transparent'}', backgroundClip: '${theme === 'gradient' ? 'text' : 'border-box'}', color: '${theme === 'gradient' ? 'transparent' : 'inherit'}' }}>
          ${title}
        </div>
        <div style={{ fontSize: ${fontSize / 2.5}, opacity: 0.7, maxWidth: 900 }}>
          ${description}
        </div>
        <div style={{ position: 'absolute', bottom: 40, width: '100%', height: 8, background: '${accentColor}' }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
        `.trim();
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCode());
        toast.success('Next.js Route code copied!');
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-500" />
                        Card Design
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 h-24 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Logo URL (Optional)</label>
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Accent Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={accentColor}
                                        onChange={(e) => setAccentColor(e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={accentColor}
                                        onChange={(e) => setAccentColor(e.target.value)}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Font Size: {fontSize}px</label>
                                <input
                                    type="range"
                                    min="32"
                                    max="120"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['dark', 'light', 'gradient'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t as any)}
                                            className={`px-2 py-2 rounded-lg font-bold capitalize text-xs transition-all ${theme === t ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alignment</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['left', 'center', 'right'].map(a => (
                                        <button
                                            key={a}
                                            onClick={() => setAlignment(a as any)}
                                            className={`px-2 py-2 rounded-lg font-bold capitalize text-xs transition-all flex items-center justify-center ${alignment === a ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                        >
                                            {a === 'left' ? <Layout className="w-4 h-4 rotate-180" /> : a === 'center' ? <Layout className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-0 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Code className="w-4 h-4" /> Next.js Route Code
                        </span>
                        <button
                            onClick={copyCode}
                            className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <Copy className="w-3 h-3" /> Copy
                        </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                        {generateCode()}
                    </pre>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-purple-500" />
                        Live Preview (1200x630)
                    </h3>

                    <div className="aspect-[1200/630] w-full rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative group">
                        <div style={getPreviewStyle(true) as any} className="w-full h-full transform scale-[1] origin-top-left">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" style={{ width: '64px', height: '64px', marginBottom: '24px', borderRadius: '12px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ fontSize: '24px', marginBottom: '24px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{siteName}</div>
                            )}
                            <div style={{
                                fontSize: `${fontSize * 0.6}px`, // Scale for CSS preview
                                fontWeight: 900,
                                lineHeight: 1.1,
                                marginBottom: '24px',
                                background: theme === 'gradient' ? 'linear-gradient(to bottom right, #ffffff, #94a3b8)' : undefined,
                                backgroundClip: theme === 'gradient' ? 'text' : undefined,
                                WebkitBackgroundClip: theme === 'gradient' ? 'text' : undefined,
                                color: theme === 'gradient' ? 'transparent' : 'inherit'
                            }}>
                                {title}
                            </div>
                            <div style={{ fontSize: `${(fontSize / 2.5) * 0.8}px`, opacity: 0.7, maxWidth: '80%', lineHeight: 1.5 }}>
                                {description}
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '8px', background: accentColor }} />
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        This preview mimics how your image will look when shared on Twitter/LinkedIn.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Info({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
}
