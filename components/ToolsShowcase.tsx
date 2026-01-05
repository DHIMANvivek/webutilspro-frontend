'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Zap,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Code2,
    Wrench,
    X,
    Maximize2,
    Minus,
    Lightbulb,
    Target,
    Database,
    Lock,
    Eye,
    Palette,
    FileCode,
    FileType,
    Shield,
    Image,
    Layers,
    CheckCircle2,
    Clock,
    Link,
    Type,
    ShoppingBag,
    Key,
    Files,
    Bell,
    Mic
} from 'lucide-react';

const FEATURED_TOOLS = [
    {
        id: 'mcp-tester',
        name: 'MCP Tool Tester',
        description: 'Secure sandbox for MCP servers.',
        href: '/tools/mcp-tester',
        icon: Wrench,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 'ai-error-explainer',
        name: 'AI Error Explainer',
        description: 'Understand complex code errors.',
        href: '/tools/ai-error-explainer',
        icon: Sparkles,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test patterns in real-time.',
        href: '/tools/regex-tester',
        icon: Code2,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'prompt-optimizer',
        name: 'Prompt Optimizer',
        description: 'Refine your LLM prompts.',
        href: '/tools/prompt-optimizer',
        icon: Target,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        id: 'pdf-extractor',
        name: 'PDF Text Extractor',
        description: 'Extract text from complex PDFs.',
        href: '/tools/pdf-extractor',
        icon: FileType,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    {
        id: 'push-notifications',
        name: 'Web Push Notifications',
        description: 'Engage users with real-time push.',
        href: '/tools/push-notifications',
        icon: Bell,
        color: 'text-blue-600',
        bg: 'bg-blue-600/10'
    }
];

const TOOL_INSIGHTS: Record<string, { title: string; features: string[]; icon: any; color: string; bg: string }> = {
    'api-playground': {
        title: 'API Testing Pro',
        features: ['Test REST, GraphQL & WebSocket APIs', 'Generate code in 5+ languages', 'Save collections & history'],
        icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10'
    },
    'mcp-tester': {
        title: 'MCP Power Features',
        features: ['Secure sandbox environment', 'Custom server support', 'Real-time tool inspection'],
        icon: Wrench, color: 'text-emerald-500', bg: 'bg-emerald-500/10'
    },
    'tailwind-animations': {
        title: 'Motion Design Pro',
        features: ['Premium Tailwind animations', 'Real-time customization', 'Direct GPU-accelerated code'],
        icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-500/10'
    },
    'ai-error-explainer': {
        title: 'Explainer Insights',
        features: ['Deep context analysis', 'Stack trace interpretation', 'AI-driven fix suggestions'],
        icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10'
    },
    'regex-tester': {
        title: 'Pro Regex Tips',
        features: ['Real-time match highlighting', 'Instant cheat sheet access', 'Multi-flavor support'],
        icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10'
    },
    'prompt-optimizer': {
        title: 'Optimization Strategy',
        features: ['Iterative refinement logic', 'Tone & role adjustment', 'Token efficiency checks'],
        icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10'
    },
    'base64': {
        title: 'Encoding Insights',
        features: ['Bidirectional conversion', 'Binary-safe processing', 'URL-safe encoding options'],
        icon: Files, color: 'text-blue-400', bg: 'bg-blue-400/10'
    },
    'code-formatter': {
        title: 'Formatting Intelligence',
        features: ['Auto-indentation logic', 'Syntax-aware cleanup', 'Multiple language support'],
        icon: FileCode, color: 'text-indigo-400', bg: 'bg-indigo-400/10'
    },
    'color-picker': {
        title: 'Design Synergy',
        features: ['Instant HEX/RGB/HSL', 'Color harmony suggestions', 'Visual palette generation'],
        icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10'
    },
    'diff-checker': {
        title: 'Comparison Logic',
        features: ['Character-level diffing', 'Side-by-side view', 'Merge conflict detection'],
        icon: Code2, color: 'text-indigo-500', bg: 'bg-indigo-500/10'
    },
    'html-encoder': {
        title: 'Security Insights',
        features: ['XSS prevention helper', 'Entity conversion', 'Special character safety'],
        icon: Link, color: 'text-cyan-500', bg: 'bg-cyan-500/10'
    },
    'image-compressor': {
        title: 'Optimization Secrets',
        features: ['Lossless compression', 'Format-specific tuning', 'Bulk processing ready'],
        icon: Image, color: 'text-green-500', bg: 'bg-green-500/10'
    },
    'json-to-csv': {
        title: 'Data Transformation',
        features: ['Schema detection', 'Nested object flattening', 'CSV header resolution'],
        icon: Database, color: 'text-orange-500', bg: 'bg-orange-500/10'
    },
    'json-validator': {
        title: 'Validation Accuracy',
        features: ['Strict syntax checking', 'Error line highlighting', 'Structure visualization'],
        icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10'
    },
    'jwt-decoder': {
        title: 'Auth Inspection',
        features: ['Payload parsing', 'Header verification', 'Signature algorithm check'],
        icon: Lock, color: 'text-violet-500', bg: 'bg-violet-500/10'
    },
    'lorem-ipsum-generator': {
        title: 'Placeholder Logic',
        features: ['Paragraph customization', 'Semantic tag options', 'HTML-wrapped results'],
        icon: Type, color: 'text-sky-500', bg: 'bg-sky-500/10'
    },
    'markdown-to-html': {
        title: 'Parsing Engine',
        features: ['Live GFM preview', 'Code block highlighting', 'Sanitized output'],
        icon: FileType, color: 'text-blue-600', bg: 'bg-blue-600/10'
    },
    'minifier': {
        title: 'Performance Wins',
        features: ['Whitespace removal', 'Variable shortening', 'Bundle size reduction'],
        icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10'
    },
    'password-generator': {
        title: 'Entropy Analysis',
        features: ['High-entropy randomness', 'Configurable complexity', 'Zero-leak generation'],
        icon: Shield, color: 'text-rose-600', bg: 'bg-rose-600/10'
    },
    'qr-code-generator': {
        title: 'Connectivity Tech',
        features: ['Custom error correction', 'Vector-safe outputs', 'Link validation'],
        icon: Zap, color: 'text-sky-600', bg: 'bg-sky-600/10'
    },
    'text-tools': {
        title: 'Text Processing',
        features: ['Smart case conversion', 'Whitespace cleanup', 'Character telemetry'],
        icon: Type, color: 'text-teal-500', bg: 'bg-teal-500/10'
    },
    'timestamp-converter': {
        title: 'Temporal Logic',
        features: ['Unix epoch decoding', 'Timezone adjustment', 'ISO format standard'],
        icon: Clock, color: 'text-amber-600', bg: 'bg-amber-600/10'
    },
    'url-encoder': {
        title: 'URI Standard',
        features: ['Percent-encoding logic', 'Param safe conversion', 'RFC 3986 compliance'],
        icon: Link, color: 'text-lime-500', bg: 'bg-lime-500/10'
    },
    'uuid-generator': {
        title: 'Uniqueness Engine',
        features: ['UUID v4 RFC compliant', 'Bulk UUID generation', 'Cryptographic seed'],
        icon: Key, color: 'text-slate-500', bg: 'bg-slate-500/10'
    },
    'woocommerce': {
        title: 'E-commerce Intel',
        features: ['Secure session auth', 'Order flow monitoring', 'Product data sync'],
        icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-600/10'
    },
    'xml-formatter': {
        title: 'XML Intelligence',
        features: ['Beautiful indentation', 'Namespace resolution', 'Tag integrity check'],
        icon: FileCode, color: 'text-orange-600', bg: 'bg-orange-600/10'
    },
    'yaml-tools': {
        title: 'Config Strategy',
        features: ['YAML-to-JSON swap', 'Indentation validation', 'Cloud-ready parsing'],
        icon: FileCode, color: 'text-yellow-600', bg: 'bg-yellow-600/10'
    },
    'pdf-extractor': {
        title: 'AI Extraction Power',
        features: ['LlamaIndex AI OCR', 'Complex layout handling', 'Markdown formatting'],
        icon: FileType, color: 'text-rose-500', bg: 'bg-rose-500/10'
    },
    'sketch-board': {
        title: 'Collaboration Hub',
        features: ['Real-time syncing', 'Multi-user drawing support', 'Instant canvas sharing'],
        icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10'
    },
    'cron-job-generator': {
        title: 'Scheduler Logic',
        features: ['Visual schedule builder', 'Natural language parsing', 'Next.js Cron syntax'],
        icon: Clock, color: 'text-blue-600', bg: 'bg-blue-600/10'
    },
    'og-image-generator': {
        title: 'Social Preview',
        features: ['Live Twitter/LinkedIn preview', 'Edge runtime code export', 'Dynamic gradients'],
        icon: Image, color: 'text-purple-600', bg: 'bg-purple-600/10'
    },
    'http-headers-analyzer': {
        title: 'Security Audit',
        features: ['CSP & HSTS detection', 'Security grade scoring', 'OWASP recommendations'],
        icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-600/10'
    },
    'push-notifications': {
        title: 'Push Insights',
        features: ['Real-time delivery logic', 'Multi-browser compatibility', 'Advanced click analytics'],
        icon: Bell, color: 'text-blue-600', bg: 'bg-blue-600/10'
    },
    'zod-schema-generator': {
        title: 'Schema Intelligence',
        features: ['Recursive JSON parsing', 'Type inference generation', 'Prisma ORM compatibility'],
        icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-500/10'
    },
    'database-architect': {
        title: 'Architecture Pro',
        features: ['Draggable ERD canvas', 'Smart relationship cables', 'Zero-config code export'],
        icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10'
    },
    'transcript-generator': {
        title: 'Speech Scribe',
        features: ['Real-time Web Speech API', 'Local-only privacy (No Server)', 'Instant txt export'],
        icon: Mic, color: 'text-red-500', bg: 'bg-red-500/10'
    }
};

export default function ToolsShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [progress, setProgress] = useState(0);
    const [dynamicTools, setDynamicTools] = useState<any[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function fetchDynamicTools() {
            try {
                const response = await fetch('http://localhost:4000/api/media/public-tools');
                if (response.ok) {
                    const data = await response.json();
                    setDynamicTools(data);
                }
            } catch (error) {
                console.warn('ToolsShowcase: Failed to fetch dynamic tools');
            }
        }
        fetchDynamicTools();
    }, []);

    const activeToolSlug = useMemo(() => {
        if (!pathname) return null;
        if (pathname.startsWith('/tools/')) {
            return pathname.split('/')[2];
        }
        return null;
    }, [pathname]);

    const insightData = activeToolSlug ? TOOL_INSIGHTS[activeToolSlug] : null;

    // Merge static featured tools with dynamic images
    const mergedFeatured = useMemo(() => {
        return FEATURED_TOOLS.map(t => {
            const dynamic = dynamicTools.find(dt => dt.id === t.id);
            return dynamic ? { ...t, imageUrl: dynamic.imageUrl } : t;
        }) as any[];
    }, [dynamicTools]);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 80);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % mergedFeatured.length);
        setProgress(0);
    }, [mergedFeatured.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + mergedFeatured.length) % mergedFeatured.length);
        setProgress(0);
    }, [mergedFeatured.length]);

    useEffect(() => {
        if (isMinimized || insightData) return;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextSlide();
                    return 0;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [isMinimized, nextSlide, insightData]);

    const isHomepage = pathname === '/';
    const shouldDisplay = isVisible &&
        !isMinimized &&
        (isHomepage || isAtTop);

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-6 left-6 z-40 p-3 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl hover:scale-110 transition-all group hidden md:block"
            >
                <Maximize2 className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
            </button>
        );
    }

    if (!shouldDisplay) return null;

    return (
        <div className="fixed bottom-6 left-6 z-40 w-72 animate-in slide-in-from-left fade-in duration-700 hidden md:block">
            <div className="relative group bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        {insightData ? (
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {insightData ? 'Current Tool Info' : 'Featured Discovery'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Minus className="w-3 h-3 text-slate-500" />
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X className="w-3 h-3 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {insightData ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${insightData.bg} flex items-center justify-center`}>
                                    <insightData.icon className={`w-4 h-4 ${insightData.color}`} />
                                </div>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">{insightData.title}</h4>
                            </div>
                            <ul className="space-y-2">
                                {insightData.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-xl ${mergedFeatured[currentIndex].bg} flex items-center justify-center flex-shrink-0 transition-all duration-500 overflow-hidden relative border border-white/5`}>
                                    {(() => {
                                        const ToolIcon = mergedFeatured[currentIndex].icon;
                                        return <ToolIcon className={`w-5 h-5 ${mergedFeatured[currentIndex].color}`} />;
                                    })()}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-white truncate leading-tight mb-1 font-sans">{mergedFeatured[currentIndex].name}</h4>
                                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-tight text-left">
                                        {mergedFeatured[currentIndex].description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-2">
                                <div className="flex gap-1.5 align-middle">
                                    <button
                                        onClick={prevSlide}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => router.push(mergedFeatured[currentIndex].href)}
                                    className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/30"
                                >
                                    Try Now
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Progress Bar (Only for Featured mode) */}
                {!insightData && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                        <div
                            className="h-full bg-blue-500/50 transition-all duration-50 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
