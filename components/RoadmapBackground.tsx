'use client';

import React from 'react';

export default function RoadmapBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Global Technical Blueprint Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_100%,transparent_100%)] opacity-50"></div>

            <svg
                className="absolute inset-0 w-full h-full opacity-[0.5] dark:opacity-[0.3]"
                viewBox="0 0 1440 5000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                {/* The "One Line" Innovation Thread - Clean & Professional - MOVED TO RIGHT */}
                <path
                    d="M 1350,0 
                       V 250 
                       L 1250,450 
                       V 750 
                       L 1400,950 
                       V 1250 
                       L 1280,1550 
                       V 1950 
                       L 1380,2350 
                       V 2850 
                       L 1300,3250 
                       V 3850 
                       L 1420,4350 
                       V 5000"
                    stroke="url(#thread-gradient)"
                    strokeWidth="1.5"
                    strokeDasharray="10 15"
                    className="roadmap-path"
                />

                {/* "Much Times" - Multi-Pulse Flow (4 Staggered Pulses) */}
                {[0, 3, 6, 9].map((delay, i) => (
                    <path
                        key={i}
                        d="M 1350,0 V 250 L 1250,450 V 750 L 1400,950 V 1250 L 1280,1550 V 1950 L 1380,2350 V 2850 L 1300,3250 V 3850 L 1420,4350 V 5000"
                        stroke="url(#pulse-gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ animationDelay: `${delay}s` }}
                        className="roadmap-pulse"
                    />
                ))}

                <defs>
                    <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="15%" stopColor="#6366f1" />
                        <stop offset="20%" stopColor="#10b981" />
                        <stop offset="25%" stopColor="transparent" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Floating Neural Nodes along the thread - REPOSITIONED */}
                {[
                    { x: 1250, y: 450, label: 'webutilspro.com' },
                    { x: 1400, y: 950, label: 'Logic' },
                    { x: 1280, y: 1550, label: 'Sync' },
                    { x: 1380, y: 2350, label: 'Data' },
                    { x: 1300, y: 3250, label: 'Cloud' }
                ].map((node, i) => (
                    <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                        <circle r="40" fill="currentColor" className="text-slate-500/5 animate-pulse" />
                        <circle r="3" fill="#6366f1" filter="url(#glow)" />
                        <text x="-35" y="4" className="text-[9px] font-black fill-slate-400/40 uppercase tracking-[0.2em] text-right" style={{ textAnchor: 'end' }}>{node.label}</text>
                    </g>
                ))}
            </svg>

            <style jsx>{`
                .roadmap-path { 
                    animation: dash 120s linear infinite; 
                }
                .roadmap-pulse { 
                    stroke-dasharray: 400 4600; 
                    stroke-dashoffset: 5000; 
                    animation: pulse-flow 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; 
                }
                @keyframes dash { to { stroke-dashoffset: -1000; } }
                @keyframes pulse-flow {
                    0% { stroke-dashoffset: 5000; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
