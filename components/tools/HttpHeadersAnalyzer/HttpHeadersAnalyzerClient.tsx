'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Globe, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AnalysisResult {
    url: string;
    status: number;
    headers: Record<string, string>;
    grade: string;
    score: number;
    missing: string[];
    good: string[];
}

const SECURITY_HEADERS = {
    'strict-transport-security': { weight: 20, name: 'HSTS' },
    'content-security-policy': { weight: 25, name: 'CSP' },
    'x-frame-options': { weight: 15, name: 'X-Frame-Options' },
    'x-content-type-options': { weight: 10, name: 'X-Content-Type-Options' },
    'referrer-policy': { weight: 10, name: 'Referrer-Policy' },
    'permissions-policy': { weight: 10, name: 'Permissions-Policy' },
    'x-xss-protection': { weight: 5, name: 'X-XSS-Protection' }
};

export default function HttpHeadersAnalyzerClient() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const analyze = async () => {
        if (!url) {
            toast.error('Please enter a URL');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/analyze-headers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.details || 'Failed to analyze');

            // Grade Logic
            let score = 0;
            const good: string[] = [];
            const missing: string[] = [];

            Object.entries(SECURITY_HEADERS).forEach(([header, info]) => {
                if (data.headers[header]) {
                    score += info.weight;
                    good.push(info.name);
                } else {
                    missing.push(info.name);
                }
            });

            // Adjust grade
            let grade = 'F';
            if (score >= 90) grade = 'A+';
            else if (score >= 80) grade = 'A';
            else if (score >= 70) grade = 'B';
            else if (score >= 60) grade = 'C';
            else if (score >= 40) grade = 'D';

            setResult({
                url: data.url,
                status: data.status,
                headers: data.headers,
                grade,
                score,
                good,
                missing
            });

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') analyze();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. google.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={analyze}
                        disabled={loading}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search className="w-5 h-5" />}
                        Scan
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-500">
                    {/* Score Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center h-full relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-2 ${getGradeColor(result.grade)}`}></div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Security Grade</h3>
                            <div className={`text-8xl font-black mb-4 ${getGradeTextColor(result.grade)}`}>
                                {result.grade}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                                Score: {result.score}/100
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Security Headers Status */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                Security Headers Analysis
                            </h3>

                            <div className="space-y-4">
                                {result.good.map(h => (
                                    <div key={h} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
                                            <span className="font-bold text-emerald-900 dark:text-emerald-100">{h}</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-emerald-900/50 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">Present</span>
                                    </div>
                                ))}
                                {result.missing.map(h => (
                                    <div key={h} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="w-5 h-5 text-red-500 fill-red-100 dark:fill-red-900" />
                                            <span className="font-bold text-red-900 dark:text-red-100">{h}</span>
                                        </div>
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-red-900/50 px-2 py-1 rounded border border-red-200 dark:border-red-800">Missing</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Raw Headers */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-0 overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Code className="w-4 h-4" /> Raw Server Headers
                                </span>
                                <span className="text-xs font-mono text-slate-500">{result.status} OK</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="text-xs font-mono text-slate-300">
                                    {Object.entries(result.headers).map(([k, v]) => (
                                        <div key={k} className="mb-1">
                                            <span className="text-blue-400">{k}:</span> <span className="text-slate-400 break-all">{v}</span>
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getGradeColor(grade: string) {
    if (grade.startsWith('A')) return 'bg-emerald-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
}
function getGradeTextColor(grade: string) {
    if (grade.startsWith('A')) return 'text-emerald-500';
    if (grade.startsWith('B')) return 'text-blue-500';
    if (grade.startsWith('C')) return 'text-yellow-500';
    return 'text-red-500';
}

function Code({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
