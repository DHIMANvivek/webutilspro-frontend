import React, { Suspense } from 'react';
import SketchBoard from '@/components/SketchBoard';
import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';

export const metadata = genMeta({
    title: 'Free Online Collaborative Sketch Board | Real-time Whiteboard',
    description: 'Instant, free, and secure online whiteboard for real-time collaboration. Share your screen, draw diagrams, and brainstorm with teams - no login required.',
    keywords: [
        'online whiteboard',
        'collaborative sketch board',
        'real-time drawing',
        'share screen drawing',
        'free whiteboard tool',
        'collaborative diagram maker',
        'online drawing tool',
        'team brainstorming tool'
    ],
    canonical: '/tools/sketch-board'
});

const jsonLd = generateToolSchema({
    name: 'Collaborative Sketch Board',
    description: 'A free, real-time online whiteboard for instant collaboration and sketching.',
    url: 'https://webutilspro.com/tools/sketch-board'
});

export default function SketchBoardPage() {
    return (
        <div className="min-h-screen bg-[#111827]">
            <div className="container mx-auto px-4 py-8">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <h1 className="text-3xl font-bold mb-6 text-white">Shareable Sketch Board</h1>
                <div className="flex flex-col gap-4 mb-8">
                    <p className="text-gray-400 max-w-2xl">
                        Collaborate with others in real-time. Share your ideas, diagrams, and sketches on a shared canvas.
                        Just share the URL with your friends or colleagues to start collaborating.
                    </p>

                    <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-5 max-w-2xl animate-in slide-in-from-left duration-500 shadow-xl shadow-blue-900/20 backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/20 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1.5 flex items-center gap-2.5 text-lg">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                                    </span>
                                    Live Sync Active
                                </h3>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                    Share the URL to invite others. Anyone with the link can <strong className="text-blue-300">view your screen</strong> and <strong className="text-blue-300">draw in real-time</strong>. All changes are synchronized instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<div className="text-white text-center py-10">Loading collaboration space...</div>}>
                    <SketchBoard />
                </Suspense>
            </div>
        </div>
    );
}
