'use client';

import { useState, useEffect } from 'react';
import { Github, LogOut, Loader2, AlertCircle } from 'lucide-react';
import GitPlatformAuth from '@/components/tools/GitInsights/GitPlatformAuth';
import RepoSelector from '@/components/tools/GitInsights/RepoSelector';
import Dashboard from '@/components/tools/GitInsights/Dashboard';
import toast from 'react-hot-toast';

interface GitUser {
    id: string;
    login: string;
    name: string;
    avatar: string;
    email: string;
    publicRepos?: number;
}

interface AuthState {
    authenticated: boolean;
    user: GitUser | null;
    loading: boolean;
}

export default function GitInsightsClient() {
    const [platform, setPlatform] = useState<'github' | 'gitlab' | null>(null);
    const [authState, setAuthState] = useState<AuthState>({
        authenticated: false,
        user: null,
        loading: true
    });
    const [selectedRepo, setSelectedRepo] = useState<any>(null);

    // Check authentication status on mount
    useEffect(() => {
        // Initial auth check
        checkAllAuthStatus();

        // Check for OAuth callback
        const params = new URLSearchParams(window.location.search);
        const authStatus = params.get('auth');
        const queryPlatform = params.get('platform') as 'github' | 'gitlab' | null;

        if (authStatus === 'success') {
            toast.success(`Successfully authenticated with ${queryPlatform === 'gitlab' ? 'GitLab' : 'GitHub'}!`);
            if (queryPlatform) setPlatform(queryPlatform);
            // Clean URL
            window.history.replaceState({}, '', '/tools/git-insights');
            checkAuthStatus(queryPlatform || 'github');
        } else if (authStatus === 'error') {
            toast.error('Authentication failed. Please try again.');
            window.history.replaceState({}, '', '/tools/git-insights');
        }
    }, []);

    const checkAllAuthStatus = async () => {
        // Try GitHub first, if not then try GitLab
        const ghStatus = await fetchAuthStatus('github');
        if (ghStatus?.authenticated) {
            setPlatform('github');
            setAuthState({ authenticated: true, user: ghStatus.user, loading: false });
        } else {
            const glStatus = await fetchAuthStatus('gitlab');
            if (glStatus?.authenticated) {
                setPlatform('gitlab');
                setAuthState({ authenticated: true, user: glStatus.user, loading: false });
            } else {
                setAuthState({ authenticated: false, user: null, loading: false });
            }
        }
    };

    const fetchAuthStatus = async (plat: 'github' | 'gitlab') => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/${plat}/auth/status`, {
                credentials: 'include'
            });
            if (response.ok) return await response.json();
        } catch (error) {
            console.error(`${plat} auth check failed:`, error);
        }
        return null;
    };

    const checkAuthStatus = async (plat: 'github' | 'gitlab') => {
        const status = await fetchAuthStatus(plat);
        if (status?.authenticated) {
            setAuthState({ authenticated: true, user: status.user, loading: false });
        } else {
            setAuthState({ authenticated: false, user: null, loading: false });
        }
    };

    const handleLogin = async (plat: 'github' | 'gitlab') => {
        try {
            setPlatform(plat);
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/${plat}/auth/login`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.authUrl;
            } else {
                toast.error(`Failed to initiate ${plat} login`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Failed to connect to server');
        }
    };

    const handleLogout = async () => {
        if (!platform) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/${platform}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setAuthState({ authenticated: false, user: null, loading: false });
                setSelectedRepo(null);
                setPlatform(null);
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
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Unlock Your Repository Insights
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Analyze commit quality, visualize git graphs, and track productivity across **GitHub** and **GitLab**.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                        { icon: '📊', title: 'Commit Quality', description: 'Rule-based scoring with actionable feedback' },
                        { icon: '🌳', title: 'Visual Git Graph', description: 'Interactive commit history with branch visualization' },
                        { icon: '🔄', title: 'PR/MR Metrics', description: 'Cycle time, merge rate, and review analytics' },
                        { icon: '👥', title: 'Team Insights', description: 'Contributor stats and productivity trends' }
                    ].map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <GitPlatformAuth onLogin={handleLogin} />
            </div>
        );
    }

    // Authenticated - show main interface
    return (
        <div className="space-y-8">
            <div className={`flex items-center justify-between bg-gradient-to-r ${platform === 'gitlab' ? 'from-orange-600 to-orange-500' : 'from-slate-900 to-slate-800'} rounded-2xl p-6 border border-white/10`}>
                <div className="flex items-center gap-4">
                    <img src={authState.user.avatar} className="w-14 h-14 rounded-full border-2 border-white/20" />
                    <div>
                        <h3 className="text-lg font-bold text-white">{authState.user.name}</h3>
                        <p className="text-sm text-white/70">
                            {platform === 'gitlab' ? 'GitLab' : 'GitHub'}: @{authState.user.login}
                        </p>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/5">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            <RepoSelector platform={platform!} onSelectRepo={setSelectedRepo} selectedRepo={selectedRepo} />
            {selectedRepo && <Dashboard platform={platform!} repo={selectedRepo} />}
        </div>
    );
}
