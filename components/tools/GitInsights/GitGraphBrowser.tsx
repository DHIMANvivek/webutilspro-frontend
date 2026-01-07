'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, History, GitCommit, User, Calendar, ExternalLink, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import RepoGraph from './RepoGraph';
import CommitDetailView from './CommitDetailView';

interface GitGraphBrowserProps {
    commits: any[];
    owner: string;
    repo: string;
}

export default function GitGraphBrowser({ commits, owner, repo }: GitGraphBrowserProps) {
    const [selectedSha, setSelectedSha] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const rowHeight = 48;

    const filteredCommits = useMemo(() => {
        if (!searchTerm) return commits;
        return commits.filter(c =>
            (c.message?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.sha?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.author?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [commits, searchTerm]);

    const handleRowClick = (sha: string) => {
        if (!sha) return;
        setSelectedSha(selectedSha === sha ? null : sha);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800">Repository History</h3>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {filteredCommits?.length || 0} commits
                    </span>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search commits, authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[80px_1fr_120px_140px_100px] gap-4 px-6 py-3 bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <div className="text-center">Graph</div>
                <div>Description</div>
                <div>Date</div>
                <div>Author</div>
                <div className="text-right">Commit</div>
            </div>

            {/* Commit List with Integrated Graph */}
            <div className="flex-1 overflow-y-auto relative min-h-[500px] custom-scroller">
                <div className="absolute top-0 left-0 h-full pointer-events-none z-10">
                    <RepoGraph commits={filteredCommits} rowHeight={rowHeight} width={80} />
                </div>

                <div className="relative z-0">
                    {filteredCommits?.map((commit) => (
                        <React.Fragment key={commit.sha}>
                            <div
                                onClick={() => handleRowClick(commit.sha)}
                                className={`grid grid-cols-[80px_1fr_120px_140px_100px] gap-4 px-6 items-center cursor-pointer transition-all duration-200 hover:bg-blue-50/50 group ${selectedSha === commit.sha ? 'bg-blue-50' : 'bg-transparent'}`}
                                style={{ height: rowHeight }}
                            >
                                {/* Graph Spacer */}
                                <div className="h-full w-20" />

                                {/* Description */}
                                <div className="min-w-0 pr-4">
                                    <p className={`text-sm font-medium truncate ${selectedSha === commit.sha ? 'text-blue-700' : 'text-slate-800'}`}>
                                        {commit.message?.split('\n')[0] || 'No message'}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-slate-500 font-medium">
                                    {commit.date ? new Date(commit.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                                        {commit.author?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-xs text-slate-600 truncate font-medium">{commit.author || 'Unknown'}</span>
                                </div>

                                {/* Commit Hash */}
                                <div className="text-right">
                                    <span className="font-mono text-[11px] text-slate-400 group-hover:text-blue-500 transition-colors">
                                        {commit.sha?.substring(0, 7) || '-------'}
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedSha === commit.sha && commit.sha && (
                                <div className="px-6 bg-slate-50/50 border-y border-blue-100/50">
                                    <CommitDetailView
                                        commitSha={commit.sha}
                                        owner={owner}
                                        repo={repo}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {(!filteredCommits || filteredCommits.length === 0) && (
                        <div className="p-20 text-center">
                            <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No commits found matching your search</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scroller::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scroller::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                .custom-scroller::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 4px;
                }
                .custom-scroller::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
