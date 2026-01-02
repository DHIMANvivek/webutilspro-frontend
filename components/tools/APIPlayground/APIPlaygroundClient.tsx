'use client';

import { useState } from 'react';
import { Send, Save, History, Code, Download, Copy, Check, Loader2, Plus, X, Trash2 } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface Header {
    key: string;
    value: string;
    enabled: boolean;
}

interface SavedRequest {
    id: string;
    name: string;
    method: HttpMethod;
    url: string;
    headers: Header[];
    body: string;
    timestamp: number;
}

export default function APIPlaygroundClient() {
    // Request State
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
    const [headers, setHeaders] = useState<Header[]>([
        { key: 'Content-Type', value: 'application/json', enabled: true }
    ]);
    const [body, setBody] = useState('');
    const [bodyType, setBodyType] = useState<'json' | 'form' | 'raw'>('json');

    // Response State
    const [response, setResponse] = useState<any>(null);
    const [responseTime, setResponseTime] = useState<number>(0);
    const [responseSize, setResponseSize] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'auth'>('body');
    const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
    const [copied, setCopied] = useState(false);
    const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
    const [requestHistory, setRequestHistory] = useState<SavedRequest[]>([]);

    const sendRequest = async () => {
        setLoading(true);
        setError(null);
        const startTime = performance.now();

        try {
            const enabledHeaders: Record<string, string> = {};
            headers.filter(h => h.enabled && h.key).forEach(h => {
                enabledHeaders[h.key] = h.value;
            });

            const options: RequestInit = {
                method,
                headers: enabledHeaders,
            };

            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                options.body = bodyType === 'json' ? body : body;
            }

            const res = await fetch(url, options);
            const endTime = performance.now();

            const data = await res.json();
            const responseText = JSON.stringify(data, null, 2);

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                data: data,
                body: responseText
            });

            setResponseTime(Math.round(endTime - startTime));
            setResponseSize(new Blob([responseText]).size);

            // Add to history
            const historyItem: SavedRequest = {
                id: Date.now().toString(),
                name: `${method} ${url}`,
                method,
                url,
                headers,
                body,
                timestamp: Date.now()
            };
            setRequestHistory(prev => [historyItem, ...prev].slice(0, 50));

        } catch (err: any) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '', enabled: true }]);
    };

    const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [field]: value };
        setHeaders(newHeaders);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const copyResponse = () => {
        if (response?.body) {
            navigator.clipboard.writeText(response.body);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const saveRequest = () => {
        const saved: SavedRequest = {
            id: Date.now().toString(),
            name: `${method} ${url}`,
            method,
            url,
            headers,
            body,
            timestamp: Date.now()
        };
        setSavedRequests(prev => [saved, ...prev]);
    };

    const loadRequest = (req: SavedRequest) => {
        setMethod(req.method);
        setUrl(req.url);
        setHeaders(req.headers);
        setBody(req.body);
    };

    const getMethodColor = (m: string) => {
        switch (m) {
            case 'GET': return 'bg-green-500 hover:bg-green-600';
            case 'POST': return 'bg-blue-500 hover:bg-blue-600';
            case 'PUT': return 'bg-amber-500 hover:bg-amber-600';
            case 'DELETE': return 'bg-red-500 hover:bg-red-600';
            case 'PATCH': return 'bg-purple-500 hover:bg-purple-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-green-50 text-green-700 border-green-200';
        if (status >= 400 && status < 500) return 'bg-amber-50 text-amber-700 border-amber-200';
        if (status >= 500) return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <div className="container-custom py-6">
            {/* Compact Request Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex gap-3 items-center">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as HttpMethod)}
                        className={`px-4 py-2.5 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm ${getMethodColor(method)}`}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>

                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://api.example.com/endpoint"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    />

                    <button
                        onClick={sendRequest}
                        disabled={loading || !url}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Left: Request Config */}
                <div className="col-span-4 space-y-3">
                    {/* Tabs */}
                    <div className="flex gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        {['body', 'headers', 'auth'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 px-3 py-2 rounded-md font-semibold text-sm transition-all ${activeTab === tab
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
                        {activeTab === 'body' && (
                            <div>
                                <div className="flex gap-2 mb-3">
                                    {['json', 'form', 'raw'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setBodyType(type as any)}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${bodyType === type
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'Request body...'}
                                    className="w-full h-80 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none"
                                />
                            </div>
                        )}

                        {activeTab === 'headers' && (
                            <div className="space-y-2">
                                {headers.map((header, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={header.enabled}
                                            onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            value={header.key}
                                            onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            value={header.value}
                                            onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={() => removeHeader(index)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addHeader}
                                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Header
                                </button>
                            </div>
                        )}

                        {activeTab === 'auth' && (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-sm">Auth options coming soon</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Response */}
                <div className="col-span-5">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
                        {response ? (
                            <>
                                {/* Status Bar */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-lg font-bold text-sm border ${getStatusColor(response.status)}`}>
                                            {response.status} {response.statusText}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">
                                            {responseTime}ms
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">
                                            {(responseSize / 1024).toFixed(2)}KB
                                        </span>
                                    </div>
                                    <button
                                        onClick={copyResponse}
                                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 p-2 border-b border-gray-200">
                                    {['body', 'headers'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setResponseTab(tab as any)}
                                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${responseTab === tab
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    {responseTab === 'body' ? (
                                        <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                                            {response.body}
                                        </pre>
                                    ) : (
                                        <div className="space-y-2">
                                            {Object.entries(response.headers as Record<string, string>).map(([key, value]) => (
                                                <div key={key} className="flex gap-2 text-sm bg-white p-2 rounded-lg">
                                                    <span className="font-mono font-bold text-indigo-600">{key}:</span>
                                                    <span className="font-mono text-gray-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : error ? (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">⚠️</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-600 mb-2">Request Failed</h3>
                                    <p className="text-gray-600 text-sm">{error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Test</h3>
                                    <p className="text-gray-500 text-sm">Enter a URL and click Send</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: History */}
                <div className="col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <History className="w-4 h-4 text-indigo-600" />
                            History
                        </h3>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {requestHistory.length > 0 ? (
                                requestHistory.map((req) => (
                                    <button
                                        key={req.id}
                                        onClick={() => loadRequest(req)}
                                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.method === 'GET' ? 'bg-green-100 text-green-700' :
                                                    req.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                                        req.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}>
                                                {req.method}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate group-hover:text-indigo-600 font-mono">
                                            {new URL(req.url).pathname}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-8">No history yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
