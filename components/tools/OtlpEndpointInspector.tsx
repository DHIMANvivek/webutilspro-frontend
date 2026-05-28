'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
    Activity,
    AlertTriangle,
    Braces,
    CheckCircle2,
    Clock,
    Copy,
    Database,
    Eye,
    Gauge,
    KeyRound,
    ListChecks,
    Plus,
    RefreshCw,
    Search,
    Server,
    Trash2,
    Workflow
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface OtlpSpan {
    traceId?: string;
    spanId?: string;
    parentSpanId?: string | null;
    name: string;
    kind: string;
    durationMs: number | null;
    status: { code: string; message?: string };
    attributes: Record<string, unknown>;
    events: Array<Record<string, unknown>>;
    links: Array<Record<string, unknown>>;
    resource: Record<string, unknown>;
    scope: { name?: string; version?: string };
}

interface OtlpCapture {
    _id: string;
    signal: string;
    transport: string;
    contentType: string;
    authorizationType: string;
    decoded?: {
        summary: {
            spans: number;
            resources: number;
            services: string[];
            errors: number;
        };
        spans: OtlpSpan[];
        resources: Array<{ index: number; attributes: Record<string, unknown> }>;
    };
    raw?: Record<string, unknown>;
    headers: Record<string, string>;
    query: Record<string, string>;
    ip?: string;
    receivedAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const OTLP_BUCKET_STORAGE_KEY = 'webutilspro.otlp.bucketId';

function extractBucketId(value: string) {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';

    const endpointMatch = trimmedValue.match(/\/api\/otlp\/receive\/([^/?#]+)(?:\/v1\/(?:traces|metrics|logs))?/i);
    if (endpointMatch?.[1]) {
        return endpointMatch[1];
    }

    return trimmedValue;
}

function JsonBlock({ value }: { value: unknown }) {
    return (
        <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {JSON.stringify(value, null, 2)}
        </pre>
    );
}

function Stat({ label, value, tone = 'slate' }: { label: string; value: string | number; tone?: 'slate' | 'emerald' | 'red' | 'blue' }) {
    const color = {
        slate: 'text-slate-900',
        emerald: 'text-emerald-700',
        red: 'text-red-700',
        blue: 'text-blue-700'
    }[tone];

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        </div>
    );
}

function CodeBlock({ code, onCopy }: { code: string; onCopy: (text: string) => void }) {
    return (
        <div className="group relative">
            <button
                onClick={() => onCopy(code)}
                className="absolute right-3 top-3 rounded bg-white/10 p-1.5 text-slate-300 opacity-0 transition hover:bg-white/20 hover:text-white group-hover:opacity-100"
                aria-label="Copy code"
            >
                <Copy className="h-3.5 w-3.5" />
            </button>
            <pre className="overflow-auto rounded-lg bg-slate-950 p-4 pr-12 text-xs leading-5 text-slate-100">
                {code}
            </pre>
        </div>
    );
}

export default function OtlpEndpointInspector() {
    const [bucketId, setBucketId] = useState<string | null>(null);
    const [captures, setCaptures] = useState<OtlpCapture[]>([]);
    const [selectedCapture, setSelectedCapture] = useState<OtlpCapture | null>(null);
    const [selectedSpan, setSelectedSpan] = useState<OtlpSpan | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [existingEndpointInput, setExistingEndpointInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const endpointBase = bucketId ? `${BACKEND_URL}/api/otlp/receive/${bucketId}` : '';
    const tracesEndpoint = `${endpointBase}/v1/traces`;
    const envSnippet = `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=${tracesEndpoint || '<create-an-endpoint-first>'}
OTEL_EXPORTER_OTLP_PROTOCOL=http/json
OTEL_SERVICE_NAME=my-local-app`;
    const nodeInstallSnippet = `npm install @opentelemetry/api \\
  @opentelemetry/sdk-node \\
  @opentelemetry/exporter-trace-otlp-http \\
  @opentelemetry/auto-instrumentations-node`;
    const nodeInstrumentationSnippet = `// tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();`;
    const nodeRunSnippet = `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="${tracesEndpoint || '<your-webutilspro-endpoint>'}" \\
OTEL_EXPORTER_OTLP_PROTOCOL="http/json" \\
OTEL_SERVICE_NAME="my-local-app" \\
node --require ./tracing.js server.js`;

    const createBucket = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/otlp/create`, { method: 'POST' });
            const data = await res.json();
            hydrateBucket(data.bucketId);
            setExistingEndpointInput('');
            toast.success('OTLP endpoint created');
        } catch {
            toast.error('Failed to create OTLP endpoint');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCaptures = useCallback(async () => {
        if (!bucketId) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/otlp/captures/${bucketId}`);
            const data = await res.json();
            setCaptures(data);
            if (!selectedCapture && data[0]) {
                setSelectedCapture(data[0]);
                setSelectedSpan(data[0].decoded?.spans?.[0] || null);
            }
        } catch {
            toast.error('Failed to fetch OTLP exports');
        }
    }, [bucketId, selectedCapture]);

    const clearCaptures = async () => {
        if (!bucketId) return;
        try {
            await fetch(`${BACKEND_URL}/api/otlp/captures/${bucketId}`, { method: 'DELETE' });
            setCaptures([]);
            setSelectedCapture(null);
            setSelectedSpan(null);
            toast.success('OTLP captures cleared');
        } catch {
            toast.error('Failed to clear captures');
        }
    };

    const copyText = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast.success('Copied');
    };

    const hydrateBucket = (nextBucketId: string, nextCaptures: OtlpCapture[] = []) => {
        setBucketId(nextBucketId);
        setCaptures(nextCaptures);
        setSelectedCapture(nextCaptures[0] || null);
        setSelectedSpan(nextCaptures[0]?.decoded?.spans?.[0] || null);
    };

    const openExistingEndpoint = async () => {
        const parsedBucketId = extractBucketId(existingEndpointInput);
        if (!parsedBucketId) {
            toast.error('Paste an OTLP endpoint or bucket ID');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/otlp/captures/${parsedBucketId}`);
            if (!res.ok) {
                throw new Error('OTLP bucket not found');
            }

            const data = await res.json();
            hydrateBucket(parsedBucketId, data);
            toast.success('Existing OTLP endpoint opened');
        } catch {
            toast.error('Could not open that OTLP endpoint');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const savedBucketId = localStorage.getItem(OTLP_BUCKET_STORAGE_KEY);
        if (savedBucketId) {
            setBucketId(savedBucketId);
        }
    }, []);

    useEffect(() => {
        if (bucketId) {
            localStorage.setItem(OTLP_BUCKET_STORAGE_KEY, bucketId);
        } else {
            localStorage.removeItem(OTLP_BUCKET_STORAGE_KEY);
        }
    }, [bucketId]);

    useEffect(() => {
        if (!bucketId) return;

        const socket = io(BACKEND_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            socket.emit('join-room', bucketId);
        });

        socket.on('new-otlp-export', (capture: OtlpCapture) => {
            setCaptures((current) => [capture, ...current]);
            setSelectedCapture(capture);
            setSelectedSpan(capture.decoded?.spans?.[0] || null);
            toast.success('OTLP export captured');
        });

        fetchCaptures();

        return () => {
            socket.disconnect();
        };
    }, [bucketId, fetchCaptures]);

    const spans = selectedCapture?.decoded?.spans || [];
    const filteredSpans = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return spans;
        return spans.filter((span) =>
            span.name.toLowerCase().includes(query) ||
            String(span.resource?.['service.name'] || '').toLowerCase().includes(query) ||
            JSON.stringify(span.attributes || {}).toLowerCase().includes(query)
        );
    }, [spans, searchQuery]);

    const totalSpans = captures.reduce((sum, capture) => sum + (capture.decoded?.summary?.spans || 0), 0);
    const totalErrors = captures.reduce((sum, capture) => sum + (capture.decoded?.summary?.errors || 0), 0);
    const services = [...new Set(captures.flatMap((capture) => capture.decoded?.summary?.services || []))];

    return (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
            <Breadcrumbs
                items={[
                    { name: 'Tools', href: '/#tools', icon: <Workflow className="h-3.5 w-3.5" /> },
                    { name: 'OTLP Endpoint Inspector', href: '/tools/otlp-endpoint-inspector' },
                ]}
            />

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-6 text-white">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded bg-emerald-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">OTel Debugger</span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">OTLP/HTTP</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">OTLP Endpoint Inspector</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                                Point an OpenTelemetry exporter at a temporary WebUtilsPro endpoint and inspect decoded spans, resources, attributes, headers, and auth shape in real time.
                            </p>
                        </div>
                        <button
                            onClick={createBucket}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 disabled:opacity-60"
                        >
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            New OTLP Endpoint
                        </button>
                    </div>
                </div>

                {!bucketId ? (
                    <div className="space-y-6 p-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <Activity className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                                <h2 className="text-xl font-black text-slate-900">Create a temporary OTLP endpoint</h2>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                    OpenTelemetry creates spans inside your app. This tool receives the exported spans and turns OTLP payloads into a readable trace explorer.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-lg border border-slate-200 bg-white p-5">
                                    <h3 className="mb-2 text-sm font-black text-slate-900">Open an existing endpoint</h3>
                                    <p className="mb-4 text-sm leading-6 text-slate-600">
                                        Paste a saved bucket ID or a full OTLP traces URL to reopen the same capture room instead of creating a new one.
                                    </p>
                                    <div className="space-y-3">
                                        <input
                                            value={existingEndpointInput}
                                            onChange={(event) => setExistingEndpointInput(event.target.value)}
                                            placeholder="Bucket ID or https://.../api/otlp/receive/:bucketId/v1/traces"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={openExistingEndpoint}
                                                disabled={isLoading}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Open existing
                                            </button>
                                            <button
                                                onClick={() => setExistingEndpointInput('')}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-5">
                                    <h3 className="mb-3 text-sm font-black text-slate-900">Best fit</h3>
                                    <ul className="space-y-3 text-sm text-slate-600">
                                        <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> OTLP/HTTP JSON traces from local apps and SDKs.</li>
                                        <li className="flex gap-2"><KeyRound className="mt-0.5 h-4 w-4 text-blue-600" /> Basic/Bearer auth header visibility without exposing secrets in the decoded span view.</li>
                                        <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" /> OTLP/gRPC needs a collector or gRPC bridge because browsers/Express do not terminate native gRPC here.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <section className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <ListChecks className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-black text-slate-900">How OpenTelemetry Spans Are Created</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-sm font-black text-slate-900">1. Instrument your app</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">OpenTelemetry SDKs wrap HTTP requests, database calls, framework handlers, or manual code sections. Each timed operation becomes a span.</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-sm font-black text-slate-900">2. Export spans</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">The OTLP exporter batches spans and sends them to the endpoint configured in your app environment variables.</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-sm font-black text-slate-900">3. Inspect here</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">WebUtilsPro receives the OTLP export, decodes spans, and shows service name, trace IDs, attributes, events, errors, and headers.</p>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h3 className="mb-3 text-sm font-black text-slate-900">Minimal Node.js setup</h3>
                                <div className="space-y-3">
                                    <CodeBlock code={nodeInstallSnippet} onCopy={copyText} />
                                    <CodeBlock code={nodeInstrumentationSnippet} onCopy={copyText} />
                                </div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h3 className="mb-3 text-sm font-black text-slate-900">Where to use the endpoint</h3>
                                <p className="mb-3 text-sm leading-6 text-slate-600">Use these env vars in the app you want to inspect, then start that app from the same terminal.</p>
                                <CodeBlock code={nodeRunSnippet} onCopy={copyText} />
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)]">
                        <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
                            <div className="space-y-4 border-b border-slate-200 bg-white p-4">
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Traces endpoint</p>
                                        <button onClick={() => copyText(tracesEndpoint)} className="rounded bg-emerald-600 p-1.5 text-white hover:bg-emerald-700">
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <input readOnly value={tracesEndpoint} className="w-full bg-transparent font-mono text-[11px] text-emerald-900 outline-none" />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <Stat label="Exports" value={captures.length} tone="blue" />
                                    <Stat label="Spans" value={totalSpans} tone="emerald" />
                                    <Stat label="Errors" value={totalErrors} tone={totalErrors ? 'red' : 'slate'} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={fetchCaptures} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Refresh
                                    </button>
                                    <button onClick={clearCaptures} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="p-3">
                                <h3 className="mb-2 px-1 text-[10px] font-black uppercase tracking-wider text-slate-500">Captured exports</h3>
                                <div className="max-h-[470px] space-y-2 overflow-auto">
                                    {captures.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                            Waiting for OTLP exports...
                                        </div>
                                    ) : (
                                        captures.map((capture) => (
                                            <button
                                                key={capture._id}
                                                onClick={() => {
                                                    setSelectedCapture(capture);
                                                    setSelectedSpan(capture.decoded?.spans?.[0] || null);
                                                }}
                                                className={`w-full rounded-lg border p-3 text-left transition ${selectedCapture?._id === capture._id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'}`}
                                            >
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-black uppercase text-white">{capture.signal}</span>
                                                    <span className="text-[10px] font-mono text-slate-500">{new Date(capture.receivedAt).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="truncate text-sm font-bold text-slate-900">
                                                    {capture.decoded ? `${capture.decoded.summary.spans} decoded spans` : 'Binary/raw payload'}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {capture.authorizationType.toUpperCase()} auth · {capture.contentType || 'unknown content type'}
                                                </p>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </aside>

                        <main className="min-w-0 bg-white">
                            <div className="border-b border-slate-200 p-4">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Env var</p>
                                        <code className="mt-1 block truncate text-xs text-slate-900">OTEL_EXPORTER_OTLP_TRACES_ENDPOINT</code>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Services</p>
                                        <p className="mt-1 truncate text-xs font-bold text-slate-900">{services.length ? services.join(', ') : 'No services yet'}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Auth seen</p>
                                        <p className="mt-1 text-xs font-bold text-slate-900">{selectedCapture?.authorizationType?.toUpperCase() || 'None'}</p>
                                    </div>
                                </div>
                            </div>

                            {!selectedCapture ? (
                                <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center text-slate-500">
                                    <Eye className="mb-4 h-12 w-12 text-slate-300" />
                                    <p className="font-bold text-slate-900">No OTLP export selected</p>
                                    <p className="mt-1 text-sm">Send a trace export to the generated endpoint to inspect it here.</p>
                                </div>
                            ) : (
                                <div className="grid min-h-[620px] grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)]">
                                    <section className="border-b border-slate-200 p-4 xl:border-b-0 xl:border-r">
                                        <div className="relative mb-3">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                value={searchQuery}
                                                onChange={(event) => setSearchQuery(event.target.value)}
                                                placeholder="Search spans, service, attributes..."
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                                            />
                                        </div>

                                        <div className="max-h-[560px] space-y-2 overflow-auto">
                                            {selectedCapture.decoded ? filteredSpans.map((span) => (
                                                <button
                                                    key={`${span.traceId}-${span.spanId}`}
                                                    onClick={() => setSelectedSpan(span)}
                                                    className={`w-full rounded-lg border p-3 text-left transition ${selectedSpan?.spanId === span.spanId ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                                                >
                                                    <div className="mb-1 flex items-center justify-between gap-2">
                                                        <p className="truncate text-sm font-black text-slate-900">{span.name}</p>
                                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${span.status.code === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {span.status.code}
                                                        </span>
                                                    </div>
                                                    <p className="truncate text-xs text-slate-500">{String(span.resource?.['service.name'] || 'unknown service')}</p>
                                                    <div className="mt-2 flex items-center gap-3 text-[10px] font-bold uppercase text-slate-500">
                                                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{span.durationMs?.toFixed(2) || '-'}ms</span>
                                                        <span>{span.kind.replace('SPAN_KIND_', '')}</span>
                                                    </div>
                                                </button>
                                            )) : (
                                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                                    Binary/protobuf payload captured. Switch exporter protocol to OTLP/HTTP JSON to decode spans in this MVP.
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section className="min-w-0 space-y-4 p-4">
                                        {selectedSpan ? (
                                            <>
                                                <div className="rounded-lg border border-slate-200 p-4">
                                                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <h2 className="text-xl font-black text-slate-900">{selectedSpan.name}</h2>
                                                            <p className="mt-1 font-mono text-xs text-slate-500">{selectedSpan.traceId} / {selectedSpan.spanId}</p>
                                                        </div>
                                                        <span className={`rounded px-2 py-1 text-xs font-black ${selectedSpan.status.code === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {selectedSpan.status.code}
                                                        </span>
                                                    </div>
                                                    <div className="grid gap-3 md:grid-cols-4">
                                                        <Stat label="Duration" value={`${selectedSpan.durationMs?.toFixed(2) || '-'}ms`} tone="blue" />
                                                        <Stat label="Events" value={selectedSpan.events.length} />
                                                        <Stat label="Links" value={selectedSpan.links.length} />
                                                        <Stat label="Attrs" value={Object.keys(selectedSpan.attributes || {}).length} />
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 lg:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Server className="h-4 w-4" /> Resource</h3>
                                                        <JsonBlock value={selectedSpan.resource} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Braces className="h-4 w-4" /> Attributes</h3>
                                                        <JsonBlock value={selectedSpan.attributes} />
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 lg:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Gauge className="h-4 w-4" /> Events</h3>
                                                        <JsonBlock value={selectedSpan.events} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Database className="h-4 w-4" /> Headers</h3>
                                                        <JsonBlock value={selectedCapture.headers} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-3">
                                                <h2 className="text-lg font-black text-slate-900">Raw capture</h2>
                                                <JsonBlock value={selectedCapture.raw || selectedCapture} />
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}

                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">Node setup</p>
                                        <code className="mt-1 block break-all rounded bg-slate-950 p-3 text-xs text-emerald-300">
                                            {envSnippet}
                                        </code>
                                    </div>
                                    <button onClick={() => copyText(envSnippet)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy env
                                    </button>
                                </div>
                                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Install SDK</p>
                                        <CodeBlock code={nodeInstallSnippet} onCopy={copyText} />
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Run with tracing</p>
                                        <CodeBlock code={nodeRunSnippet} onCopy={copyText} />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                )}
            </section>
        </div>
    );
}
