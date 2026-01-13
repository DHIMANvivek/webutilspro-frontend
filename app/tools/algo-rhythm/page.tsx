import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LayoutGrid } from 'lucide-react';

const AlgoRhythm = dynamic(() => import('@/components/tools/AlgoRhythm'), { ssr: false });

export const metadata: Metadata = {
    title: 'AlgoRhythm | 3D Audio-Visual Sorting Algorithms Visualization',
    description: 'Visualize sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort in a stunning 3D cyberpunk environment with real-time audio synthesis.',
    keywords: ['sorting algorithms', 'visualization', '3D', 'algorithm visualizer', 'computer science', 'education', 'bubble sort', 'merge sort', 'quick sort', 'audio synthesis'],
    openGraph: {
        title: 'AlgoRhythm - 3D Sorting Visualizer',
        description: 'See and hear code with this immersive 3D sorting algorithm visualizer.',
        images: ['/og/algo-rhythm.png'], // Placeholder for now
    },
};

export default function AlgoRhythmPage() {
    return (

        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { name: 'AlgoRhythm', href: '/tools/algo-rhythm' },
                        ]}
                    />
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 mb-4 tracking-tight drop-shadow-sm">
                        ALGO<span className="text-slate-900">RHYTHM</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Experience the beauty of computer science. Visualize sorting algorithms in <span className="text-cyan-600 font-bold">real-time 3D</span> orchestrated with <span className="text-purple-600 font-bold">procedural audio</span>.
                    </p>
                </div>

                {/* The Tool */}
                <div className="w-full">
                    <AlgoRhythm />
                </div>
            </section>

            {/* Educational Content (SEO) */}
            <section className="py-16 px-4 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto prose prose-slate prose-headings:font-bold prose-cyan lg:prose-lg">
                    <h2 className="text-slate-900">Understanding Sorting Algorithms</h2>
                    <p className="text-slate-600">
                        Sorting is one of the most fundamental problems in Computer Science. Different algorithms tackle this problem with varying strategies, each having its own Trade-offs in terms of <strong className="text-cyan-600">Time Complexity (Speed)</strong> and <strong className="text-purple-600">Space Complexity (Memory)</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mt-8">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Bubble Sort</h3>
                            <div className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-mono rounded mb-3 font-bold">O(n²) - Slow</div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                The simplest sorting algorithm. It repeatedly swaps adjacent elements if they are in the wrong order. Great for learning, terrible for large datasets.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Merge Sort</h3>
                            <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-mono rounded mb-3 font-bold">O(n log n) - Fast</div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                A "Divide and Conquer" algorithm. It recursively splits the list into halves and merges them back together. Very efficient and stable.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Sort</h3>
                            <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-mono rounded mb-3 font-bold">O(n log n) - Very Fast</div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Uses a "Pivot" to partition the array. Elements smaller than pivot go left, larger go right. Often faster than Merge Sort in practice but can be worst-case O(n²).
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Heap Sort</h3>
                            <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-mono rounded mb-3 font-bold">O(n log n) - Fast</div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Visualize the data as a binary heap tree. It's efficient and uses constant space, unlike Merge Sort which needs extra memory.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
