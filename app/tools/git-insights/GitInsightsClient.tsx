'use client';

import { useState, useEffect } from 'react';
import { Github, LogOut, Loader2, AlertCircle } from 'lucide-react';
import GitHubAuth from '@/components/tools/GitInsights/GitHubAuth';
import RepoSelector from '@/components/tools/GitInsights/RepoSelector';
import Dashboard from '@/components/tools/GitInsights/Dashboard';
import toast from 'react-hot-toast';

interface GitHubUser {
    id: string;
    login: string;
    name: string;
    avatar: string;
    email: string;
    publicRepos: number;
}

interface AuthState {
    authenticated: boolean;
    user: GitHubUser | null;
    loading: boolean;
}

export default function GitInsightsClient() {
    const [authState, setAuthState] = useState<AuthState>({
        authenticated: false,
        user: null,
        loading: true
    });
    const [selectedRepo, setSelectedRepo] = useState<any>(null);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();

        // Check for OAuth callback
        const params = new URLSearchParams(window.location.search);
        const authStatus = params.get('auth');

        if (authStatus === 'success') {
            toast.success('Successfully authenticated with GitHub!');
            // Clean URL
            window.history.replaceState({}, '', '/tools/git-insights');
            checkAuthStatus();
        } else if (authStatus === 'error') {
            toast.error('GitHub authentication failed. Please try again.');
            window.history.replaceState({}, '', '/tools/git-insights');
        }
    }, []);

    const checkAuthStatus = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/github/auth/status`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setAuthState({
                    authenticated: data.authenticated,
                    user: data.user || null,
                    loading: false
                });
            } else {
                setAuthState({ authenticated: false, user: null, loading: false });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setAuthState({ authenticated: false, user: null, loading: false });
        }
    };

    const handleLogin = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/github/auth/login`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.authUrl;
            } else {
                toast.error('Failed to initiate GitHub login');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Failed to connect to server');
        }
    };

    const handleLogout = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/github/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setAuthState({ authenticated: false, user: null, loading: false });
                setSelectedRepo(null);
                toast.success('Logged out successfully');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Failed to logout');
        }
    };

    // Loading state
    if (authState.loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!authState.authenticated || !authState.user) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/20">
                        <Github className="w-4 h-4 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                            Powered by GitHub API
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Unlock Your Repository Insights
                    </h2>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Analyze commit quality, visualize git graphs, track PR metrics, and monitor team productivity - all for free.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                        {
                            icon: '📊',
                            title: 'Commit Quality Analysis',
                            description: 'Rule-based scoring for commit messages with actionable feedback'
                        },
                        {
                            icon: '🌳',
                            title: 'Visual Git Graph',
                            description: 'Interactive commit DAG with branch visualization'
                        },
                        {
                            icon: '🔄',
                            title: 'PR Metrics',
                            description: 'Cycle time, merge rate, and review analytics'
                        },
                        {
                            icon: '👥',
                            title: 'Team Insights',
                            description: 'Contributor stats and productivity trends'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-500/30 transition-all hover:shadow-lg"
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Auth Component */}
                <GitHubAuth onLogin={handleLogin} />

                {/* Security Note */}
                <div className="mt-8 bg-blue-50 border border-blue-200/60 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Secure & Private</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Your GitHub access token is encrypted and stored securely in our session.
                                We never store your code or expose your credentials. All data is cached temporarily for performance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated - show main interface
    return (
        <div className="space-y-8">
            {/* User Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-4">
                    <img
                        src={authState.user.avatar}
                        alt={authState.user.name}
                        className="w-14 h-14 rounded-full border-2 border-white/20"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-white">{authState.user.name}</h3>
                        <p className="text-sm text-slate-300">@{authState.user.login} · {authState.user.publicRepos} repositories</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* Repository Selector */}
            <RepoSelector onSelectRepo={setSelectedRepo} selectedRepo={selectedRepo} />

            {/* Dashboard */}
            {selectedRepo && <Dashboard repo={selectedRepo} />}
        </div>
    );
}
