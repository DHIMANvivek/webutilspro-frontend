'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, FlaskConical, Sparkles, Lock, Bot, RefreshCcw, Wrench, Box, Target, ArrowRight, Image as ImageIcon } from 'lucide-react';
import LatestInsights from '@/components/LatestInsights';

const DEFAULT_TOOLS = [
    { id: 'regex-tester', name: 'Regex Tester', description: 'Test and debug regular expressions with real-time matching and highlighting.', icon: '🔍', href: '/tools/regex-tester', category: 'Text Processing' },
    { id: 'json-to-csv', name: 'JSON ↔ CSV Converter', description: 'Convert between JSON and CSV formats instantly with validation.', icon: '🔄', href: '/tools/json-to-csv', category: 'Data Conversion' },
    { id: 'markdown-to-html', name: 'Markdown → HTML', description: 'Convert Markdown to HTML with live preview and syntax highlighting.', icon: '📝', href: '/tools/markdown-to-html', category: 'Content' },
    { id: 'ai-error-explainer', name: 'AI Error Explainer', description: 'Get AI-powered explanations and fixes for programming errors.', icon: '🤖', href: '/tools/ai-error-explainer', category: 'AI-Powered' },
    { id: 'prompt-optimizer', name: 'Prompt Optimizer', description: 'Optimize your AI prompts for better results and clarity.', icon: '✨', href: '/tools/prompt-optimizer', category: 'AI-Powered' },
    { id: 'pdf-extractor', name: 'PDF Text Extractor', description: 'Extract text from complex PDFs containing images with AI.', icon: '📄', href: '/tools/pdf-extractor', category: 'AI-Powered' },
    { id: 'code-formatter', name: 'Code Formatter', description: 'Beautify JavaScript, HTML, CSS, JSON, and SQL code instantly.', icon: '💫', href: '/tools/code-formatter', category: 'Code Tools' },
    { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings for data transmission.', icon: '🔐', href: '/tools/base64', category: 'Encoding' },
    { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Convert URLs to safe encoded format and back.', icon: '🔗', href: '/tools/url-encoder', category: 'Encoding' },
    { id: 'color-picker', name: 'Color Picker & Gradients', description: 'Pick colors, convert formats, and generate CSS gradients.', icon: '🎨', href: '/tools/color-picker', category: 'Design' },
    { id: 'jwt-decoder', name: 'JWT Decoder & Hash Generator', description: 'Decode JWT tokens and generate cryptographic hashes.', icon: '🔑', href: '/tools/jwt-decoder', category: 'Security' },
    { id: 'text-tools', name: 'Text Tools', description: 'Count characters/words, convert case, and clean up text.', icon: '📄', href: '/tools/text-tools', category: 'Utilities' },
    { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Generate custom QR codes for URLs, text, and more.', icon: '📱', href: '/tools/qr-code-generator', category: 'Utilities' },
    { id: 'password-generator', name: 'Password Generator', description: 'Create secure passwords and check password strength.', icon: '🔒', href: '/tools/password-generator', category: 'Security' },
    { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique identifiers (UUIDs) instantly.', icon: '🔑', href: '/tools/uuid-generator', category: 'Utilities' },
    { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs and mockups.', icon: '📝', href: '/tools/lorem-ipsum-generator', category: 'Text' },
    { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Convert Unix timestamps to dates and vice versa.', icon: '⏰', href: '/tools/timestamp-converter', category: 'Utilities' },
    { id: 'diff-checker', name: 'Diff Checker', description: 'Compare text files and highlight differences.', icon: '🔍', href: '/tools/diff-checker', category: 'Utilities' },
    { id: 'html-encoder', name: 'HTML Encoder/Decoder', description: 'Encode/decode HTML entities for security and display.', icon: '🔐', href: '/tools/html-encoder', category: 'Web' },
    { id: 'json-validator', name: 'JSON Validator', description: 'Validate, format, and minify JSON data instantly.', icon: '✅', href: '/tools/json-validator', category: 'Data' },
    { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images to reduce file size and improve performance.', icon: '📷', href: '/tools/image-compressor', category: 'Media' },
    { id: 'minifier', name: 'Minifier', description: 'Minify JavaScript, CSS, and HTML for production.', icon: '⚡', href: '/tools/minifier', category: 'Web' },
    { id: 'xml-formatter', name: 'XML Formatter', description: 'Format, validate, and convert XML documents.', icon: '📜', href: '/tools/xml-formatter', category: 'Data' },
    { id: 'yaml-tools', name: 'YAML Tools', description: 'Convert YAML ↔ JSON and validate YAML files.', icon: '🛠️', href: '/tools/yaml-tools', category: 'Data' },
    { id: 'sketch-board', name: 'Sketch Board', description: 'Real-time collaborative whiteboard for diagrams and ideas.', icon: '🎨', href: '/tools/sketch-board', category: 'Design' },
    { id: 'api-playground', name: 'API Playground', description: 'Professional REST API testing tool. Test APIs with code generation.', icon: '⚡', href: '/tools/api-playground', category: 'Developer' },
    { id: 'cron-job-generator', name: 'Cron Job Generator', description: 'Visual schedule builder for cron expressions with natural language.', icon: '⏰', href: '/tools/cron-job-generator', category: 'Utilities' },
    { id: 'og-image-generator', name: 'OG Image Generator', description: 'Design and preview Open Graph social sharing cards.', icon: '🖼️', href: '/tools/og-image-generator', category: 'Design' },
    { id: 'http-headers-analyzer', name: 'HTTP Headers Analyzer', description: 'Analyze website security headers and get a security grade.', icon: '🛡️', href: '/tools/http-headers-analyzer', category: 'Security' },
    { id: 'push-notifications', name: 'Push Notifications', description: 'Add web push notifications to your site with powerful management dashboard.', icon: '🔔', href: '/tools/push-notifications', category: 'Services' },
    { id: 'woocommerce', name: 'WooCommerce', description: 'Secure store management with AI chat and full CRUD features.', icon: '🛒', href: '/tools/woocommerce', category: 'Services' },
    { id: 'mcp-tester', name: 'MCP Tool Tester', description: 'Test and debug Model Context Protocol servers in a live sandbox.', icon: '🧪', href: '/tools/mcp-tester', category: 'AI-Powered' }
];

export default function HomePage() {
    const [tools, setTools] = useState(DEFAULT_TOOLS);

    useEffect(() => {
        async function fetchTools() {
            try {
                const response = await fetch('http://localhost:4000/api/media/public-tools');
                if (response.ok) {
                    const dynamicTools = await response.json();

                    const merged = DEFAULT_TOOLS.map(t => {
                        const dynamic = dynamicTools.find((dt: any) => dt.id === t.id);
                        return dynamic ? { ...t, ...dynamic } : t;
                    });

                    setTools(merged);
                }
            } catch (error) {
                console.warn('Failed to fetch dynamic tools, using defaults');
            }
        }
        fetchTools();
    }, []);

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
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
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
                    </div>
                </div>
            </section>

            {/* MCP Tools Section */}
            <section className="py-24 bg-[#111827] relative overflow-hidden">
                <div className="container-custom relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30 animate-fade-in shadow-xl">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                            Premium MCP Integration
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        MCP-Powered Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
                        <Link href="/tools/woocommerce" className="group bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/[0.08] hover:bg-white/[0.06] transition-all overflow-hidden text-left">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl border border-white/5 group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-12 h-12 text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">WooCommerce Manager</h3>
                                    <p className="text-slate-400 text-sm mb-4">Secure store management with AI chat and full CRUD.</p>
                                    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                                        <span className="text-sm">Explore Tool</span>
                                        <ArrowRight className="w-4 h-4 text-purple-400" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link href="/tools/mcp-tester" className="group bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/[0.08] hover:bg-white/[0.06] transition-all overflow-hidden text-left">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl border border-white/5 group-hover:scale-110 transition-transform">
                                    <FlaskConical className="w-12 h-12 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">MCP Tool Tester</h3>
                                    <p className="text-slate-400 text-sm mb-4">Live sandbox for testing custom MCP servers.</p>
                                    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                                        <span className="text-sm">Test MCP Servers</span>
                                        <ArrowRight className="w-4 h-4 text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tools Grid Section */}
            <section id="tools" className="py-24 bg-slate-50 relative">
                <div className="container-custom">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Developer Tools Hive
                        </h2>
                        <p className="text-lg text-slate-600 font-medium text-left">
                            Experience unique, AI-enhanced utilities for your workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map((tool: any) => {
                            const categoryClass = `category-${tool.category?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '') || 'utilities'}`;

                            // Map categories to premium gradient styles for placeholders
                            const categoryGradients: Record<string, string> = {
                                'AI-Powered': 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600',
                                'Security': 'from-blue-600/10 to-indigo-600/10 border-blue-500/20 text-blue-600',
                                'Code Tools': 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600',
                                'Design': 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600',
                                'Data Conversion': 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-600',
                                'Developer': 'from-slate-700/10 to-slate-900/10 border-slate-500/20 text-slate-700',
                                'Web': 'from-blue-400/10 to-cyan-400/10 border-blue-400/20 text-blue-500',
                                'Utilities': 'from-slate-400/10 to-slate-600/10 border-slate-400/20 text-slate-600',
                                'Content': 'from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600',
                                'Media': 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-600'
                            };

                            const gradientStyle = categoryGradients[tool.category] || categoryGradients['Utilities'];

                            return (
                                <Link key={tool.id} href={tool.href} className="flex flex-col h-full group bg-white rounded-[1.5rem] border border-slate-200/80 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-sm">
                                    <div className="p-6 pb-0">
                                        <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${gradientStyle} border flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                            {tool.icon}
                                        </div>
                                        <span className={`category-badge ${categoryClass} inline-block mb-3 text-[10px]`}>{tool.category}</span>
                                    </div>

                                    <div className="p-6 pt-5 flex flex-col flex-1">
                                        <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors text-left leading-tight">{tool.name}</h3>
                                        <p className="text-[13px] text-slate-600 mb-6 leading-relaxed font-medium line-clamp-2 text-left flex-1">{tool.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest group/btn">
                                                <span>Launch Tool</span>
                                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all shadow-sm">
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                                </div>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <LatestInsights />
        </div>
    );
}
