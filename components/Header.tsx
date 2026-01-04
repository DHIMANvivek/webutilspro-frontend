'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    ChevronDown,
    Menu,
    X,
    Rocket,
    Code,
    FileText,
    Database,
    Shield,
    Palette,
    Layout,
    Wrench,
    ShoppingCart,
    Search,
    Sparkles,
    Zap,
    Clock,
    Activity,
    Layers,
    Image as ImageIcon,
    BookOpen
} from 'lucide-react';
import ReportIssueLink from './ReportIssueLink';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
            <nav className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md border border-slate-200/60 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <img
                                src="/logo.png"
                                alt="WebUtilsPro Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                            WebUtilsPro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-sm uppercase tracking-wider"
                        >
                            Home
                        </Link>

                        {!pathname?.startsWith('/blog') && (
                            <Link
                                href="/blog"
                                className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5"
                            >
                                <BookOpen className="w-4 h-4" />
                                Insights
                            </Link>
                        )}

                        {/* Tools Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsToolsOpen(true)}
                            onMouseLeave={() => setIsToolsOpen(false)}
                        >
                            <button className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-sm uppercase tracking-wider flex items-center gap-1">
                                Tools
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute left-1/2 -translate-x-1/2 mt-4 w-[600px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 transform 
                                    ${isToolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
                            >
                                <div className="p-6 grid grid-cols-2 gap-8">
                                    {/* Column 1 */}
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Rocket className="w-3 h-3" /> AI-Powered
                                            </p>
                                            <div className="space-y-1">
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/ai-error-explainer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <Code className="w-3.5 h-3.5" />
                                                    </span>
                                                    AI Error Explainer
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/prompt-optimizer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </span>
                                                    Prompt Optimizer
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/pdf-extractor" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </span>
                                                    PDF Text Extractor
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Code className="w-3 h-3" /> Code & Text
                                            </p>
                                            <div className="space-y-1">
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/regex-tester" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                                                        <Layout className="w-3.5 h-3.5" />
                                                    </span>
                                                    Regex Tester
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/code-formatter" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                                                        <Wrench className="w-3.5 h-3.5" />
                                                    </span>
                                                    Code Formatter
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2 */}
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Database className="w-3 h-3" /> Data & Security
                                            </p>
                                            <div className="space-y-1">
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/zod-schema-generator" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Database className="w-3.5 h-3.5" />
                                                    </span>
                                                    Zod Factory
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/database-architect" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Layers className="w-3.5 h-3.5" />
                                                    </span>
                                                    DB Architect
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/sql-performance-architect" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Activity className="w-3.5 h-3.5" />
                                                    </span>
                                                    SQL Architect
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/cron-job-generator" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </span>
                                                    Cron Generator
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/api-playground" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Zap className="w-3.5 h-3.5" />
                                                    </span>
                                                    API Playground
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/http-headers-analyzer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Shield className="w-3.5 h-3.5" />
                                                    </span>
                                                    Header Analyzer
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/jwt-security-audit" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Shield className="w-3.5 h-3.5" />
                                                    </span>
                                                    JWT Auditor
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/json-to-csv" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Database className="w-3.5 h-3.5" />
                                                    </span>
                                                    JSON ↔ CSV
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/push-notifications" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                    </span>
                                                    Push Notifications
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/woocommerce" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <ShoppingCart className="w-3.5 h-3.5" />
                                                    </span>
                                                    WooCommerce
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Palette className="w-3 h-3" /> Design
                                            </p>
                                            <div className="space-y-1">
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/og-image-generator" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                    </span>
                                                    OG Image Gen
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/color-picker" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <Palette className="w-3.5 h-3.5" />
                                                    </span>
                                                    Color Picker
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/sketch-board" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <Palette className="w-3.5 h-3.5" />
                                                    </span>
                                                    Sketch Board
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/tailwind-factory" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <Layout className="w-3.5 h-3.5" />
                                                    </span>
                                                    Tailwind Factory
                                                </Link>
                                                <Link onClick={() => setIsToolsOpen(false)} href="/tools/tailwind-animations" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                    </span>
                                                    Tailwind FX
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                                    <Link onClick={() => setIsToolsOpen(false)} href="/#tools" className="block text-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                                        View All 25+ Tools →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/about"
                            className="text-gray-800 hover:text-primary-600 transition-colors font-medium"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
                        >
                            Contact
                        </Link>
                        <ReportIssueLink className="text-gray-800 hover:text-red-500 transition-colors font-medium cursor-pointer">
                            Report Issue
                        </ReportIssueLink>

                        {/* Command Palette Shortcut Hint */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-white transition-all cursor-pointer group/cmd shadow-sm"
                            id="command-palette-trigger"
                            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                        >
                            <Search className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.1em]">Find Tool</span>
                            <div className="flex items-center gap-0.5 ml-1">
                                <span className="text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200 shadow-sm group-hover/cmd:border-blue-200 transition-colors">⌘</span>
                                <span className="text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200 shadow-sm group-hover/cmd:border-blue-200 transition-colors">K</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Buttons */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Search Tools"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-[73px] bottom-0 bg-white z-50 overflow-y-auto px-4 py-6 animate-in slide-in-from-right duration-300">
                        <div className="space-y-6 pb-20">
                            {/* Primary Navigation - Compact Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-gray-900 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
                                    <Rocket className="w-5 h-5 text-blue-500" />
                                    <span className="text-[11px] uppercase tracking-wide">Home</span>
                                </Link>
                                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-gray-900 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
                                    <BookOpen className="w-5 h-5 text-indigo-500" />
                                    <span className="text-[11px] uppercase tracking-wide">Insights</span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-gray-900 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
                                    <Layout className="w-5 h-5 text-purple-500" />
                                    <span className="text-[11px] uppercase tracking-wide">About</span>
                                </Link>
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-gray-900 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
                                    <Shield className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[11px] uppercase tracking-wide">Contact</span>
                                </Link>
                            </div>

                            {/* Tools Grid - Compact 3 columns */}
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-blue-500" /> Popular Tools
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { href: '/tools/ai-error-explainer', label: 'AI Error', icon: Sparkles, color: 'text-blue-500' },
                                        { href: '/tools/regex-tester', label: 'Regex', icon: Code, color: 'text-purple-500' },
                                        { href: '/tools/json-to-csv', label: 'JSON/CSV', icon: Database, color: 'text-emerald-500' },
                                        { href: '/tools/woocommerce', label: 'WooCom', icon: ShoppingCart, color: 'text-orange-500' },
                                        { href: '/tools/tailwind-animations', label: 'Tailwind', icon: Sparkles, color: 'text-pink-500' },
                                        { href: '/tools/prompt-optimizer', label: 'Prompt', icon: Zap, color: 'text-amber-500' },
                                    ].map((tool) => {
                                        const IconComponent = tool.icon;
                                        return (
                                            <Link
                                                key={tool.href}
                                                href={tool.href}
                                                className="flex flex-col items-center gap-2 p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all bg-white shadow-sm"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <IconComponent className={`w-4 h-4 ${tool.color}`} />
                                                <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{tool.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* All Tools Link - High Visibility */}
                            <Link
                                href="/#tools"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
                            >
                                Browse All 25+ Tools
                            </Link>

                            {/* Reporting */}
                            <div className="pt-2 text-center">
                                <ReportIssueLink className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-4 py-2 rounded-full hover:bg-red-50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                                    Report a Bug
                                </ReportIssueLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header >
    );
}
