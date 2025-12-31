'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Sparkles, Bug, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { getIssueUrl } from './ReportIssueLink';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class SmartErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            const errorMessage = this.state.error?.message || 'An unexpected runtime error occurred.';
            const aiExplainerUrl = `/tools/ai-error-explainer?error=${encodeURIComponent(errorMessage)}`;
            const reportUrl = getIssueUrl(`Stack Trace: ${this.state.error?.stack || 'N/A'}`);

            return (
                <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 selection:bg-blue-500/30">
                    <div className="max-w-2xl w-full relative">
                        {/* Glow Effects */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

                        <div className="relative bg-[#0A0A0F] border border-white/[0.08] rounded-[2.5rem] p-12 backdrop-blur-3xl shadow-2xl text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>

                            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Runtime Exception</h1>
                            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                                Something went wrong during execution. Don't worry, we've got the diagnostics ready.
                            </p>

                            <div className="bg-black/40 border border-white/[0.05] rounded-2xl p-6 mb-10 text-left overflow-hidden">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Error Log</span>
                                </div>
                                <code className="text-sm text-red-400/90 font-mono break-words block">
                                    {errorMessage}
                                </code>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href={aiExplainerUrl}
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-lg shadow-purple-600/20 group"
                                >
                                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                    Explain with AI
                                </Link>
                                <a
                                    href={reportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-2xl font-bold transition-all hover:-translate-y-1 group"
                                >
                                    <Bug className="w-5 h-5 text-red-500" />
                                    Quick Report
                                </a>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-6">
                                <button
                                    onClick={this.handleReset}
                                    className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retry App
                                </button>
                                <Link
                                    href="/"
                                    onClick={() => this.setState({ hasError: false })}
                                    className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Back Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
