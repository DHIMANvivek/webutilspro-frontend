import React from 'react';
import { Metadata } from 'next';
import SqlArchitectClient from '@/components/tools/SqlArchitect/SqlArchitectClient';
import { Database, Zap, Activity, Layers, ArrowRight, Server, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Visual SQL Performance Architect | Explain Plan Heatmap',
    description: 'Visualize PostgreSQL EXPLAIN ANALYZE Output. Debug slow queries with an interactive heatmap execution tree. Optimize database performance instantly.',
    keywords: 'postgres explain visualizer, sql query plan execution tree, postgres performance optimization, slow query debugging, database heatmap',
};

export default function SqlArchitectPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* Header is provided by Layout, typically, but ensuring specific context if needed */}
            {/* If Layout provides global header, we skip it here. Assuming standard Layout wrapper. */}

            <div className="pt-32 pb-24 container-custom">
                <div className="relative z-10 max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <Database size={14} />
                        DBA Professional Suite
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        Visual SQL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">Performance Architect</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop staring at text logs. Turn your cryptic `EXPLAIN ANALYZE` output into a living, interactive heatmap of your query's performance.
                    </p>
                </div>

                {/* Main Architect Canvas */}
                <div id="architect-studio" className="relative z-10 mb-24">
                    <SqlArchitectClient />
                </div>

                {/* Features / SEO Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Bottleneck Heatmaps</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Instantly spot the slowest nodes. Our engine calculates "Relative Time Impact" and makes slow scans glow <span className="text-red-600 font-bold">Red</span>.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Execution Flow</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Visualize the nested loops, hash joins, and sort operations as a directed graph. Understand exactly how Postgres is traversing your data.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Index Suggestions</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Context-aware insights flag "Sequential Scans" on large tables, suggesting where B-Tree or GIN indexes might reduce cost by 100x.
                        </p>
                    </div>
                </div>

                {/* SEO Content Area */}
                <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 border-l-4 border-indigo-500 pl-6 uppercase tracking-tight">Optimizing Postgres Performance</h2>

                    <div className="space-y-12">
                        <div>
                            <h4 className="font-black text-slate-800 mb-2">Why visualize EXPLAIN plans?</h4>
                            <p className="text-slate-600">
                                The text output of `EXPLAIN ANALYZE` is comprehensive but dense. It fails to show the "shape" of the query. A visualization instantly shows if you have a wide, shallow query (good) or a deep, nested loop nightmare (bad).
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-slate-800 mb-2">What is the difference between "Cost" and "Actual Time"?</h4>
                            <p className="text-slate-600">
                                "Cost" is the planner's <i>guess</i> before running the query. "Actual Time" is the truth measured by `ANALYZE`. Our tool visualizes **Actual Time** primarily, because that's what your users experience. If Cost is low but Time is high, your table statistics might be stale (run `VACUUM ANALYZE`).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
