'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Save, History, Code, Download, Copy, Check, Loader2, Plus, X, Trash2, ChevronDown, FileText } from 'lucide-react';

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
    const [showCurlImport, setShowCurlImport] = useState(false);
    const [curlCommand, setCurlCommand] = useState('');
    const [isMethodOpen, setIsMethodOpen] = useState(false);

    // Auth State
    const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'apikey'>('none');
    const [authData, setAuthData] = useState({
        token: '',
        username: '',
        password: '',
        key: 'Authorization',
        value: '',
        addTo: 'headers' as 'headers' | 'query'
    });

    const sendRequest = async () => {
        setLoading(true);
        setError(null);
        const startTime = performance.now();

        try {
            const enabledHeaders: Record<string, string> = {};
            headers.filter(h => h.enabled && h.key).forEach(h => {
                enabledHeaders[h.key] = h.value;
            });

            // Handle Auth
            if (authType === 'bearer' && authData.token) {
                enabledHeaders['Authorization'] = `Bearer ${authData.token}`;
            } else if (authType === 'basic' && authData.username) {
                const credentials = btoa(`${authData.username}:${authData.password}`);
                enabledHeaders['Authorization'] = `Basic ${credentials}`;
            } else if (authType === 'apikey' && authData.key && authData.value) {
                if (authData.addTo === 'headers') {
                    enabledHeaders[authData.key] = authData.value;
                }
            }

            let finalUrl = url;
            if (authType === 'apikey' && authData.addTo === 'query' && authData.key && authData.value) {
                const urlObj = new URL(url);
                urlObj.searchParams.append(authData.key, authData.value);
                finalUrl = urlObj.toString();
            }

            const options: RequestInit = {
                method,
                headers: enabledHeaders,
            };

            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                options.body = bodyType === 'json' ? body : body;
            }

            const res = await fetch(finalUrl, options);
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

    const parseCurl = (curlCmd: string) => {
        try {
            // Clean up the command
            const cleaned = curlCmd.trim().replace(/\\\n/g, ' ').replace(/\s+/g, ' ');

            // Extract URL - look for http(s):// pattern
            const urlMatch = cleaned.match(/https?:\/\/[^\s'"]+/i);
            if (urlMatch) {
                setUrl(urlMatch[0]);
            }

            // Extract method (default to GET if not specified)
            const methodMatch = cleaned.match(/-X\s+(\w+)/i) || cleaned.match(/--request\s+(\w+)/i);
            if (methodMatch) {
                setMethod(methodMatch[1].toUpperCase() as HttpMethod);
            } else {
                // Check if there's data - if so, default to POST
                if (cleaned.includes('-d ') || cleaned.includes('--data')) {
                    setMethod('POST');
                } else {
                    setMethod('GET');
                }
            }

            // Extract headers
            const headerRegex = /(?:-H|--header)\s+(['"])(.*?)\1/gi;
            const parsedHeaders: Header[] = [];
            let headerMatch;
            while ((headerMatch = headerRegex.exec(cleaned)) !== null) {
                const content = headerMatch[2];
                const colonIndex = content.indexOf(':');
                if (colonIndex > 0) {
                    const key = content.substring(0, colonIndex).trim();
                    const value = content.substring(colonIndex + 1).trim();
                    parsedHeaders.push({
                        key,
                        value,
                        enabled: true
                    });
                }
            }

            if (parsedHeaders.length > 0) {
                setHeaders(parsedHeaders);
            }

            // Extract body data - handle various formats
            let bodyData = null;

            // Try different data flag patterns
            const dataPatterns = [
                /(?:--data-raw|--data|-d)\s+(['"])(.*?)\1/s,
                /(?:--data-raw|--data|-d)\s+([^\s'"]+)/s,
            ];

            for (const pattern of dataPatterns) {
                const match = cleaned.match(pattern);
                if (match) {
                    bodyData = (match[2] || match[1]).trim();
                    break;
                }
            }

            if (bodyData) {
                // Try to parse as JSON to pretty print it
                try {
                    const parsed = JSON.parse(bodyData);
                    setBody(JSON.stringify(parsed, null, 2));
                    setBodyType('json');
                } catch {
                    // If not valid JSON, just use the raw data
                    setBody(bodyData);
                    setBodyType('raw');
                }
            }

            // Extract Auth
            if (cleaned.match(/-u\s+['"]?([^'"]+)['"]?/i)) {
                const userPass = cleaned.match(/-u\s+['"]?([^'"]+)['"]?/i)![1];
                const [username, password] = userPass.split(':');
                setAuthType('basic');
                setAuthData(prev => ({ ...prev, username, password: password || '' }));
            } else {
                // Check headers for Authorization
                const authHeader = parsedHeaders.find(h => h.key.toLowerCase() === 'authorization');
                if (authHeader) {
                    const authVal = authHeader.value;
                    const authValLower = authVal.toLowerCase();

                    if (authValLower.startsWith('bearer ')) {
                        setAuthType('bearer');
                        setAuthData(prev => ({ ...prev, token: authVal.substring(7).trim() }));
                        setHeaders(parsedHeaders.filter(h => h.key.toLowerCase() !== 'authorization'));
                    } else if (authValLower.startsWith('basic ')) {
                        try {
                            const decoded = atob(authVal.substring(6).trim());
                            const [username, password] = decoded.split(':');
                            setAuthType('basic');
                            setAuthData(prev => ({ ...prev, username, password: password || '' }));
                            setHeaders(parsedHeaders.filter(h => h.key.toLowerCase() !== 'authorization'));
                        } catch (e) {
                            // Leave as manual header
                        }
                    } else if (authValLower.startsWith('key ')) {
                        // Handle "Key" based auth as API Key
                        setAuthType('apikey');
                        setAuthData(prev => ({
                            ...prev,
                            key: 'Authorization',
                            value: authVal, // Preserve the "Key " prefix
                            addTo: 'headers'
                        }));
                        setHeaders(parsedHeaders.filter(h => h.key.toLowerCase() !== 'authorization'));
                    }
                }
            }

            setShowCurlImport(false);
            setCurlCommand('');
        } catch (err) {
            console.error('cURL parse error:', err);
            alert('Failed to parse cURL command. Please check the format.');
        }
    };

    const handleUrlChange = (newUrl: string) => {
        // Detect cURL paste
        if (newUrl.trim().startsWith('curl ')) {
            parseCurl(newUrl);
        } else {
            setUrl(newUrl);
        }
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
                    <div className="relative group">
                        <button
                            onClick={() => setIsMethodOpen(!isMethodOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm min-w-[110px] justify-between shadow-md hover:shadow-lg ${getMethodColor(method)}`}
                        >
                            <span>{method}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMethodOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMethodOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMethodOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/20 py-2 z-50 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                                    {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as HttpMethod[]).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setMethod(m);
                                                setIsMethodOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-gray-50 group/item ${method === m ? 'bg-indigo-50 font-bold' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${m === 'GET' ? 'bg-green-500' :
                                                    m === 'POST' ? 'bg-blue-500' :
                                                        m === 'PUT' ? 'bg-amber-500' :
                                                            m === 'DELETE' ? 'bg-red-500' :
                                                                m === 'PATCH' ? 'bg-purple-500' :
                                                                    'bg-gray-500'
                                                    }`} />
                                                <span className={method === m ? 'text-indigo-700' : 'text-gray-700'}>{m}</span>
                                            </div>
                                            {method === m && <Check className="w-4 h-4 text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <input
                        type="text"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://api.example.com/endpoint"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    />

                    <button
                        onClick={() => setShowCurlImport(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                        title="Import cURL"
                    >
                        <FileText className="w-4 h-4" />
                        Import cURL
                    </button>

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

            {/* cURL Import Modal */}
            {showCurlImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black text-gray-900">Import cURL Command</h3>
                            <button
                                onClick={() => setShowCurlImport(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Paste your cURL command below and we'll automatically parse it into the request builder.
                        </p>
                        <textarea
                            value={curlCommand}
                            onChange={(e) => setCurlCommand(e.target.value)}
                            placeholder="curl -X POST https://api.example.com/data \&#10;  -H 'Content-Type: application/json' \&#10;  -d '{&quot;key&quot;: &quot;value&quot;}'"
                            className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowCurlImport(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => parseCurl(curlCommand)}
                                disabled={!curlCommand.trim()}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 text-white font-bold rounded-lg transition-all"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Auth Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'none', label: 'No Auth' },
                                            { id: 'bearer', label: 'Bearer Token' },
                                            { id: 'basic', label: 'Basic Auth' },
                                            { id: 'apikey', label: 'API Key' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setAuthType(t.id as any)}
                                                className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${authType === t.id
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {authType === 'bearer' && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Token</label>
                                        <input
                                            type="text"
                                            value={authData.token}
                                            onChange={(e) => setAuthData({ ...authData, token: e.target.value })}
                                            placeholder="Enter bearer token"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                        />
                                    </div>
                                )}

                                {authType === 'basic' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={authData.username}
                                                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                                                placeholder="Username"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                                            <input
                                                type="password"
                                                value={authData.password}
                                                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                                                placeholder="Password"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {authType === 'apikey' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Key</label>
                                                <input
                                                    type="text"
                                                    value={authData.key}
                                                    onChange={(e) => setAuthData({ ...authData, key: e.target.value })}
                                                    placeholder="X-API-Key"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={authData.value}
                                                    onChange={(e) => setAuthData({ ...authData, value: e.target.value })}
                                                    placeholder="api-key-value"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Add To</label>
                                            <div className="flex gap-2">
                                                {['headers', 'query'].map((pos) => (
                                                    <button
                                                        key={pos}
                                                        onClick={() => setAuthData({ ...authData, addTo: pos as any })}
                                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${authData.addTo === pos
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pos.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {authType === 'none' && (
                                    <div className="text-center py-12 text-gray-400">
                                        <p className="text-sm">This request does not use any authentication.</p>
                                    </div>
                                )}
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
