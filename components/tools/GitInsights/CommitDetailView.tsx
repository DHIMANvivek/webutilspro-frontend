'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, Plus, Minus, GitCommit, User, Calendar, ExternalLink, Loader2, X } from 'lucide-react';
import FileDiffViewer from './FileDiffViewer';

interface CommitDetailViewProps {
    platform: 'github' | 'gitlab';
    commitSha: string;
    owner: string;
    repo: string;
}

export default function CommitDetailView({ platform, commitSha, owner, repo }: CommitDetailViewProps) {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    useEffect(() => {
        fetchDetails();
    }, [commitSha]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const endpoint = platform === 'gitlab'
                ? `${apiUrl}/api/gitlab/repos/${repo}/commits/${commitSha}`
                : `${apiUrl}/api/github/repos/${owner}/${repo}/commits/${commitSha}`;

            const response = await fetch(endpoint, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                setDetails(data);
            }
        } catch (error) {
            console.error('Failed to fetch commit details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!details) return null;

    const { commit, author, html_url, stats, files, parents } = details;

    return (
        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700 shadow-inner mt-2 mb-4">
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Meta Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <GitCommit className="w-5 h-5 text-blue-400" />
                            <span className="font-mono text-sm text-blue-400">{commitSha}</span>
                            <a href={html_url} target="_blank" rel="noopener noreferrer" className="hover:text-white ml-2">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 mt-1 text-slate-500" />
                                <div>
                                    <p className="text-sm font-bold text-white">{commit.author.name}</p>
                                    <p className="text-xs text-slate-500">{commit.author.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <p className="text-xs">{new Date(commit.author.date).toLocaleString()}</p>
                            </div>

                            {parents.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-slate-500 mb-2 font-mono">PARENTS</p>
                                    <div className="space-y-1">
                                        {parents.map((p: any) => (
                                            <div key={p.sha} className="flex items-center gap-2 font-mono text-xs text-blue-400/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                                                {p.sha.substring(0, 7)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{commit.message}</p>
                        </div>
                    </div>

                    {/* File Tree / Changes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-2">
                                CHANGED FILES
                                <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{files.length}</span>
                            </h4>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1 text-green-400">
                                    <Plus className="w-3 h-3" /> {stats.additions}
                                </div>
                                <div className="flex items-center gap-1 text-red-400">
                                    <Minus className="w-3 h-3" /> {stats.deletions}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {files.map((file: any) => (
                                <div
                                    key={file.filename}
                                    onClick={() => setSelectedFile(selectedFile?.filename === file.filename ? null : file)}
                                    className={`group flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors cursor-pointer ${selectedFile?.filename === file.filename ? 'bg-white/10' : ''}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className={`w-4 h-4 flex-shrink-0 ${selectedFile?.filename === file.filename ? 'text-blue-400' : 'text-slate-500'}`} />
                                        <span className={`text-sm truncate font-mono ${selectedFile?.filename === file.filename ? 'text-white font-bold' : ''}`}>{file.filename}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <span className="text-[10px] text-green-400 font-bold">+{file.additions}</span>
                                        <span className="text-[10px] text-red-400 font-bold">-{file.deletions}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Inline Diff Viewer */}
                {selectedFile && (
                    <div className="mt-2 pt-6 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-blue-400 tracking-wider flex items-center gap-2 uppercase">
                                Diff: {selectedFile.filename}
                            </h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                }}
                                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <FileDiffViewer
                            patch={selectedFile.patch}
                            filename={selectedFile.filename}
                        />
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
