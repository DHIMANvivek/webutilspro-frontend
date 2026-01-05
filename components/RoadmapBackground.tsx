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
                {/* The "One Line" Innovation Thread - High Visibility Dotted moving line */}
                <path
                    d="M 1350,0 
                       V 500 
                       C 1350,700 720,600 720,900
                       V 5000"
                    stroke="url(#thread-gradient)"
                    strokeWidth="3"
                    strokeDasharray="12 12"
                    strokeLinecap="round"
                    className="roadmap-path"
                />

                <defs>
                    <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                    </linearGradient>

                    <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Floating Neural Nodes along the thread */}
                {[
                    { x: 1350, y: 150, label: 'Start' },
                    { x: 720, y: 1100, label: 'webutilspro.com' },
                    { x: 720, y: 2200, label: 'Sync' },
                    { x: 720, y: 3100, label: 'Data' },
                    { x: 720, y: 4000, label: 'Cloud' }
                ].map((node, i) => (
                    <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                        <circle r="40" fill="currentColor" className="text-slate-500/5 animate-pulse" />
                        <circle r="3" fill="#6366f1" filter="url(#glow)" />
                        <text x="15" y="4" className="text-[9px] font-black fill-slate-400/40 uppercase tracking-[0.2em]">{node.label}</text>
                    </g>
                ))}
            </svg>

            <style jsx>{`
                .roadmap-path { 
                    animation: dash 100s linear infinite; 
                }
                @keyframes dash { 
                    to { stroke-dashoffset: -1000; } 
                }
            `}</style>
        </div>
    );
}
