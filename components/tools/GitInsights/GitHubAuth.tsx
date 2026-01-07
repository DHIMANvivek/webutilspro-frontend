'use client';

import { Github } from 'lucide-react';

interface GitHubAuthProps {
    onLogin: () => void;
}

export default function GitHubAuth({ onLogin }: GitHubAuthProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <button
                onClick={onLogin}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-105 active:scale-100"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>

                {/* Content */}
                <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Github className="w-6 h-6" />
                    </div>
                    <span>Sign in with GitHub</span>
                </div>
            </button>

            <p className="mt-4 text-sm text-slate-500 max-w-md text-center">
                Connect your GitHub account to start analyzing your repositories
            </p>
        </div>
    );
}
