'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
    Terminal,
    Copy,
    RefreshCw,
    Trash2,
    ExternalLink,
    Clock,
    Globe,
    Database,
    Eye,
    ChevronRight,
    Search,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CapturedRequest {
    _id: string;
    method: string;
    headers: Record<string, string>;
    body: any;
    query: Record<string, string>;
    ip: string;
    receivedAt: string;
}

export default function WebhookInspector() {
    const [bucketId, setBucketId] = useState<string | null>(null);
    const [requests, setRequests] = useState<CapturedRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<CapturedRequest | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false); // This state is no longer used for polling logic, but might be used elsewhere.
    const [searchQuery, setSearchQuery] = useState('');
    const [socket, setSocket] = useState<any>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const WEBHOOK_BASE_URL = `${BACKEND_URL}/api/webhooks/receive`;

    const createBucket = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/webhooks/create`, { method: 'POST' });
            const data = await res.json();
            setBucketId(data.bucketId);
            setRequests([]);
            setSelectedRequest(null);
            // setIsPolling(true); // Removed as polling is replaced by Socket.io
            toast.success('New Webhook Bucket created!');
        } catch (error) {
            toast.error('Failed to create bucket');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequests = useCallback(async () => {
        if (!bucketId) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/webhooks/requests/${bucketId}`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    }, [bucketId, BACKEND_URL]);

    const clearRequests = async () => {
        if (!bucketId) return;
        if (!confirm('Clear all captured requests?')) return;
        try {
            await fetch(`${BACKEND_URL}/api/webhooks/requests/${bucketId}`, { method: 'DELETE' });
            setRequests([]);
            setSelectedRequest(null);
            toast.success('Bucket cleared');
        } catch (error) {
            toast.error('Failed to clear bucket');
        }
    };

    // Removed the old polling useEffect
    // useEffect(() => {
    //     let interval: NodeJS.Timeout;
    //     if (isPolling && bucketId) {
    //         fetchRequests();
    //         interval = setInterval(fetchRequests, 5000);
    //     }
    //     return () => clearInterval(interval);
    // }, [isPolling, bucketId, fetchRequests]);

    useEffect(() => {
        if (!bucketId) return;

        const newSocket = io(BACKEND_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket');
            newSocket.emit('join-room', bucketId);
        });

        newSocket.on('new-request', (newReq: CapturedRequest) => {
            setRequests(prev => [newReq, ...prev]);
            toast.success('New request captured!', { icon: '⚡' });
        });

        setSocket(newSocket);
        fetchRequests(); // Initial fetch

        return () => {
            newSocket.disconnect();
        };
    }, [bucketId, BACKEND_URL, fetchRequests]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const filteredRequests = requests.filter(req =>
        req.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.body ? JSON.stringify(req.body).toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
        (req.query ? JSON.stringify(req.query).toLowerCase() : '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 animate-pulse opacity-20">
                    <Terminal className="w-32 h-32 text-indigo-400/20" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase shadow-lg">DEBUGGER</span>
                        <h1 className="text-4xl font-black tracking-tighter">Webhook Inspector</h1>
                    </div>
                    <p className="text-indigo-200 text-lg max-w-2xl font-medium">
                        Instant webhook buckets for debugging HTTP requests. Capture payloads, headers, and query params in real-time.
                    </p>
                </div>
            </header>

            {!bucketId ? (
                <div className="card p-12 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center animate-bounce">
                        <Globe className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to debug?</h2>
                        <p className="text-slate-500 text-sm">Generate a unique URL to start receiving and inspecting incoming HTTP requests instantly.</p>
                    </div>
                    <button
                        onClick={createBucket}
                        disabled={isLoading}
                        className="btn btn-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-indigo-200 hover:scale-105 transition-all"
                    >
                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Create Webhook URL
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
                    {/* Sidebar: Request List */}
                    <div className="lg:col-span-4 flex flex-col card p-0 border-slate-200 overflow-hidden bg-slate-50/30 shadow-xl">
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Latest Activity
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={fetchRequests} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button onClick={clearRequests} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                                />
                            </div>

                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col gap-2">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Your Private URL</div>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={`${WEBHOOK_BASE_URL}/${bucketId}`}
                                        className="flex-1 bg-transparent border-none text-[11px] font-mono text-indigo-700 outline-none overflow-hidden text-ellipsis"
                                    />
                                    <button onClick={() => copyToClipboard(`${WEBHOOK_BASE_URL}/${bucketId}`)} className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {filteredRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-40">
                                    <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 animate-spin-slow" />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest">Waiting for data...</p>
                                </div>
                            ) : (
                                filteredRequests.map((req) => (
                                    <button
                                        key={req._id}
                                        onClick={() => setSelectedRequest(req)}
                                        className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group
                                            ${selectedRequest?._id === req._id
                                                ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-100'
                                                : 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md
                                                    ${selectedRequest?._id === req._id
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-indigo-100 text-indigo-700'
                                                    }
                                                `}>
                                                    {req.method}
                                                </span>
                                                <span className={`text-[10px] font-mono truncate
                                                    ${selectedRequest?._id === req._id ? 'text-indigo-100' : 'text-slate-400'}
                                                `}>
                                                    {new Date(req.receivedAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className={`text-xs font-medium truncate
                                                ${selectedRequest?._id === req._id ? 'text-white' : 'text-slate-700'}
                                            `}>
                                                {req.body && Object.keys(req.body).length > 0
                                                    ? JSON.stringify(req.body)
                                                    : (req.query && Object.keys(req.query).length > 0
                                                        ? `Query: ${JSON.stringify(req.query)}`
                                                        : 'No payload')}
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1
                                            ${selectedRequest?._id === req._id ? 'text-white' : 'text-slate-300'}
                                        `} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Content: Request Detail */}
                    <div className="lg:col-span-8 card p-0 border-slate-200 overflow-hidden flex flex-col bg-white shadow-2xl">
                        {selectedRequest ? (
                            <>
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-sm">
                                            {selectedRequest.method}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-bold text-slate-800">Captured Request Details</div>
                                            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{selectedRequest._id}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                            <CheckCircle2 className="w-3 h-3" />
                                            STATUS: 200 OK
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono">
                                            IP: {selectedRequest.ip}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                                    {/* Body */}
                                    {selectedRequest.body && Object.keys(selectedRequest.body).length > 0 && (
                                        <section className="space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Database className="w-3 h-3" /> Payload (Body)
                                            </h4>
                                            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm text-indigo-300 shadow-inner group relative">
                                                <button
                                                    onClick={() => copyToClipboard(JSON.stringify(selectedRequest.body, null, 2))}
                                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <pre className="whitespace-pre-wrap">
                                                    {JSON.stringify(selectedRequest.body, null, 2)}
                                                </pre>
                                            </div>
                                        </section>
                                    )}

                                    {/* Query Parameters */}
                                    {selectedRequest.query && Object.keys(selectedRequest.query).length > 0 && (
                                        <section className="space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Globe className="w-3 h-3" /> Query Parameters
                                            </h4>
                                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 font-mono text-sm text-slate-600 shadow-inner group relative">
                                                <button
                                                    onClick={() => copyToClipboard(JSON.stringify(selectedRequest.query, null, 2))}
                                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-slate-200/50 hover:bg-slate-200 rounded-lg"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <pre className="whitespace-pre-wrap">
                                                    {JSON.stringify(selectedRequest.query, null, 2)}
                                                </pre>
                                            </div>
                                        </section>
                                    )}

                                    {(!selectedRequest.body || Object.keys(selectedRequest.body).length === 0) &&
                                        (!selectedRequest.query || Object.keys(selectedRequest.query).length === 0) && (
                                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-30 border-2 border-dashed border-slate-100 rounded-3xl">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                                                    <Database className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">No Payload or Query Data</p>
                                            </div>
                                        )}

                                    {/* Headers */}
                                    <section className="space-y-3">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Headers
                                        </h4>
                                        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50">
                                                        <th className="px-4 py-2 text-[10px] font-black text-slate-500 border-b border-slate-100">KEY</th>
                                                        <th className="px-4 py-2 text-[10px] font-black text-slate-500 border-b border-slate-100">VALUE</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                                                    {Object.entries(selectedRequest.headers || {}).map(([k, v]) => (
                                                        <tr key={k} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 text-indigo-600 font-bold whitespace-nowrap">{k}</td>
                                                            <td className="px-4 py-3 text-slate-600 break-all">{v}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
                                <div className="w-32 h-32 bg-slate-100 rounded-[40px] flex items-center justify-center">
                                    <Eye className="w-16 h-16 text-slate-400" />
                                </div>
                                <div className="max-w-xs">
                                    <p className="text-lg font-bold text-slate-800">Select a request</p>
                                    <p className="text-sm">Click on a request in the sidebar to inspect its full details, headers, and payload.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
}
