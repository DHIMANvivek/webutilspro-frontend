'use client';

import { useState, useEffect } from 'react';
import { Search, Star, GitFork, Code, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface RepoSelectorProps {
    onSelectRepo: (repo: any) => void;
    selectedRepo: any;
}

export default function RepoSelector({ onSelectRepo, selectedRepo }: RepoSelectorProps) {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchRepositories();
    }, []);

    const fetchRepositories = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/github/repos?per_page=100`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setRepos(data);
            } else {
                toast.error('Failed to fetch repositories');
            }
        } catch (error) {
            console.error('Fetch repos error:', error);
            toast.error('Failed to load repositories');
        } finally {
            setLoading(false);
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-slate-600 font-medium">Loading repositories...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Select Repository</h3>

            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Selected Repository Display */}
            {selectedRepo && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 rounded-xl">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Code className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-blue-900">{selectedRepo.name}</span>
                            </div>
                            {selectedRepo.description && (
                                <p className="text-sm text-blue-700 mb-2">{selectedRepo.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-blue-600">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {selectedRepo.stargazers_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <GitFork className="w-3 h-3" />
                                    {selectedRepo.forks_count}
                                </span>
                                {selectedRepo.language && (
                                    <span className="px-2 py-0.5 bg-blue-200/50 rounded-full">
                                        {selectedRepo.language}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-4 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            )}

            {/* Repository List */}
            {(isOpen || !selectedRepo) && (
                <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
                    {filteredRepos.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            {searchTerm ? 'No repositories found' : 'No repositories available'}
                        </div>
                    ) : (
                        filteredRepos.map((repo) => (
                            <button
                                key={repo.id}
                                onClick={() => {
                                    onSelectRepo(repo);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${selectedRepo?.id === repo.id
                                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Code className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                            <span className="font-bold text-slate-900 truncate">{repo.name}</span>
                                        </div>
                                        {repo.description && (
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{repo.description}</p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {repo.stargazers_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="w-3 h-3" />
                                                {repo.forks_count}
                                            </span>
                                            {repo.language && (
                                                <span className="px-2 py-0.5 bg-slate-200 rounded-full">
                                                    {repo.language}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
