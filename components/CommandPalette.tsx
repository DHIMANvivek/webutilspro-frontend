'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Search,
    Zap,
    Terminal,
    Code2,
    Wrench,
    Command as CommandIcon,
    SearchSlash,
    ChevronRight,
    Sparkles,
    Cpu,
    Settings,
    Bug,
    Clock
} from 'lucide-react';
import { getIssueUrl } from './ReportIssueLink';

interface Tool {
    id: string;
    name: string;
    description: string;
    href: string;
    category: 'AI' | 'Dev' | 'Utilities' | 'Systems';
    keywords: string[];
}

const TOOLS: Tool[] = [
    {
        id: 'mcp-tester',
        name: 'MCP Tool Tester',
        description: 'Test Model Context Protocol servers in a secure sandbox.',
        href: '/tools/mcp-tester',
        category: 'AI',
        keywords: ['mcp', 'anthropic', 'model context protocol', 'debug', 'server']
    },
    {
        id: 'ai-error-explainer',
        name: 'AI Error Explainer',
        description: 'Understand complex code errors with AI insights.',
        href: '/tools/ai-error-explainer',
        category: 'AI',
        keywords: ['error', 'debug', 'explain', 'ai', 'fix']
    },
    {
        id: 'prompt-optimizer',
        name: 'Prompt Optimizer',
        description: 'Refine and optimize your LLM prompts for better results.',
        href: '/tools/prompt-optimizer',
        category: 'AI',
        keywords: ['prompt', 'llm', 'gpt', 'claude', 'optimize']
    },
    {
        id: 'pdf-extractor',
        name: 'PDF Text Extractor',
        description: 'Extract text from complex PDFs with images using AI.',
        href: '/tools/pdf-extractor',
        category: 'AI',
        keywords: ['pdf', 'extract', 'text', 'ocr', 'document', 'llamaindex', 'ai']
    },
    {
        id: 'api-playground',
        name: 'API Playground',
        description: 'Professional REST API testing tool with code generation.',
        href: '/tools/api-playground',
        category: 'Dev',
        keywords: ['api', 'rest', 'postman', 'http', 'test', 'request', 'graphql', 'playground', 'curl']
    },
    {
        id: 'woocommerce',
        name: 'WooCommerce Manager',
        description: 'Securely manage products and orders with AI assistance.',
        href: '/tools/woocommerce',
        category: 'AI',
        keywords: ['woo', 'ecommerce', 'store', 'manage', 'orders']
    },
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test and debug regular expressions in real-time.',
        href: '/tools/regex-tester',
        category: 'Dev',
        keywords: ['regex', 'pattern', 'test', 'regular expression', 'match']
    },
    {
        id: 'json-to-csv',
        name: 'JSON ↔ CSV Converter',
        description: 'Convert between JSON and CSV formats easily.',
        href: '/tools/json-to-csv',
        category: 'Dev',
        keywords: ['json', 'csv', 'convert', 'data', 'transform']
    },
    {
        id: 'markdown-to-html',
        name: 'Markdown Parser',
        description: 'Convert Markdown to clean HTML code.',
        href: '/tools/markdown-to-html',
        category: 'Dev',
        keywords: ['markdown', 'html', 'parse', 'md', 'web']
    },
    {
        id: 'code-formatter',
        name: 'Code Formatter',
        description: 'Prettify and format your code automatically.',
        href: '/tools/code-formatter',
        category: 'Dev',
        keywords: ['format', 'prettier', 'clean', 'indent', 'beautify']
    },
    {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare two pieces of code or text for differences.',
        href: '/tools/diff-checker',
        category: 'Dev',
        keywords: ['diff', 'compare', 'change', 'versions', 'text']
    },
    {
        id: 'json-validator',
        name: 'JSON Validator',
        description: 'Validate and lint your JSON structures.',
        href: '/tools/json-validator',
        category: 'Dev',
        keywords: ['json', 'validate', 'lint', 'schema', 'check']
    },
    {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens safely.',
        href: '/tools/jwt-decoder',
        category: 'Dev',
        keywords: ['jwt', 'token', 'decode', 'auth', 'inspect']
    },
    {
        id: 'base64',
        name: 'Base64 Codec',
        description: 'Encode and decode Base64 strings.',
        href: '/tools/base64',
        category: 'Utilities',
        keywords: ['base64', 'encode', 'decode', 'binary', 'string']
    },
    {
        id: 'color-picker',
        name: 'Color Picker',
        description: 'Advanced color picker with hex/rgb/hsl support.',
        href: '/tools/color-picker',
        category: 'Utilities',
        keywords: ['color', 'picker', 'hex', 'rgb', 'design']
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Reduce image file size while maintaining quality.',
        href: '/tools/image-compressor',
        category: 'Utilities',
        keywords: ['image', 'compress', 'size', 'optimize', 'photo']
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure, random passwords instantly.',
        href: '/tools/password-generator',
        category: 'Utilities',
        keywords: ['password', 'secure', 'random', 'gen', 'security']
    },
    {
        id: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate unique v4 identifiers.',
        href: '/tools/uuid-generator',
        category: 'Utilities',
        keywords: ['uuid', 'guid', 'id', 'unique', 'generate']
    },
    {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        description: 'Convert Unix timestamps to readable dates.',
        href: '/tools/timestamp-converter',
        category: 'Utilities',
        keywords: ['time', 'unix', 'date', 'convert', 'epoch']
    },
    {
        id: 'qr-code-generator',
        name: 'QR Code Generator',
        description: 'Create customizable QR codes for links or text.',
        href: '/tools/qr-code-generator',
        category: 'Utilities',
        keywords: ['qr', 'code', 'link', 'generate', 'scan']
    },
    {
        id: 'text-tools',
        name: 'Text Utilities',
        description: 'Case conversion, word count, and text cleaning.',
        href: '/tools/text-tools',
        category: 'Utilities',
        keywords: ['text', 'count', 'case', 'words', 'clean']
    },
    {
        id: 'url-encoder',
        name: 'URL Encoder',
        description: 'Safely encode or decode URL components.',
        href: '/tools/url-encoder',
        category: 'Utilities',
        keywords: ['url', 'encode', 'decode', 'uri', 'safe']
    },
    {
        id: 'html-encoder',
        name: 'HTML Encoder',
        description: 'Encode and decode HTML entities safely.',
        href: '/tools/html-encoder',
        category: 'Utilities',
        keywords: ['html', 'encode', 'decode', 'entities', 'safe']
    },
    {
        id: 'lorem-ipsum-generator',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for your designs.',
        href: '/tools/lorem-ipsum-generator',
        category: 'Utilities',
        keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy']
    },
    {
        id: 'minifier',
        name: 'Code Minifier',
        description: 'Compress JS, CSS, and HTML for production.',
        href: '/tools/minifier',
        category: 'Dev',
        keywords: ['minify', 'compress', 'js', 'css', 'html']
    },
    {
        id: 'xml-formatter',
        name: 'XML Formatter',
        description: 'Format and validate XML documents.',
        href: '/tools/xml-formatter',
        category: 'Dev',
        keywords: ['xml', 'format', 'validate', 'pretty', 'data']
    },
    {
        id: 'yaml-tools',
        name: 'YAML Tools',
        description: 'Convert between YAML and JSON formats.',
        href: '/tools/yaml-tools',
        category: 'Dev',
        keywords: ['yaml', 'json', 'convert', 'config', 'data']
    },
    {
        id: 'report-issue',
        name: 'Report Runtime Issue',
        description: 'Encountered a bug? Report it directly to our GitHub issues page.',
        href: 'https://github.com/DHIMANvivek/webutilspro-issues/issues/new',
        category: 'Systems',
        keywords: ['bug', 'report', 'issue', 'error', 'help', 'support']
    },
    {
        id: 'cron-job-generator',
        name: 'Cron Job Generator',
        description: 'Visual builder for Cron schedules.',
        href: '/tools/cron-job-generator',
        category: 'Utilities',
        keywords: ['cron', 'schedule', 'time', 'generator']
    },
    {
        id: 'og-image-generator',
        name: 'OG Image Playground',
        description: 'Design Social Media Cards & Get Code.',
        href: '/tools/og-image-generator',
        category: 'Utilities',
        keywords: ['og', 'image', 'social', 'meta', 'maker']
    },
    {
        id: 'http-headers-analyzer',
        name: 'HTTP Headers Analyzer',
        description: 'Scan Security Headers and get a grade.',
        href: '/tools/http-headers-analyzer',
        category: 'Dev',
        keywords: ['http', 'headers', 'security', 'scan']
    },
    {
        id: 'sketch-board',
        name: 'Sketch Board',
        description: 'Collaborative real-time whiteboard for drawing and diagramming.',
        href: '/tools/sketch-board',
        category: 'Utilities',
        keywords: ['sketch', 'draw', 'whiteboard', 'collaborate', 'diagram', 'canvas']
    },
    {
        id: 'push-notifications',
        name: 'Push Notifications',
        description: 'Add web push notifications to your website with a powerful management dashboard.',
        href: '/tools/push-notifications',
        category: 'Dev',
        keywords: ['push', 'notifications', 'fcm', 'firebase', 'web push', 'alerts', 'engage']
    },
    {
        id: 'tailwind-animations',
        name: 'Tailwind FX Studio',
        description: 'Design and export premium Tailwind CSS animations in real-time.',
        href: '/tools/tailwind-animations',
        category: 'Dev',
        keywords: ['tailwind', 'animation', 'fx', 'design', 'css', 'motion']
    },
    {
        id: 'zod-schema-generator',
        name: 'Zod Schema Factory',
        description: 'Instantly transform JSON, TS, and GraphQL into Zod schemas and Prisma models.',
        href: '/tools/zod-schema-generator',
        category: 'Dev',
        keywords: ['zod', 'schema', 'generator', 'prisma', 'json', 'typescript', 'graphql', 'factory']
    }
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentTools, setRecentTools] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('recent_tools');
        if (saved) {
            setRecentTools(JSON.parse(saved));
        }
    }, []);

    const filteredTools = (query === ''
        ? [
            ...TOOLS.filter(t => recentTools.includes(t.id)).slice(0, 3), // Show top 3 recent
            ...TOOLS.filter(t => !recentTools.includes(t.id)).slice(0, 5) // Then remaining tools
        ]
        : TOOLS.filter(tool =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()) ||
            tool.keywords.some(k => k.includes(query.toLowerCase()))
        )).filter(tool => {
            if (tool.id === 'report-issue') {
                return pathname?.startsWith('/tools/');
            }
            return true;
        });

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const handleSelect = (tool: Tool) => {
        // Save to recents
        if (tool.id !== 'report-issue') {
            const updatedRecents = [tool.id, ...recentTools.filter(id => id !== tool.id)].slice(0, 5);
            setRecentTools(updatedRecents);
            localStorage.setItem('recent_tools', JSON.stringify(updatedRecents));
        }

        if (tool.id === 'report-issue') {
            window.open(getIssueUrl(), '_blank');
        } else {
            router.push(tool.href);
        }
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredTools.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            if (filteredTools[selectedIndex]) {
                handleSelect(filteredTools[selectedIndex]);
            }
        }
    };

    // Scroll into view logic
    useEffect(() => {
        if (scrollRef.current) {
            const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                const containerHeight = scrollRef.current.offsetHeight;
                const elementTop = selectedElement.offsetTop;
                const elementHeight = selectedElement.offsetHeight;

                if (elementTop < scrollRef.current.scrollTop) {
                    scrollRef.current.scrollTop = elementTop;
                } else if (elementTop + elementHeight > scrollRef.current.scrollTop + containerHeight) {
                    scrollRef.current.scrollTop = elementTop + elementHeight - containerHeight;
                }
            }
        }
    }, [selectedIndex]);

    if (!isMounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slide-up ring-1 ring-slate-900/5">
                {/* Search Header */}
                <div className="flex items-center px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for a tool (e.g. 'mcp', 'regex', 'converter')..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-lg font-medium"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-black text-slate-400">ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div
                    ref={scrollRef}
                    className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar"
                >
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool, idx) => (
                            <button
                                key={tool.id}
                                className={`w-full flex items-center px-4 py-3 text-left transition-all duration-150 group ${idx === selectedIndex
                                    ? 'bg-blue-600'
                                    : 'hover:bg-slate-50'
                                    }`}
                                onClick={() => handleSelect(tool)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${idx === selectedIndex ? 'bg-white/20' : 'bg-slate-100'
                                    }`}>
                                    {tool.category === 'Systems' && tool.id === 'report-issue' ? (
                                        <Bug className={`w-5 h-5 ${idx === selectedIndex ? 'text-white' : 'text-red-500'}`} />
                                    ) : tool.category === 'Systems' ? (
                                        <Cpu className={`w-5 h-5 ${idx === selectedIndex ? 'text-white' : 'text-orange-600'}`} />
                                    ) : null}
                                    {tool.category === 'AI' && <Sparkles className={`w-5 h-5 ${idx === selectedIndex ? 'text-white' : 'text-purple-600'}`} />}
                                    {tool.category === 'Dev' && <Code2 className={`w-5 h-5 ${idx === selectedIndex ? 'text-white' : 'text-blue-600'}`} />}
                                    {tool.category === 'Utilities' && <Wrench className={`w-5 h-5 ${idx === selectedIndex ? 'text-white' : 'text-emerald-600'}`} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-black tracking-tight transition-colors ${idx === selectedIndex ? 'text-white' : 'text-slate-900'
                                            }`}>
                                            {tool.name}
                                        </span>
                                        {recentTools.includes(tool.id) && query === '' && (
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${idx === selectedIndex ? 'bg-white/30 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                                Recent
                                            </span>
                                        )}
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${idx === selectedIndex
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {tool.category}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate transition-colors font-medium ${idx === selectedIndex ? 'text-blue-100' : 'text-slate-500'
                                        }`}>
                                        {tool.description}
                                    </p>
                                </div>
                                <ChevronRight className={`w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 transition-all ${idx === selectedIndex ? 'text-white translate-x-0 opacity-100' : 'text-slate-300 -translate-x-2'
                                    }`} />
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <SearchSlash className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-slate-900">No results found</h3>
                            <p className="text-sm text-slate-500 max-w-[200px] mt-1">
                                We couldn&apos;t find any tools matching &quot;{query}&quot;
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="p-1 bg-white border border-slate-200 rounded-md shadow-sm">
                                <ChevronRight className="w-2.5 h-2.5 rotate-90" />
                            </span>
                            <span className="p-1 bg-white border border-slate-200 rounded-md shadow-sm">
                                <ChevronRight className="w-2.5 h-2.5 -rotate-90" />
                            </span>
                            Navigate
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm">ENTER</span>
                            Select
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Powered by <span className="text-blue-600">WebUtilsPro</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
