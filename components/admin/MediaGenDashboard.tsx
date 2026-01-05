'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Play, RefreshCw, CheckCircle2, AlertCircle, Key, Layout, Image as ImageIcon, History } from 'lucide-react';

const TOOLS_LIST = [
    { id: 'regex-tester', name: 'Regex Tester', description: 'Test and debug regular expressions with real-time matching and highlighting.' },
    { id: 'json-to-csv', name: 'JSON ↔ CSV Converter', description: 'Convert between JSON and CSV formats instantly with validation.' },
    { id: 'markdown-to-html', name: 'Markdown → HTML', description: 'Convert Markdown to HTML with live preview and syntax highlighting.' },
    { id: 'ai-error-explainer', name: 'AI Error Explainer', description: 'Get AI-powered explanations and fixes for programming errors.' },
    { id: 'prompt-optimizer', name: 'Prompt Optimizer', description: 'Optimize your AI prompts for better results and clarity.' },
    { id: 'pdf-extractor', name: 'PDF Text Extractor', description: 'Extract text from complex PDFs containing images with AI.' },
    { id: 'code-formatter', name: 'Code Formatter', description: 'Beautify JavaScript, HTML, CSS, JSON, and SQL code instantly.' },
    { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings for data transmission.' },
    { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Convert URLs to safe encoded format and back.' },
    { id: 'color-picker', name: 'Color Picker & Gradients', description: 'Pick colors, convert formats, and generate CSS gradients.' },
    { id: 'jwt-decoder', name: 'JWT Decoder & Hash Generator', description: 'Decode JWT tokens and generate cryptographic hashes.' },
    { id: 'text-tools', name: 'Text Tools', description: 'Count characters/words, convert case, and clean up text.' },
    { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Generate custom QR codes for URLs, text, and more.' },
    { id: 'password-generator', name: 'Password Generator', description: 'Create secure passwords and check password strength.' },
    { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique identifiers (UUIDs) instantly.' },
    { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs and mockups.' },
    { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Convert Unix timestamps to dates and vice versa.' },
    { id: 'diff-checker', name: 'Diff Checker', description: 'Compare text files and highlight differences.' },
    { id: 'html-encoder', name: 'HTML Encoder/Decoder', description: 'Encode/decode HTML entities for security and display.' },
    { id: 'json-validator', name: 'JSON Validator', description: 'Validate, format, and minify JSON data instantly.' },
    { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images to reduce file size and improve performance.' },
    { id: 'minifier', name: 'Minifier', description: 'Minify JavaScript, CSS, and HTML for production.' },
    { id: 'xml-formatter', name: 'XML Formatter', description: 'Format, validate, and convert XML documents.' },
    { id: 'yaml-tools', name: 'YAML Tools', description: 'Convert YAML ↔ JSON and validate YAML files.' },
    { id: 'sketch-board', name: 'Sketch Board', description: 'Real-time collaborative whiteboard for diagrams and ideas.' },
    { id: 'api-playground', name: 'API Playground', description: 'Professional REST API testing tool. Test APIs with code generation.' },
    { id: 'cron-job-generator', name: 'Cron Job Generator', description: 'Visual schedule builder for cron expressions with natural language.' },
    { id: 'og-image-generator', name: 'OG Image Generator', description: 'Design and preview Open Graph social sharing cards.' },
    { id: 'http-headers-analyzer', name: 'HTTP Headers Analyzer', description: 'Analyze website security headers and get a security grade.' },
    { id: 'push-notifications', name: 'Push Notifications', description: 'Add web push notifications to your site with powerful management dashboard.' },
    { id: 'woocommerce', name: 'WooCommerce', description: 'Secure store management with AI chat and full CRUD features.' },
    { id: 'mcp-tester', name: 'MCP Tool Tester', description: 'Test and debug Model Context Protocol servers in a live sandbox.' }
];

interface ToolJob {
    _id: string;
    toolId: string;
    jobId: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ERROR';
    imageUrl?: string;
    error?: string;
}

export default function MediaGenDashboard() {
    const [token, setToken] = useState('');
    const [cookies, setCookies] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [jobs, setJobs] = useState<ToolJob[]>([]);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);
    const [isTouching, setIsTouching] = useState(false);
    const [isBlogLoading, setIsBlogLoading] = useState<string | null>(null);
    const [authStatus, setAuthStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
    const [adminSecret, setAdminSecret] = useState('');

    const getBackendUrl = () => {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api/media';
        // If it's just the base domain/port, add the media API prefix
        if (url && !url.includes('/api/media')) {
            return `${url}/api/media`;
        }
        return url;
    };
    const backendUrl = getBackendUrl();

    // Fetch all recent jobs from backend
    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/jobs`, {
                headers: {
                    'x-admin-secret': adminSecret
                }
            });
            const data = await response.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    }, [backendUrl, adminSecret]);

    // Sync pending jobs with Higgsfield
    const syncStatus = useCallback(async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            const response = await fetch(`${backendUrl}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ token, cookies })
            });
            const data = await response.json();

            const hasAuthError = data.results?.some((r: any) => r.error?.toLowerCase().includes('401') || r.error?.toLowerCase().includes('unauthorized'));
            if (hasAuthError) {
                setAuthStatus('invalid');
                console.warn('Sync auth failure detected');
            } else if (data.results?.length > 0) {
                setAuthStatus('valid');
            }

            await fetchJobs();
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [backendUrl, fetchJobs, isSyncing, token, cookies]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    /* 
    useEffect(() => {
        // Clear interval auto-sync if we don't have a token to work with
        const hasPending = Array.isArray(jobs) && jobs.some(j => j.status === 'PENDING');
        if (hasPending && token) {
            const timer = setInterval(syncStatus, 15000);
            return () => clearInterval(timer);
        }
    }, [jobs, syncStatus, token]);
    */

    const generateAll = async () => {
        if (!token) {
            alert('Please provide a Higgsfield Bearer Token first!');
            return;
        }

        setIsGlobalLoading(true);
        try {
            const response = await fetch(`${backendUrl}/generate-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ token, cookies })
            });

            if (!response.ok) throw new Error('Failed to initiate batch');

            // Wait 2 seconds for server to process initial jobs
            setTimeout(fetchJobs, 2000);
        } catch (error: any) {
            alert('Generation failed: ' + error.message);
        } finally {
            setIsGlobalLoading(false);
        }
    };

    const generateTool = async (toolId: string) => {
        if (!token) {
            alert('Please provide a Higgsfield Bearer Token first!');
            return;
        }

        try {
            await fetch(`${backendUrl}/generate/${toolId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ token, cookies })
            });
            setTimeout(fetchJobs, 1000);
        } catch (error: any) {
            alert('Generation failed: ' + error.message);
        } finally {
            fetchJobs();
        }
    };

    const migrateImages = async () => {
        if (isMigrating) return;
        setIsMigrating(true);
        try {
            const response = await fetch(`${backendUrl}/migrate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ token, cookies })
            });
            const data = await response.json();
            alert(`Migration complete! Processed ${data.migratedCount} images.`);
            await fetchJobs();
        } catch (error: any) {
            alert('Migration failed: ' + error.message);
        } finally {
            setIsMigrating(false);
        }
    };

    const touchSession = async () => {
        if (!sessionId) {
            alert('Please provide a Clerk Session ID first!');
            return;
        }

        setIsTouching(true);
        try {
            const response = await fetch(`${backendUrl}/touch-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ sessionId, cookies })
            });

            if (response.ok) {
                alert('Session touched successfully!');
            } else {
                throw new Error('Touch failed');
            }
        } catch (error: any) {
            alert('Touch failed: ' + error.message);
        } finally {
            setIsTouching(false);
        }
    };

    const regenerateBlog = async (toolId: string) => {
        setIsBlogLoading(toolId);
        try {
            const response = await fetch(`${backendUrl}/regenerate-blog/${toolId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                }
            });
            if (response.ok) {
                alert('Blog regeneration started successfully! It may take a few minutes to complete.');
            } else {
                const error = await response.json();
                alert('Failed to regenerate blog: ' + (error.message || 'Unknown error'));
            }
        } catch (error: any) {
            alert('Failed to regenerate blog: ' + error.message);
        } finally {
            setIsBlogLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                            Media Engine Dashboard
                        </h1>
                        <p className="text-slate-400">Asynchronous Batch Generator v2</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={migrateImages}
                            disabled={isMigrating}
                            title="Download existing external images to local VPS"
                            className={`flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700/50 ${isMigrating ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            <ImageIcon className={isMigrating ? 'animate-pulse text-blue-400' : ''} size={18} />
                            Migrate Legacy
                        </button>
                        <button
                            onClick={syncStatus}
                            className={`flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700/50 ${isSyncing ? 'opacity-50' : ''}`}
                        >
                            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={18} />
                            Sync Status
                        </button>
                        <button
                            onClick={generateAll}
                            disabled={isGlobalLoading || !token}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {isGlobalLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                            Trigger All Tools
                        </button>
                    </div>
                </div>

                {/* Configuration */}
                {authStatus === 'invalid' && (
                    <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400">
                        <AlertCircle className="shrink-0" />
                        <div className="text-left">
                            <p className="font-bold text-sm">Authentication Expired</p>
                            <p className="text-xs opacity-80">Your Higgsfield session has expired. Please refresh higgsfield.ai and paste a new token.</p>
                        </div>
                    </div>
                )}

                <div className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-xl">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold">
                        <Key size={18} />
                        <h3>Admin Control Key</h3>
                    </div>
                    <div>
                        <input
                            type="password"
                            value={adminSecret}
                            onChange={(e) => setAdminSecret(e.target.value.replace(/[^\x20-\x7E]/g, ''))}
                            placeholder="Enter Admin Secret to enable controls..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-700 font-mono"
                        />
                        <p className="text-[10px] text-slate-600 mt-2 text-left italic">Internal access only. Controls remain disabled until the correct secret is provided.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-indigo-400 font-semibold">
                            <Key size={18} />
                            <h3>Higgsfield Auth (Fresh Required)</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-left text-left">Bearer Token</label>
                                <textarea
                                    value={token}
                                    onChange={(e) => {
                                        setToken(e.target.value);
                                        setAuthStatus('unknown');
                                    }}
                                    placeholder="Paste Bearer token (eyJ...)"
                                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-700"
                                />
                                <p className="text-[10px] text-slate-600 mt-2 text-left italic">Tokens last 60s. Copy from browser DevTools Authorization header.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-blue-400 font-semibold text-left">
                            <Layout size={18} />
                            <h3>Session Cookies</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-left text-left">Cookie String</label>
                                <textarea
                                    value={cookies}
                                    onChange={(e) => {
                                        setCookies(e.target.value);
                                        setAuthStatus('unknown');
                                    }}
                                    placeholder="Paste Cookie string (cf_clearance=...)"
                                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-700"
                                />
                                <p className="text-[10px] text-slate-600 mt-2 text-left italic">Used for bot detection bypass. Copy from same request as token.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-rose-400 font-semibold">
                                <Sparkles size={18} />
                                <h3>Session Life Support (Touch)</h3>
                            </div>
                            <button
                                onClick={touchSession}
                                disabled={isTouching || !sessionId}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 rounded-lg text-xs font-black transition-all flex items-center gap-2"
                            >
                                {isTouching ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
                                TOUCH SESSION
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                placeholder="Paste Clerk Session ID (sess_...)"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-700 font-mono"
                            />
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2 text-left italic">
                            Extends the life of your token. Get the ID from the URL provided in the Clerk touch request.
                        </p>
                    </div>
                </div>

                {/* Tracking Area */}
                <div className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest border-b border-slate-800 pb-2">
                    <History size={16} />
                    Active Generation Tasks
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {TOOLS_LIST.map((tool) => {
                        // Find latest job for this tool
                        const job = Array.isArray(jobs) ? jobs.find(j => j.toolId === tool.id) : null;

                        return (
                            <div key={tool.id} className="group bg-slate-900/40 border border-slate-800/50 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-900/60 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg mb-1 group-hover:text-indigo-300 transition-colors text-left">{tool.name}</h4>
                                    <p className="text-sm text-slate-500 text-left">{tool.description}</p>

                                    {job?.status === 'COMPLETED' && job.imageUrl && (
                                        <div className="flex gap-4 mt-3">
                                            <a href={job.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors font-medium underline underline-offset-4 decoration-green-900">
                                                <ImageIcon size={14} />
                                                View Visual
                                            </a>
                                        </div>
                                    )}

                                    {job?.status === 'FAILED' && (
                                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium bg-red-500/5 px-2 py-1 rounded inline-block">
                                            <AlertCircle size={14} />
                                            {job.error || 'Check server logs'}
                                        </p>
                                    )}
                                </div>

                                <div className="ml-4 flex flex-col items-end gap-2">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => generateTool(tool.id)}
                                            disabled={!token || !adminSecret}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            <Play size={14} fill="currentColor" />
                                            RUN MEDIA
                                        </button>
                                        <button
                                            onClick={() => regenerateBlog(tool.id)}
                                            disabled={!adminSecret || isBlogLoading === tool.id}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            {isBlogLoading === tool.id ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                            GEN BLOG
                                        </button>
                                    </div>

                                    {job?.status === 'COMPLETED' && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-black">
                                            <CheckCircle2 size={16} />
                                            PUBLISHED
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Tip */}
                <div className="mt-12 p-8 bg-gradient-to-br from-indigo-900/10 to-blue-900/10 rounded-2xl border border-slate-800 text-center">
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
                        <span className="text-white font-black uppercase mr-2 tracking-widest bg-indigo-600 px-2 py-0.5 rounded text-[10px]">Turbo Mode</span>
                        Backend will trigger all 10 tools in parallel within seconds. Once triggered, the token is no longer strictly needed for polling completion.
                        <strong> Images automatically sync to blog posts upon completion.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
