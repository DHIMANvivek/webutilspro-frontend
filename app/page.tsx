'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Activity,
    ArrowRight,
    BadgeCheck,
    Box,
    Braces,
    CheckCircle2,
    Cloud,
    Code2,
    Database,
    FileCode2,
    Gauge,
    GitBranch,
    Globe2,
    KeyRound,
    LayoutGrid,
    LockKeyhole,
    MessageSquareText,
    Network,
    PlayCircle,
    RadioTower,
    RefreshCw,
    Search,
    ServerCog,
    ShieldCheck,
    Sparkles,
    TerminalSquare,
    Webhook,
    Workflow,
    Zap,
    type LucideIcon
} from 'lucide-react';

type Tool = {
    id: string;
    name: string;
    description: string;
    href: string;
    category: string;
    featured?: boolean;
    status?: 'new' | 'preview' | 'live';
};

type FlociStatus = {
    connected: boolean;
    endpoint?: string;
    latencyMs?: number;
    error?: string;
};

type DynamicTool = Partial<Tool> & { id: string };

const DEFAULT_TOOLS: Tool[] = [
    { id: 'cloud-lab', name: 'Cloud Lab', description: 'Test AWS-style S3, SQS, SNS, Lambda, DynamoDB, API Gateway, and webhook flows through WebUtilsPro.', href: '/tools/cloud-lab', category: 'Cloud', featured: true, status: 'new' },
    { id: 'webhook-inspector', name: 'Webhook Inspector', description: 'Capture and debug incoming HTTP requests in real time with zero configuration.', href: '/tools/webhook-inspector', category: 'Developer', featured: true, status: 'live' },
    { id: 'api-playground', name: 'API Playground', description: 'Professional REST API testing with code generation and request history.', href: '/tools/api-playground', category: 'Developer', featured: true, status: 'live' },
    { id: 'mcp-tester', name: 'MCP Tool Tester', description: 'Test and debug Model Context Protocol servers in a live sandbox.', href: '/tools/mcp-tester', category: 'AI', featured: true, status: 'live' },
    { id: 'otlp-endpoint-inspector', name: 'OTLP Endpoint Inspector', description: 'Capture OpenTelemetry exports and inspect decoded spans, resources, and attributes.', href: '/tools/otlp-endpoint-inspector', category: 'Developer', featured: true, status: 'live' },
    { id: 'database-architect', name: 'Visual DB Architect', description: 'Design database schemas visually with a draggable interactive canvas.', href: '/tools/database-architect', category: 'Database', featured: true, status: 'live' },
    { id: 'regex-tester', name: 'Regex Tester', description: 'Test and debug regular expressions with real-time matching and highlighting.', href: '/tools/regex-tester', category: 'Text' },
    { id: 'json-to-csv', name: 'JSON to CSV Converter', description: 'Convert between JSON and CSV formats instantly with validation.', href: '/tools/json-to-csv', category: 'Data' },
    { id: 'markdown-to-html', name: 'Markdown to HTML', description: 'Convert Markdown to HTML with live preview and syntax highlighting.', href: '/tools/markdown-to-html', category: 'Content' },
    { id: 'ai-error-explainer', name: 'AI Error Explainer', description: 'Get AI-powered explanations and fixes for programming errors.', href: '/tools/ai-error-explainer', category: 'AI' },
    { id: 'prompt-optimizer', name: 'Prompt Optimizer', description: 'Optimize your AI prompts for better results and clarity.', href: '/tools/prompt-optimizer', category: 'AI' },
    { id: 'pdf-extractor', name: 'PDF Text Extractor', description: 'Extract text from complex PDFs containing images with AI.', href: '/tools/pdf-extractor', category: 'AI' },
    { id: 'transcript-generator', name: 'Transcript Generator', description: 'Convert speech to text instantly in your browser.', href: '/tools/transcript-generator', category: 'Utilities' },
    { id: 'javascript-compiler', name: 'JavaScript Compiler', description: 'Run, test, and debug JavaScript online with console output and syntax checks.', href: '/tools/javascript-compiler', category: 'Code' },
    { id: 'code-formatter', name: 'Code Formatter', description: 'Beautify JavaScript, HTML, CSS, JSON, and SQL code instantly.', href: '/tools/code-formatter', category: 'Code' },
    { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings for data transmission.', href: '/tools/base64', category: 'Encoding' },
    { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Convert URLs to safe encoded format and back.', href: '/tools/url-encoder', category: 'Encoding' },
    { id: 'color-picker', name: 'Color Picker', description: 'Pick colors, convert formats, and generate CSS gradients.', href: '/tools/color-picker', category: 'Design' },
    { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JWT tokens and generate cryptographic hashes.', href: '/tools/jwt-decoder', category: 'Security' },
    { id: 'text-tools', name: 'Text Tools', description: 'Count characters and words, convert case, and clean up text.', href: '/tools/text-tools', category: 'Utilities' },
    { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Generate custom QR codes for URLs, text, and more.', href: '/tools/qr-code-generator', category: 'Utilities' },
    { id: 'password-generator', name: 'Password Generator', description: 'Create secure passwords and check password strength.', href: '/tools/password-generator', category: 'Security' },
    { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique identifiers instantly.', href: '/tools/uuid-generator', category: 'Utilities' },
    { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs and mockups.', href: '/tools/lorem-ipsum-generator', category: 'Text' },
    { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Convert Unix timestamps to dates and back.', href: '/tools/timestamp-converter', category: 'Utilities' },
    { id: 'diff-checker', name: 'Diff Checker', description: 'Compare text files and highlight differences.', href: '/tools/diff-checker', category: 'Utilities' },
    { id: 'html-encoder', name: 'HTML Encoder', description: 'Encode and decode HTML entities for security and display.', href: '/tools/html-encoder', category: 'Web' },
    { id: 'json-validator', name: 'JSON Validator', description: 'Validate, format, and minify JSON data instantly.', href: '/tools/json-validator', category: 'Data' },
    { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images to reduce file size and improve performance.', href: '/tools/image-compressor', category: 'Media' },
    { id: 'minifier', name: 'Minifier', description: 'Minify JavaScript, CSS, and HTML for production.', href: '/tools/minifier', category: 'Web' },
    { id: 'xml-formatter', name: 'XML Formatter', description: 'Format, validate, and convert XML documents.', href: '/tools/xml-formatter', category: 'Data' },
    { id: 'yaml-tools', name: 'YAML Tools', description: 'Convert YAML to JSON and validate YAML files.', href: '/tools/yaml-tools', category: 'Data' },
    { id: 'sketch-board', name: 'Sketch Board', description: 'Real-time collaborative whiteboard for diagrams and ideas.', href: '/tools/sketch-board', category: 'Design' },
    { id: 'cron-job-generator', name: 'Cron Job Generator', description: 'Visual schedule builder for cron expressions with natural language.', href: '/tools/cron-job-generator', category: 'Utilities' },
    { id: 'og-image-generator', name: 'OG Image Generator', description: 'Design and preview Open Graph social sharing cards.', href: '/tools/og-image-generator', category: 'Design' },
    { id: 'http-headers-analyzer', name: 'HTTP Headers Analyzer', description: 'Analyze website security headers and get a security grade.', href: '/tools/http-headers-analyzer', category: 'Security' },
    { id: 'push-notifications', name: 'Push Notifications', description: 'Add web push notifications with a management dashboard.', href: '/tools/push-notifications', category: 'Services' },
    { id: 'woocommerce', name: 'WooCommerce', description: 'Secure store management with AI chat and CRUD workflows.', href: '/tools/woocommerce', category: 'Services' },
    { id: 'git-insights', name: 'Git Insights', description: 'Analyze GitHub repos with commit quality scoring and visual analytics.', href: '/tools/git-insights', category: 'Developer' },
    { id: 'tailwind-animations', name: 'Tailwind Animations', description: 'Design GPU-accelerated Tailwind animations.', href: '/tools/tailwind-animations', category: 'Design' },
    { id: 'zod-schema-generator', name: 'Zod Schema Factory', description: 'Transform JSON, TS, and GraphQL into Zod schemas.', href: '/tools/zod-schema-generator', category: 'Data' },
    { id: 'tailwind-factory', name: 'Tailwind Design Factory', description: 'Build Tailwind design systems with color, spacing, and radius anchors.', href: '/tools/tailwind-factory', category: 'Design' },
    { id: 'sql-performance-architect', name: 'SQL Performance Architect', description: 'Visualize Postgres EXPLAIN plans with an execution tree.', href: '/tools/sql-performance-architect', category: 'Database' },
    { id: 'steam-region-pricing', name: 'Steam Pricing Explorer', description: 'Compare Steam game prices across global regions.', href: '/tools/steam-region-pricing', category: 'Utilities' },
    { id: 'passport-visa-map', name: 'Passport Visa Map', description: 'Visualize global travel freedom and visa requirements.', href: '/tools/passport-visa-map', category: 'Travel' },
    { id: 'jwt-security-audit', name: 'JWT Security Auditor', description: 'Simulate breaches and test JWT security with active attacks.', href: '/tools/jwt-security-audit', category: 'Security' },
    { id: 'drive-converter', name: 'Drive Uploader', description: 'Upload files to Google Drive and generate shareable links.', href: '/tools/drive-converter', category: 'Utilities' },
    { id: 'schema-forge', name: 'Schema-Forge Architect', description: 'Turn JSON into a fullstack blueprint in seconds.', href: '/tools/schema-forge', category: 'Developer' },
    { id: 'readme-architect', name: 'Readme.md Architect', description: 'Create GitHub profile READMEs without writing code.', href: '/tools/readme-architect', category: 'Developer' },
    { id: 'algo-rhythm', name: 'AlgoRhythm', description: '3D sorting visualizer with procedural audio.', href: '/tools/algo-rhythm', category: 'Developer' },
    { id: 'cyber-trace', name: 'Cyber Trace', description: 'Visualize network paths on an interactive 3D globe.', href: '/tools/cyber-trace', category: 'Utilities' }
];

const CLOUD_PIPELINE = [
    {
        id: 'capture',
        label: 'Webhook',
        title: 'Capture',
        detail: 'Payloads',
        definition: 'Collect third-party callbacks in a private WebUtilsPro bucket, preserve the raw request, and turn messy external events into reusable test fixtures.',
        metric: 'live',
        icon: Webhook,
        href: '/tools/webhook-inspector',
        connects: ['webhooks', 'observability', 'playground']
    },
    {
        id: 'route',
        label: 'SQS / SNS',
        title: 'Route',
        detail: 'Queues',
        definition: 'Replay the captured event into managed queues and topics so workers, subscribers, and async jobs see the same input shape they get in production.',
        metric: '<1s',
        icon: RadioTower,
        href: '/tools/cloud-lab',
        connects: ['webhooks', 'queues', 'observability', 'playground']
    },
    {
        id: 'execute',
        label: 'Lambda',
        title: 'Execute',
        detail: 'Handlers',
        definition: 'Invoke function templates against the selected event, inspect responses, and keep unsafe arbitrary code behind backend sandbox controls.',
        metric: 'local',
        icon: Zap,
        href: '/tools/cloud-lab',
        connects: ['functions', 'queues', 'schemas', 'playground']
    },
    {
        id: 'store',
        label: 'S3 / DDB',
        title: 'Store',
        detail: 'Fixtures',
        definition: 'Write payload snapshots and derived records into managed S3 or DynamoDB fixtures without touching a real AWS account.',
        metric: 'zero bill',
        icon: Database,
        href: '/tools/cloud-lab',
        connects: ['storage', 'schemas', 'cost-control', 'deploy-notes']
    },
    {
        id: 'inspect',
        label: 'Trace',
        title: 'Inspect',
        detail: 'Debug',
        definition: 'Compare webhook input, service output, generated CLI commands, and logs so teams can debug before they ship the workflow.',
        metric: 'debug',
        icon: Search,
        href: '/tools/cloud-lab',
        connects: ['observability', 'functions', 'cost-control', 'deploy-notes']
    }
];

const PIPELINE_TILES = [
    { id: 'webhooks', label: 'Webhooks', href: '/tools/webhook-inspector', definition: 'Captured payloads, headers, query params, and replay-ready examples.' },
    { id: 'queues', label: 'Queues', href: '/tools/cloud-lab', definition: 'Exercise SQS and SNS delivery behavior before production wiring.' },
    { id: 'functions', label: 'Functions', href: '/tools/cloud-lab', definition: 'Validate Lambda handlers against realistic event data.' },
    { id: 'storage', label: 'Storage', href: '/tools/cloud-lab', definition: 'Persist payload snapshots in managed S3 or DynamoDB fixtures.' },
    { id: 'cost-control', label: 'Cost control', href: '/tools/cloud-lab', definition: 'Keep tests managed by WebUtilsPro and avoid cloud bills during iteration.' },
    { id: 'observability', label: 'Observability', href: '/tools/otlp-endpoint-inspector', definition: 'Decoded requests, Lambda responses, queue messages, and status checks in one traceable view.' },
    { id: 'playground', label: 'Playground', href: '/tools/api-playground', definition: 'Run selected AWS-like actions from a guided browser cockpit.' },
    { id: 'schemas', label: 'Schemas', href: '/tools/schema-forge', definition: 'Promote stable webhook shapes into reusable typed payload contracts.' },
    { id: 'deploy-notes', label: 'Deploy notes', href: '/tools/cloud-lab', definition: 'Copy commands and implementation notes after a workflow passes.' }
];

const HERO_METRICS = [
    { label: 'AWS-shaped services', value: '50+', source: 'managed runtime' },
    { label: 'Webhook replay targets', value: '5', source: 'S3/SQS/SNS/Lambda/EventBridge' },
    { label: 'Default sandbox TTL', value: '30m', source: 'session isolated' }
];

const CAPABILITY_GROUPS = [
    {
        title: 'Cloud Emulation',
        body: 'Create managed AWS-style resources, run integration paths, and inspect state without touching a real AWS bill.',
        icon: Cloud,
        href: '/tools/cloud-lab',
        items: ['S3 buckets', 'SQS queues', 'SNS topics', 'DynamoDB tables']
    },
    {
        title: 'Event Debugging',
        body: 'Capture third-party webhooks and replay them into the same queues, topics, and functions your app expects.',
        icon: Webhook,
        href: '/tools/webhook-inspector',
        items: ['Payload capture', 'Header view', 'Replay plans', 'Socket updates']
    },
    {
        title: 'Developer Workbench',
        body: 'Use focused tools around APIs, MCP, schemas, logs, auth, and formatting from the same operating surface.',
        icon: Workflow,
        href: '#tools',
        items: ['API tests', 'MCP debug', 'Schema design', 'JWT audit']
    }
];

const STATUS_FALLBACK: FlociStatus = {
    connected: false,
    endpoint: 'managed-runtime'
};

const categoryIcons: Record<string, LucideIcon> = {
    AI: Sparkles,
    Cloud,
    Code: Code2,
    Content: FileCode2,
    Data: Braces,
    Database,
    Design: LayoutGrid,
    Developer: TerminalSquare,
    Encoding: KeyRound,
    Media: Box,
    Security: ShieldCheck,
    Services: Network,
    Text: MessageSquareText,
    Travel: Globe2,
    Utilities: Gauge,
    Web: Globe2
};

const statusLabels: Record<NonNullable<Tool['status']>, string> = {
    live: 'Live',
    new: 'New',
    preview: 'Preview'
};

export default function HomePage() {
    const [tools, setTools] = useState<Tool[]>(DEFAULT_TOOLS);
    const [flociStatus, setFlociStatus] = useState<FlociStatus>(STATUS_FALLBACK);
    const [isRefreshingStatus, setIsRefreshingStatus] = useState(true);
    const [activePipelineId, setActivePipelineId] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    useEffect(() => {
        const controller = new AbortController();

        async function fetchHomepageData() {
            setIsRefreshingStatus(true);
            const toolRequest = fetch(`${backendUrl}/api/media/public-tools`, { signal: controller.signal })
                .then((response) => response.ok ? response.json() : [])
                .catch(() => []);

            const flociRequest = fetch(`${backendUrl}/api/floci/status`, { signal: controller.signal })
                .then((response) => response.ok ? response.json() : STATUS_FALLBACK)
                .catch(() => STATUS_FALLBACK);

            const [dynamicTools, status] = await Promise.all([toolRequest, flociRequest]);

            if (Array.isArray(dynamicTools)) {
                const merged = DEFAULT_TOOLS.map((tool) => {
                    const dynamic = dynamicTools.find((item: DynamicTool) => item.id === tool.id);
                    return dynamic ? { ...tool, ...dynamic } : tool;
                });
                setTools(merged);
            }

            setFlociStatus(status);
            setIsRefreshingStatus(false);
        }

        fetchHomepageData();

        return () => controller.abort();
    }, [backendUrl]);

    const featuredTools = useMemo(() => tools.filter((tool) => tool.featured).slice(0, 6), [tools]);

    const categoryRows = useMemo(() => {
        const counts = tools.reduce<Record<string, number>>((acc, tool) => {
            acc[tool.category] = (acc[tool.category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([category, count]) => ({ category, count }));
    }, [tools]);

    const liveMetricRows = useMemo(() => [
        ...HERO_METRICS,
        { label: 'Tools available', value: `${tools.length}`, source: 'dynamic catalog' },
        { label: 'Lab runtime', value: flociStatus.connected ? 'online' : 'queued', source: 'WebUtilsPro managed' }
    ], [flociStatus.connected, tools.length]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f7f1] text-neutral-950">
            <style jsx>{`
                .paper-grid {
                    background-image:
                        linear-gradient(to right, rgba(22, 22, 18, 0.055) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(22, 22, 18, 0.055) 1px, transparent 1px);
                    background-size: 18px 18px;
                }

                .blueprint-tiles {
                    background-image:
                        linear-gradient(to right, rgba(31, 31, 26, 0.08) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(31, 31, 26, 0.08) 1px, transparent 1px);
                    background-size: 52px 52px;
                }

                .lab-stage-card {
                    box-shadow: 10px 14px 0 rgba(23, 23, 20, 0.08);
                }

                .lab-stage-card::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 60px;
                    height: 24px;
                    border-top: 1px solid rgba(23, 23, 20, 0.25);
                    border-bottom: 1px solid rgba(23, 23, 20, 0.12);
                    background: linear-gradient(90deg, rgba(251, 255, 93, 0.06), rgba(251, 255, 93, 0.38), rgba(251, 255, 93, 0.08));
                }

                .lab-stage-card::after {
                    content: '';
                    position: absolute;
                    right: 20px;
                    bottom: 18px;
                    width: 16px;
                    height: 16px;
                    border-radius: 999px;
                    border: 2px solid #1f1f1a;
                    background: transparent;
                }
            `}</style>

            <section className="paper-grid relative border-b border-neutral-900/10">
                <div className="blueprint-tiles absolute inset-0 opacity-25" />
                <div className="absolute inset-x-0 top-0 h-px bg-neutral-900/15" />

                <div className="container-custom relative z-10 py-8 md:py-12">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 border border-neutral-900/20 bg-[#fbfbf4] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-700">
                            <Cloud className="h-3.5 w-3.5" />
                            WebUtilsPro managed cloud lab
                        </div>

                        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-neutral-950 md:text-7xl">
                            WebUtilsPro Cloud Lab for AWS-style workflows
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-600 md:text-xl">
                            Capture real webhook data, replay it into AWS-style services, test functions in managed sessions, and move from idea to production with a clear debugging loop.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/tools/cloud-lab"
                                className="inline-flex h-12 items-center gap-2 border border-neutral-950 bg-neutral-950 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5"
                            >
                                Start Lab
                                <PlayCircle className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#tools"
                                className="inline-flex h-12 items-center gap-2 border border-neutral-900/20 bg-[#fbfbf4] px-5 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-900 transition-colors hover:border-neutral-950"
                            >
                                Browse Tools
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-5">
                        {liveMetricRows.map((metric) => (
                            <div key={metric.label} className="bg-[#fbfbf4]/90 p-4">
                                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{metric.label}</div>
                                <div className="mt-2 text-3xl font-semibold text-neutral-950">{metric.value}</div>
                                <div className="mt-1 truncate text-xs text-neutral-500">{metric.source}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <CloudPipelineDiagram
                    stages={CLOUD_PIPELINE}
                    activeStageId={activePipelineId}
                    onActiveStageChange={setActivePipelineId}
                />
            </section>

            <section id="cloud-lab" className="border-b border-neutral-900/10 bg-[#fbfbf4] py-20">
                <div className="container-custom">
                    <SectionIntro
                        eyebrow="The cloud development loop"
                        title="Build, trigger, emulate, inspect, and repeat."
                        body="The homepage is driven from reusable arrays: every stage, metric, capability, setup step, and tool card comes from structured data or backend API responses."
                    />

                    <div className="mt-12 grid gap-px border border-neutral-900/15 bg-neutral-900/15 lg:grid-cols-3">
                        {CAPABILITY_GROUPS.map((group) => {
                            const Icon = group.icon;
                            return (
                                <Link
                                    key={group.title}
                                    href={group.href}
                                    className="group bg-[#fbfbf4] p-6 transition-colors hover:bg-[#ffffd9]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <Icon className="h-6 w-6 text-neutral-900" />
                                        <ArrowRight className="h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900" />
                                    </div>
                                    <h3 className="mt-7 text-2xl font-semibold tracking-normal text-neutral-950">{group.title}</h3>
                                    <p className="mt-3 min-h-20 text-sm leading-6 text-neutral-600">{group.body}</p>
                                    <div className="mt-6 grid grid-cols-2 gap-px bg-neutral-900/15">
                                        {group.items.map((item) => (
                                            <div key={item} className="bg-[#fbfbf4]/90 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-600">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="tools" className="bg-[#fbfbf4] py-20">
                <div className="container-custom">
                    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                        <SectionIntro
                            eyebrow="Dynamic tool catalog"
                            title="One integrated workspace, rendered from data."
                            body="The catalog merges local defaults with your backend media/tool API, then derives featured cards and category counts at runtime."
                        />

                        <div className="grid grid-cols-2 gap-px border border-neutral-900/15 bg-neutral-900/15 sm:grid-cols-4">
                            {categoryRows.map((row) => {
                                const Icon = categoryIcons[row.category] || Box;
                                return (
                                    <div key={row.category} className="bg-[#fbfbf4] p-4">
                                        <Icon className="mb-5 h-5 w-5 text-neutral-800" />
                                        <div className="text-2xl font-semibold">{row.count}</div>
                                        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">{row.category}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-12 grid gap-px border border-neutral-900/15 bg-neutral-900/15 lg:grid-cols-3">
                        {featuredTools.map((tool) => (
                            <ToolFeatureCard key={tool.id} tool={tool} />
                        ))}
                    </div>

                    <div className="mt-10 grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-2 lg:grid-cols-4">
                        {tools.slice(0, 24).map((tool) => (
                            <ToolListItem key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function LiveStatusPanel({ status, isRefreshing }: { status: FlociStatus; isRefreshing: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 border border-neutral-900/15 bg-[#fbfbf4]/80 px-4 py-3">
            <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${status.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">Cloud Lab runtime</div>
                    <div className="max-w-52 truncate text-sm font-semibold text-neutral-900">
                        {status.connected ? 'WebUtilsPro managed' : 'session setup'}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                {isRefreshing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {status.connected ? `${status.latencyMs || 0}ms` : 'setup'}
            </div>
        </div>
    );
}

function CloudPipelineDiagram({
    stages,
    activeStageId,
    onActiveStageChange
}: {
    stages: typeof CLOUD_PIPELINE;
    activeStageId: string | null;
    onActiveStageChange: (stageId: string | null) => void;
}) {
    const activeStage = activeStageId ? stages.find((stage) => stage.id === activeStageId) || null : null;
    const isFiltered = Boolean(activeStage);
    const highlightedTiles = new Set(activeStage ? activeStage.connects : PIPELINE_TILES.map((tile) => tile.id));
    const cardWidth = 214;
    const cardHeight = 132;
    const tileWidth = 168;
    const tileHeight = 36;
    const stageGeometry = [
        { x: 74, y: 86 },
        { x: 326, y: 86 },
        { x: 578, y: 86 },
        { x: 830, y: 86 },
        { x: 1082, y: 86 }
    ];
    const tileGeometry = [
        { id: 'webhooks', x: 74, y: 410 },
        { id: 'queues', x: 260, y: 410 },
        { id: 'observability', x: 446, y: 410 },
        { id: 'playground', x: 632, y: 410 },
        { id: 'schemas', x: 818, y: 410 },
        { id: 'functions', x: 1004, y: 410 },
        { id: 'storage', x: 260, y: 474 },
        { id: 'cost-control', x: 632, y: 474 },
        { id: 'deploy-notes', x: 1004, y: 474 }
    ];
    const tilePositionById = new Map(tileGeometry.map((position) => [position.id, position]));
    const busY = 334;
    const stageBottomY = stageGeometry[0].y + cardHeight;
    const activeStageIndex = activeStage ? Math.max(stages.findIndex((stage) => stage.id === activeStage.id), 0) : -1;
    const activeStagePosition = activeStageIndex >= 0 ? stageGeometry[activeStageIndex] : null;
    const activeStageCenterX = activeStagePosition ? activeStagePosition.x + cardWidth / 2 : 0;
    const activeTileCenters = activeStage
        ? activeStage.connects
            .map((tileId) => tilePositionById.get(tileId))
            .filter(Boolean)
            .map((position) => (position?.x || 0) + tileWidth / 2)
        : [];
    const activePathStartX = activeTileCenters.length ? Math.min(activeStageCenterX, ...activeTileCenters) : activeStageCenterX;
    const activePathEndX = activeTileCenters.length ? Math.max(activeStageCenterX, ...activeTileCenters) : activeStageCenterX;

    function renderStage(stage: (typeof CLOUD_PIPELINE)[number], index: number) {
        const geometry = stageGeometry[index];
        const isHighlighted = !isFiltered || activeStage?.id === stage.id;
        const labelParts = stage.label.includes(' / ') ? stage.label.split(' / ') : [stage.label];
        const metricWidth = stage.metric.length > 5 ? 76 : 48;
        const metricX = geometry.x + cardWidth - metricWidth - 20;

        return (
            <a
                key={stage.id}
                href={stage.href}
                onMouseEnter={() => onActiveStageChange(stage.id)}
                onFocus={() => onActiveStageChange(stage.id)}
                aria-label={`${stage.label}: ${stage.definition}`}
                className="cursor-pointer outline-none"
            >
                <g opacity={isHighlighted ? 1 : 0.18} filter={isHighlighted ? 'url(#stageShadow)' : undefined}>
                    <rect x={geometry.x + 8} y={geometry.y + 10} width={cardWidth} height={cardHeight} fill="#1f1f1a" opacity={isHighlighted ? 0.1 : 0.02} />
                    <rect
                        x={geometry.x}
                        y={geometry.y}
                        width={cardWidth}
                        height={cardHeight}
                        fill="#fffefa"
                        stroke="#1f1f1a"
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                    />
                    <rect x={geometry.x + 1} y={geometry.y + 52} width={cardWidth - 2} height="18" fill="#fbff5d" opacity={isHighlighted ? 0.18 : 0.06} />
                    <line x1={geometry.x + 1} y1={geometry.y + 53} x2={geometry.x + cardWidth - 1} y2={geometry.y + 44} stroke="#d8d8c9" strokeWidth="1.1" />
                    <line x1={geometry.x + 1} y1={geometry.y + 72} x2={geometry.x + cardWidth - 1} y2={geometry.y + 63} stroke="#d8d8c9" strokeWidth="1.1" />
                    {[0, 1, 2].map((tick) => (
                        <line
                            key={tick}
                            x1={geometry.x + 20 + tick * 6}
                            y1={geometry.y + 8}
                            x2={geometry.x + 20 + tick * 6}
                            y2={geometry.y + 22}
                            stroke="#b8b8ad"
                            strokeWidth="2"
                        />
                    ))}
                    <text x={geometry.x + 22} y={geometry.y + 36} fontFamily="monospace" fontSize="13" letterSpacing="4" fill="#77776e">
                        {stage.title.toUpperCase()}
                    </text>
                    <rect x={metricX} y={geometry.y + 18} width={metricWidth} height="21" fill="#fbff5d" stroke="#b7b73f" strokeWidth="1" opacity={isHighlighted ? 1 : 0.35} />
                    <text x={metricX + metricWidth / 2} y={geometry.y + 33} textAnchor="middle" fontFamily="monospace" fontSize="9.5" fontWeight="700" letterSpacing="1" fill="#1f1f1a">
                        {stage.metric.toUpperCase()}
                    </text>
                    <text x={geometry.x + 22} y={geometry.y + 82} fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fill="#050505">
                        {labelParts[0]}
                    </text>
                    {labelParts[1] && (
                        <text x={geometry.x + 22} y={geometry.y + 110} fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fill="#050505">
                            {labelParts[1]}
                        </text>
                    )}
                    {!labelParts[1] && (
                        <text x={geometry.x + 22} y={geometry.y + 107} fontFamily="Inter, sans-serif" fontSize="14" fill="#62625a">
                            {stage.detail}
                        </text>
                    )}
                    <circle cx={geometry.x + cardWidth - 40} cy={geometry.y + cardHeight - 26} r="4" fill="#fbff5d" stroke="#1f1f1a" strokeWidth="1" opacity={isHighlighted ? 1 : 0.35} />
                    <circle cx={geometry.x + cardWidth - 29} cy={geometry.y + cardHeight - 30} r="4" fill="#fbff5d" stroke="#1f1f1a" strokeWidth="1" opacity={isHighlighted ? 1 : 0.35} />
                </g>
            </a>
        );
    }

    return (
        <div className="relative z-10 -mt-2 border-t border-neutral-900/10 pb-10">
            <div className="overflow-x-auto px-4 py-4 md:py-5">
                <svg
                    viewBox="0 0 1400 620"
                    className="mx-auto block h-auto max-h-[420px] min-w-[760px] max-w-[960px]"
                    role="img"
                    aria-label="Interactive WebUtilsPro Cloud Lab workflow diagram"
                    onMouseLeave={() => onActiveStageChange(null)}
                >
                    <defs>
                        <filter id="stageShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="10" dy="14" stdDeviation="0" floodColor="#1f1f1a" floodOpacity="0.12" />
                        </filter>
                    </defs>

                    <g opacity="0.3">
                        {Array.from({ length: 12 }).map((_, row) => (
                            <g key={`bg-row-${row}`} transform={`translate(${(row % 2) * 86}, ${row * 48 - 16})`}>
                                {Array.from({ length: 8 }).map((__, column) => (
                                    <rect
                                        key={`bg-${row}-${column}`}
                                        x={column * 176 - 80}
                                        y="0"
                                        width="142"
                                        height="34"
                                        fill="none"
                                        stroke="#1f1f1a"
                                        strokeOpacity="0.12"
                                    />
                                ))}
                            </g>
                        ))}
                    </g>

                    <g>
                        <path
                            d="M 82 350 L 82 318 L 1304 318 L 1304 350 Z"
                            fill="#fbff5d"
                            stroke="#1f1f1a"
                            strokeWidth="2"
                            opacity={isFiltered ? 0.14 : 0.34}
                        />
                        <path
                            d="M 106 334 H 1280"
                            fill="none"
                            stroke="#1f1f1a"
                            strokeWidth="1.5"
                            opacity={isFiltered ? 0.16 : 0.72}
                        />
                        <text
                            x="62"
                            y="334"
                            transform="rotate(-90 62 334)"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="monospace"
                            fontSize="15"
                            fontWeight="700"
                            fill="#1f1f1a"
                            opacity="0.72"
                        >
                            Development
                        </text>
                        <text
                            x="1324"
                            y="334"
                            transform="rotate(90 1324 334)"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="monospace"
                            fontSize="15"
                            fontWeight="700"
                            fill="#1f1f1a"
                            opacity="0.72"
                        >
                            Production
                        </text>

                        <g pointerEvents="none">
                            {stages.map((stage, index) => {
                                const geometry = stageGeometry[index];
                                const centerX = geometry.x + cardWidth / 2;
                                const isHighlighted = !isFiltered || activeStage?.id === stage.id;
                                return (
                                    <g key={`${stage.id}-stage-drop`} opacity={isHighlighted ? (isFiltered ? 1 : 0.72) : 0.08}>
                                        <path d={`M ${centerX} ${stageBottomY} V ${busY}`} fill="none" stroke="#fbff5d" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
                                        <path d={`M ${centerX} ${stageBottomY} V ${busY}`} fill="none" stroke="#1f1f1a" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx={centerX} cy={stageBottomY} r="6" fill="#fbff5d" stroke="#1f1f1a" strokeWidth="2" />
                                    </g>
                                );
                            })}

                            {tileGeometry.map((position) => {
                                const centerX = position.x + tileWidth / 2;
                                const isHighlighted = highlightedTiles.has(position.id);
                                return (
                                    <g key={`${position.id}-tile-drop`} opacity={isHighlighted ? (isFiltered ? 1 : 0.62) : 0.08}>
                                        <path d={`M ${centerX} ${busY} V ${position.y}`} fill="none" stroke="#fbff5d" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
                                        <path d={`M ${centerX} ${busY} V ${position.y}`} fill="none" stroke="#1f1f1a" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx={centerX} cy={position.y} r="5" fill="#fbff5d" stroke="#1f1f1a" strokeWidth="1.6" />
                                    </g>
                                );
                            })}

                            {activeStage && activeStagePosition && (
                                <g>
                                    <path
                                        d={`M ${activeStageCenterX} ${stageBottomY} V ${busY} M ${activePathStartX} ${busY} H ${activePathEndX}`}
                                        fill="none"
                                        stroke="#fbff5d"
                                        strokeWidth="14"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        opacity="0.52"
                                    />
                                    <path
                                        d={`M ${activeStageCenterX} ${stageBottomY} V ${busY} M ${activePathStartX} ${busY} H ${activePathEndX}`}
                                        fill="none"
                                        stroke="#1f1f1a"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            )}
                        </g>

                        {stages.map((stage, index) => renderStage(stage, index))}

                        {PIPELINE_TILES.map((tile) => {
                            const position = tilePositionById.get(tile.id);
                            if (!position) return null;
                            const isHighlighted = highlightedTiles.has(tile.id);
                            const relatedStage = stages.find((stage) => stage.connects.includes(tile.id));
                            return (
                                <a
                                    key={tile.id}
                                    href={tile.href}
                                    onMouseEnter={() => onActiveStageChange(relatedStage?.id || null)}
                                    onFocus={() => onActiveStageChange(relatedStage?.id || null)}
                                    aria-label={`${tile.label}: ${tile.definition}`}
                                    className="cursor-pointer outline-none"
                                >
                                    <g opacity={isHighlighted ? 1 : 0.18}>
                                        <rect
                                            x={position.x + 6}
                                            y={position.y + 7}
                                            width={tileWidth}
                                            height={tileHeight}
                                            fill="#1f1f1a"
                                            opacity={isHighlighted ? 0.08 : 0.02}
                                        />
                                        <rect
                                            x={position.x}
                                            y={position.y}
                                            width={tileWidth}
                                            height={tileHeight}
                                            fill={isHighlighted ? '#fbff5d' : '#fbfbf4'}
                                            stroke="#1f1f1a"
                                            strokeWidth={isHighlighted ? 2 : 1.2}
                                        />
                                        <text
                                            x={position.x + tileWidth / 2}
                                            y={position.y + 23}
                                            textAnchor="middle"
                                            fontFamily="monospace"
                                            fontSize="11"
                                            fontWeight="700"
                                            letterSpacing="1.4"
                                            fill="#1f1f1a"
                                        >
                                            {tile.label}
                                        </text>
                                    </g>
                                </a>
                            );
                        })}
                    </g>
                </svg>
            </div>

            <div className="container-custom">
                <div className="relative border border-neutral-900/30 bg-[#fbfbf4]/92 px-6 py-6 md:px-8">
                    <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-neutral-900" />
                    <span className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-neutral-900" />
                    <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-neutral-900" />
                    <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-neutral-900" />
                    <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr] lg:items-center">
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                                {activeStage ? `${activeStage.label} definition` : 'Full workflow'}
                            </div>
                            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950">
                                {activeStage ? activeStage.title : 'Local AWS loop'}
                            </h2>
                        </div>
                        <div>
                            <p className="text-lg leading-8 text-neutral-600">
                                {activeStage
                                    ? `${activeStage.definition} Move away from the diagram to show the full highlighted workflow again.`
                                    : 'Every stage and service is highlighted by default. Hover a stage or connected service to isolate that part of the AWS-style workflow.'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(activeStage ? activeStage.connects : PIPELINE_TILES.map((tile) => tile.id)).map((tileId) => {
                                    const tile = PIPELINE_TILES.find((item) => item.id === tileId);
                                    return (
                                        <Link key={tileId} href={tile?.href || '/tools/cloud-lab'} className="border border-neutral-900/20 bg-[#fbff5d] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-900 hover:bg-[#ffff8f]">
                                            {tile?.label || tileId}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
    return (
        <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-neutral-900/15 bg-[#fbff5d] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-800">
                <BadgeCheck className="h-3.5 w-3.5" />
                {eyebrow}
            </div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">{body}</p>
        </div>
    );
}

function ToolFeatureCard({ tool }: { tool: Tool }) {
    const Icon = categoryIcons[tool.category] || Box;

    return (
        <Link href={tool.href} className="group bg-[#fbfbf4] p-6 transition-colors hover:bg-[#ffffd9]">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-neutral-900 bg-white">
                        <Icon className="h-5 w-5 text-neutral-950" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{tool.category}</span>
                </div>
                {tool.status && (
                    <span className="border border-neutral-900/15 bg-[#fbff5d] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-900">
                        {statusLabels[tool.status]}
                    </span>
                )}
            </div>
            <h3 className="mt-8 text-2xl font-semibold tracking-normal text-neutral-950">{tool.name}</h3>
            <p className="mt-3 min-h-16 text-sm leading-6 text-neutral-600">{tool.description}</p>
            <div className="mt-8 flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-950">
                Launch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

function ToolListItem({ tool }: { tool: Tool }) {
    const Icon = categoryIcons[tool.category] || Box;

    return (
        <Link href={tool.href} className="group flex min-h-28 items-start gap-3 bg-[#fbfbf4] p-4 transition-colors hover:bg-white">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-700" />
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-neutral-950 group-hover:underline">{tool.name}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{tool.description}</div>
            </div>
        </Link>
    );
}
