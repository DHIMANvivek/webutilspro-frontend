'use client';

import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
    onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-blue-600 group active:scale-95"
            title="Help Tour"
        >
            <HelpCircle className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
