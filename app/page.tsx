import Link from 'next/link';
import { ShoppingBag, FlaskConical, Sparkles, Lock, Bot, RefreshCcw, Wrench, Box, Target, ArrowRight } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/seo';
import LatestInsights from '@/components/LatestInsights';

export const metadata = genMeta({
    title: 'Professional Developer Tools & AI Utilities',
    description: 'A comprehensive collection of free, high-quality developer tools including Regex Tester, JSON Converter, AI Error Explainer, and more. Optimized for productivity and security.',
    keywords: ['developer tools', 'programming utilities', 'regex tester', 'json converter', 'ai developer tools', 'free coding tools'],
});

export default function HomePage() {
    const tools = [
        {
            name: 'Regex Tester',
            description: 'Test and debug regular expressions with real-time matching and highlighting.',
            icon: '🔍',
            href: '/tools/regex-tester',
            category: 'Text Processing',
        },
        {
            name: 'JSON ↔ CSV Converter',
            description: 'Convert between JSON and CSV formats instantly with validation.',
            icon: '🔄',
            href: '/tools/json-to-csv',
            category: 'Data Conversion',
        },
        {
            name: 'Markdown → HTML',
            description: 'Convert Markdown to HTML with live preview and syntax highlighting.',
            icon: '📝',
            href: '/tools/markdown-to-html',
            category: 'Content',
        },
        {
            name: 'AI Error Explainer',
            description: 'Get AI-powered explanations and fixes for programming errors.',
            icon: '🤖',
            href: '/tools/ai-error-explainer',
            category: 'AI-Powered',
        },
        {
            name: 'Prompt Optimizer',
            description: 'Optimize your AI prompts for better results and clarity.',
            icon: '✨',
            href: '/tools/prompt-optimizer',
            category: 'AI-Powered',
        },
        {
            name: 'PDF Text Extractor',
            description: 'Extract text from complex PDFs containing images with AI.',
            icon: '📄',
            href: '/tools/pdf-extractor',
            category: 'AI-Powered',
        },
        {
            name: 'Code Formatter',
            description: 'Beautify JavaScript, HTML, CSS, JSON, and SQL code instantly.',
            icon: '💫',
            href: '/tools/code-formatter',
            category: 'Code Tools',
        },
        {
            name: 'Base64 Encoder/Decoder',
            description: 'Encode and decode Base64 strings for data transmission.',
            icon: '🔐',
            href: '/tools/base64',
            category: 'Encoding',
        },
        {
            name: 'URL Encoder/Decoder',
            description: 'Convert URLs to safe encoded format and back.',
            icon: '🔗',
            href: '/tools/url-encoder',
            category: 'Encoding',
        },
        {
            name: 'Color Picker & Gradients',
            description: 'Pick colors, convert formats, and generate CSS gradients.',
            icon: '🎨',
            href: '/tools/color-picker',
            category: 'Design',
        },
        {
            name: 'JWT Decoder & Hash Generator',
            description: 'Decode JWT tokens and generate cryptographic hashes.',
            icon: '🔑',
            href: '/tools/jwt-decoder',
            category: 'Security',
        },
        {
            name: 'Text Tools',
            description: 'Count characters/words, convert case, and clean up text.',
            icon: '📄',
            href: '/tools/text-tools',
            category: 'Utilities',
        },
        {
            name: 'QR Code Generator',
            description: 'Generate custom QR codes for URLs, text, and more.',
            icon: '📱',
            href: '/tools/qr-code-generator',
            category: 'Utilities',
        },
        {
            name: 'Password Generator',
            description: 'Create secure passwords and check password strength.',
            icon: '🔒',
            href: '/tools/password-generator',
            category: 'Security',
        },
        {
            name: 'UUID Generator',
            description: 'Generate unique identifiers (UUIDs) instantly.',
            icon: '🔑',
            href: '/tools/uuid-generator',
            category: 'Utilities',
        },
        {
            name: 'Lorem Ipsum Generator',
            description: 'Generate placeholder text for designs and mockups.',
            icon: '📝',
            href: '/tools/lorem-ipsum-generator',
            category: 'Text',
        },
        {
            name: 'Timestamp Converter',
            description: 'Convert Unix timestamps to dates and vice versa.',
            icon: '⏰',
            href: '/tools/timestamp-converter',
            category: 'Utilities',
        },
        {
            name: 'Diff Checker',
            description: 'Compare text files and highlight differences.',
            icon: '🔍',
            href: '/tools/diff-checker',
            category: 'Utilities',
        },
        {
            name: 'HTML Encoder/Decoder',
            description: 'Encode/decode HTML entities for security and display.',
            icon: '🔐',
            href: '/tools/html-encoder',
            category: 'Web',
        },
        {
            name: 'JSON Validator',
            description: 'Validate, format, and minify JSON data instantly.',
            icon: '✅',
            href: '/tools/json-validator',
            category: 'Data',
        },
        {
            name: 'Image Compressor',
            description: 'Compress images to reduce file size and improve performance.',
            icon: '📷',
            href: '/tools/image-compressor',
            category: 'Media',
        },
        {
            name: 'Minifier',
            description: 'Minify JavaScript, CSS, and HTML for production.',
            icon: '⚡',
            href: '/tools/minifier',
            category: 'Web',
        },
        {
            name: 'XML Formatter',
            description: 'Format, validate, and convert XML documents.',
            icon: '📜',
            href: '/tools/xml-formatter',
            category: 'Data',
        },
        {
            name: 'YAML Tools',
            description: 'Convert YAML ↔ JSON and validate YAML files.',
            icon: '🛠️',
            href: '/tools/yaml-tools',
            category: 'Data',
        },
        {
            name: 'Sketch Board',
            description: 'Real-time collaborative whiteboard for diagrams and ideas.',
            icon: '🎨',
            href: '/tools/sketch-board',
            category: 'Design',
        },
        {
            name: 'API Playground',
            description: 'Professional REST API testing tool. Test APIs with code generation.',
            icon: '⚡',
            href: '/tools/api-playground',
            category: 'Developer',
        },
        {
            name: 'Cron Job Generator',
            description: 'Visual schedule builder for cron expressions with natural language.',
            icon: '⏰',
            href: '/tools/cron-job-generator',
            category: 'Utilities',
        },
        {
            name: 'OG Image Generator',
            description: 'Design and preview Open Graph social sharing cards.',
            icon: '🖼️',
            href: '/tools/og-image-generator',
            category: 'Design',
        },
        {
            name: 'HTTP Headers Analyzer',
            description: 'Analyze website security headers and get a security grade.',
            icon: '🛡️',
            href: '/tools/http-headers-analyzer',
            category: 'Security',
        },
        {
            name: 'Push Notifications',
            description: 'Add web push notifications to your site with powerful management dashboard.',
            icon: '🔔',
            href: '/tools/push-notifications',
            category: 'Services',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]"></div>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fade-in">
                            <Link href="/tools/sketch-board" className="inline-flex items-center gap-3 px-1 py-1 pr-4 rounded-full bg-slate-900 border border-indigo-500/30 hover:scale-105 transition-transform cursor-pointer group shadow-lg shadow-indigo-500/20">
                                <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">NEW</span>
                                <span className="text-sm font-medium text-indigo-100 group-hover:text-white transition-colors">
                                    Collaborative Sketch Board
                                </span>
                                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </Link>

                            <div className="hidden sm:block w-px h-6 bg-slate-300/30"></div>

                            <Link href="/tools/push-notifications" className="inline-flex items-center gap-3 px-1 py-1 pr-4 rounded-full bg-slate-900 border border-blue-500/30 hover:scale-105 transition-transform cursor-pointer group shadow-lg shadow-blue-500/20">
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">NEW</span>
                                <span className="text-sm font-medium text-blue-100 group-hover:text-white transition-colors">
                                    Push Notification Manager
                                </span>
                                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                            Free Developer Tools for <br className="hidden md:block" />
                            <span className="text-gradient">Professional Developers</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            The all-in-one hub for your daily development needs. Fast, secure, and powered by the latest AI technologies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
                            <a href="#tools" className="btn-primary px-10 py-4 text-lg">
                                Explore Workflow Tools
                            </a>
                            <Link href="/about" className="group flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-all">
                                <span>Learn about WebUtilsPro</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>Fresh tools added every week</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MCP Tools Section - Premium Features */}
            <section className="py-24 bg-[#111827] relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-fade-in">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                                Premium MCP Integration
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                            MCP-Powered Tools
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Advanced tools powered by Model Context Protocol for seamless integration and automation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* WooCommerce Manager */}
                        <Link
                            href="/tools/woocommerce"
                            className="group relative bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 shadow-2xl overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                                <div className="p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingBag className="w-12 h-12 text-pink-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">
                                            WooCommerce Manager
                                        </h3>
                                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-500/30 uppercase tracking-tighter">
                                            MCP
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
                                        Secure WooCommerce store management with MCP integration and AI chat.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 text-[11px] font-bold px-3 py-1 rounded-full border border-purple-500/20">
                                            <Lock className="w-3.5 h-3.5" />
                                            <span>Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-300 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
                                            <Bot className="w-3.5 h-3.5" />
                                            <span>AI-Powered</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-pink-500/10 text-pink-300 text-[11px] font-bold px-3 py-1 rounded-full border border-pink-500/20">
                                            <RefreshCcw className="w-3.5 h-3.5" />
                                            <span>Full CRUD</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all duration-300">
                                        <span className="text-sm">Explore Tool</span>
                                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* MCP Tool Tester */}
                        <Link
                            href="/tools/mcp-tester"
                            className="group relative bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 shadow-2xl overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                    <FlaskConical className="w-12 h-12 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">
                                            MCP Tool Tester
                                        </h3>
                                        <span className="bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-blue-500/30 uppercase tracking-tighter">
                                            NEW
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
                                        Test any MCP server dynamically with custom configs and AI chat interface.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/20">
                                            <Wrench className="w-3.5 h-3.5" />
                                            <span>Dynamic</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-300 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
                                            <Box className="w-3.5 h-3.5" />
                                            <span>Interactive</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                                            <Target className="w-3.5 h-3.5" />
                                            <span>Universal</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all duration-300">
                                        <span className="text-sm">Test MCP Servers</span>
                                        <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-24 bg-slate-50 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                                Developer Tools
                            </h2>
                            <p className="text-lg text-slate-600 font-medium">
                                Essential utilities designed to streamline your development workflow and boost your daily productivity.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-3 text-slate-400">
                                <div className="h-px w-12 bg-slate-200"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Scroll to discover</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => {
                            // Map category to CSS class
                            const categoryClass = `category-${tool.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`;

                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="card group"
                                >
                                    <div className="flex items-start space-x-4 relative z-10">
                                        <div className="tool-icon">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gradient transition-all">
                                                {tool.name}
                                            </h3>
                                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{tool.description}</p>
                                            <span className={`category-badge ${categoryClass}`}>
                                                {tool.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Latest Insights Section */}
            <LatestInsights />

            {/* CTA Section */}
            <section className="py-24 bg-[#111827] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]"></div>
                </div>

                <div className="container-custom relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                            Ready to Elevate Your <br />
                            <span className="text-gradient">Power Workflow?</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 font-medium">
                            Experience the future of development utilities. No account needed, just pure productivity.
                        </p>
                        <div className="flex justify-center">
                            <a href="#tools" className="btn-primary px-12 py-4 text-lg flex items-center gap-3">
                                <span>Get Started for Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
