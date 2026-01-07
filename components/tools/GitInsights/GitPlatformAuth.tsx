'use client';

import { Github } from 'lucide-react';

interface GitPlatformAuthProps {
    onLogin: (platform: 'github' | 'gitlab') => void;
}

export default function GitPlatformAuth({ onLogin }: GitPlatformAuthProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                {/* GitHub Button */}
                <button
                    onClick={() => onLogin('github')}
                    className="group relative flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-100"
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-lg"></div>
                    <div className="relative p-2.5 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                        <Github className="w-7 h-7" />
                    </div>
                    <div className="relative text-left">
                        <span className="block text-lg">GitHub</span>
                        <span className="text-xs text-slate-400 font-medium">Analyze GitHub repos</span>
                    </div>
                </button>

                {/* GitLab Button */}
                <button
                    onClick={() => onLogin('gitlab')}
                    className="group relative flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-100"
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-lg"></div>
                    <div className="relative p-2.5 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                        {/* GitLab Icon is typically a fox, using a simple SVG or text for now if lucide doesn't have it easily recognizable as a brand */}
                        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                            <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.417-.724-.417-.859 0L16.425 9.452H7.575L4.912 1.263c-.135-.417-.724-.417-.859 0L1.387 9.452.045 13.587c-.114.352.016.74.322.962l11.633 8.45 11.633-8.45c.306-.222.436-.61.322-.962z" />
                        </svg>
                    </div>
                    <div className="relative text-left">
                        <span className="block text-lg">GitLab</span>
                        <span className="text-xs text-orange-100 font-medium font-medium opacity-80">Analyze GitLab projects</span>
                    </div>
                </button>
            </div>

            <p className="mt-4 text-sm text-slate-500 max-w-md text-center">
                Choose your platform to start analyzing your repository history and team productivity.
            </p>
        </div>
    );
}
