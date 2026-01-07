'use client';

import React from 'react';

interface FileDiffViewerProps {
    patch: string;
    filename: string;
}

export default function FileDiffViewer({ patch, filename }: FileDiffViewerProps) {
    if (!patch) {
        return (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-500 text-xs text-center font-mono">
                No diff available for this file (it might be a binary file or too large).
            </div>
        );
    }

    const lines = patch.split('\n');

    return (
        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden font-mono text-[12px] leading-relaxed">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">{filename}</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                    <tbody>
                        {lines.map((line, i) => {
                            let bgColor = 'transparent';
                            let textColor = 'text-slate-400';
                            let prefix = '';

                            if (line.startsWith('+')) {
                                bgColor = 'bg-green-500/10';
                                textColor = 'text-green-400';
                                prefix = '+';
                            } else if (line.startsWith('-')) {
                                bgColor = 'bg-red-500/10';
                                textColor = 'text-red-400';
                                prefix = '-';
                            } else if (line.startsWith('@@')) {
                                bgColor = 'bg-blue-500/5';
                                textColor = 'text-blue-400/60';
                                prefix = ' ';
                            }

                            return (
                                <tr key={i} className={`${bgColor} hover:bg-white/5 transition-colors`}>
                                    <td className="w-12 px-2 py-0 text-right select-none border-r border-slate-800/50 text-slate-600 opacity-50">
                                        {i + 1}
                                    </td>
                                    <td className={`px-4 py-0 whitespace-pre ${textColor}`}>
                                        {line}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0f172a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
}
