'use client';

import { useState, useEffect } from 'react';
import { Loader2, GitCommit, GitPullRequest, GitBranch, TrendingUp, Award, Users, Calendar, History } from 'lucide-react';
import toast from 'react-hot-toast';
import GitGraphBrowser from './GitGraphBrowser';

interface DashboardProps {
    repo: any;
}

export default function Dashboard({ repo }: DashboardProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prs' | 'branches'>('overview');

    useEffect(() => {
        if (repo) {
            fetchAnalysis();
        }
    }, [repo]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const [owner, repoName] = repo.full_name.split('/');
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(
                `${apiUrl}/api/github/repos/${owner}/${repoName}/analyze?branch=${repo.default_branch}`,
                { credentials: 'include' }
            );

            if (response.ok) {
                const data = await response.json();
                setAnalysis(data);
            } else {
                toast.error('Failed to analyze repository');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to load analysis');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 mb-1">Analyzing Repository</p>
                        <p className="text-sm text-slate-600">This may take a few moments...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const { commits, pullRequests, branches } = analysis;

    // Get quality color
    const getQualityColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'history', label: 'History', icon: History },
                    { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
                    { id: 'branches', label: 'Branches', icon: GitBranch }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Commit Quality Score */}
                        <div className={`p-6 rounded-2xl border ${getQualityColor(commits.averageScore)}`}>
                            <div className="flex items-center justify-between mb-2">
                                <Award className="w-8 h-8" />
                                <span className="text-3xl font-black">{commits.averageScore}</span>
                            </div>
                            <p className="text-sm font-bold">Commit Quality</p>
                            <p className="text-xs opacity-75 mt-1">Average score</p>
                        </div>

                        {/* Total Commits */}
                        <div className="p-6 rounded-2xl border bg-purple-50 border-purple-200 text-purple-600">
                            <div className="flex items-center justify-between mb-2">
                                <GitCommit className="w-8 h-8" />
                                <span className="text-3xl font-black">{commits.totalCommits}</span>
                            </div>
                            <p className="text-sm font-bold">Total Commits</p>
                            <p className="text-xs opacity-75 mt-1">Last 100 commits</p>
                        </div>

                        {/* Conventional Commits */}
                        <div className="p-6 rounded-2xl border bg-cyan-50 border-cyan-200 text-cyan-600">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar className="w-8 h-8" />
                                <span className="text-3xl font-black">{commits.conventionalCommitsPercentage}%</span>
                            </div>
                            <p className="text-sm font-bold">Conventional</p>
                            <p className="text-xs opacity-75 mt-1">Commits format</p>
                        </div>

                        {/* Contributors */}
                        <div className="p-6 rounded-2xl border bg-indigo-50 border-indigo-200 text-indigo-600">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-8 h-8" />
                                <span className="text-3xl font-black">{commits.topContributors.length}</span>
                            </div>
                            <p className="text-sm font-bold">Contributors</p>
                            <p className="text-xs opacity-75 mt-1">Active developers</p>
                        </div>
                    </div>

                    {/* Quality Distribution */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Commit Quality Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(commits.qualityDistribution).map(([quality, count]: [string, any]) => {
                                const percentage = (count / commits.totalCommits) * 100;
                                const colors: any = {
                                    Excellent: 'bg-green-500',
                                    Good: 'bg-blue-500',
                                    Fair: 'bg-yellow-500',
                                    Poor: 'bg-red-500'
                                };

                                return (
                                    <div key={quality}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-bold text-slate-700">{quality}</span>
                                            <span className="text-sm text-slate-600">{count} commits ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[quality]} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Contributors</h3>
                        <div className="space-y-3">
                            {commits.topContributors.map((contributor: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                            {contributor.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{contributor.name}</p>
                                            <p className="text-xs text-slate-600">{contributor.commits} commits</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg border font-bold text-sm ${getQualityColor(contributor.averageScore)}`}>
                                        {contributor.averageScore}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <GitGraphBrowser
                    commits={commits.analyses}
                    owner={repo.full_name.split('/')[0]}
                    repo={repo.full_name.split('/')[1]}
                />
            )}

            {/* PRs Tab */}
            {activeTab === 'prs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">PR Metrics</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total PRs</p>
                                <p className="text-3xl font-black text-slate-900">{pullRequests.totalPRs}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Average Cycle Time</p>
                                <p className="text-3xl font-black text-blue-600">{pullRequests.averageCycleTime} days</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Merge Rate</p>
                                <p className="text-3xl font-black text-green-600">{pullRequests.mergeRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">PR Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <span className="font-bold text-green-900">Merged</span>
                                <span className="text-2xl font-black text-green-600">{pullRequests.mergedPRs}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                <span className="font-bold text-blue-900">Open</span>
                                <span className="text-2xl font-black text-blue-600">{pullRequests.openPRs}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-900">Closed</span>
                                <span className="text-2xl font-black text-slate-600">{pullRequests.closedPRs}</span>
                            </div>
                            {pullRequests.stalePRs > 0 && (
                                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <span className="font-bold text-amber-900">Stale (30+ days)</span>
                                    <span className="text-2xl font-black text-amber-600">{pullRequests.stalePRs}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Branches Tab */}
            {activeTab === 'branches' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <GitBranch className="w-8 h-8 text-purple-600 mb-3" />
                        <p className="text-sm text-slate-600 mb-1">Total Branches</p>
                        <p className="text-4xl font-black text-slate-900">{branches.totalBranches}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                        <p className="text-sm text-slate-600 mb-1">Active Branches</p>
                        <p className="text-4xl font-black text-green-600">{branches.activeBranches}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <Calendar className="w-8 h-8 text-amber-600 mb-3" />
                        <p className="text-sm text-slate-600 mb-1">Stale Branches</p>
                        <p className="text-4xl font-black text-amber-600">{branches.staleBranches}</p>
                    </div>

                    <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Branch Naming Compliance</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                    style={{ width: `${branches.namingCompliance}%` }}
                                />
                            </div>
                            <span className="text-2xl font-black text-blue-600">{branches.namingCompliance}%</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                            Branches following naming conventions (feature/, fix/, etc.)
                        </p>
                    </div>
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
