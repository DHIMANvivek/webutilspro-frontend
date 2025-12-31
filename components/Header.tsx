'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X, Rocket, Code, FileText, Database, Shield, Palette, Layout, Wrench, ShoppingCart, Search } from 'lucide-react';
import ReportIssueLink from './ReportIssueLink';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                        {/* Tools Dropdown */}
                        <div className="relative group">
                            <button className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-sm uppercase tracking-wider flex items-center gap-1">
                                Tools
                                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="p-6 grid grid-cols-2 gap-8">
                                    {/* Column 1 */}
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Rocket className="w-3 h-3" /> AI-Powered
                                            </p>
                                            <div className="space-y-1">
                                                <Link href="/tools/ai-error-explainer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <Code className="w-3.5 h-3.5" />
                                                    </span>
                                                    AI Error Explainer
                                                </Link>
                                                <Link href="/tools/prompt-optimizer" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </span>
                                                    Prompt Optimizer
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Code className="w-3 h-3" /> Code & Text
                                            </p>
                                            <div className="space-y-1">
                                                <Link href="/tools/regex-tester" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                                                        <Layout className="w-3.5 h-3.5" />
                                                    </span>
                                                    Regex Tester
                                                </Link>
                                                <Link href="/tools/code-formatter" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all group/item">
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
                                                <Database className="w-3 h-3" /> Data & Utilities
                                            </p>
                                            <div className="space-y-1">
                                                <Link href="/tools/json-to-csv" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                                        <Database className="w-3.5 h-3.5" />
                                                    </span>
                                                    JSON ↔ CSV
                                                </Link>
                                                <Link href="/tools/woocommerce" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
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
                                                <Link href="/tools/color-picker" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all group/item">
                                                    <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                                        <Palette className="w-3.5 h-3.5" />
                                                    </span>
                                                    Color Picker
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                                    <Link href="/#tools" className="block text-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <div className="pl-4 space-y-2">
                                <p className="text-sm font-semibold text-gray-500 uppercase">Tools</p>
                                <Link
                                    href="/tools/regex-tester"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Regex Tester
                                </Link>
                                <Link
                                    href="/tools/json-to-csv"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    JSON ↔ CSV Converter
                                </Link>
                                <Link
                                    href="/tools/markdown-to-html"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Markdown → HTML
                                </Link>
                                <Link
                                    href="/tools/ai-error-explainer"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    AI Error Explainer
                                </Link>
                                <Link
                                    href="/tools/prompt-optimizer"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Prompt Optimizer
                                </Link>
                                <Link
                                    href="/tools/code-formatter"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Code Formatter
                                </Link>
                                <Link
                                    href="/tools/base64"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Base64 Encoder/Decoder
                                </Link>
                                <Link
                                    href="/tools/url-encoder"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    URL Encoder/Decoder
                                </Link>
                                <Link
                                    href="/tools/color-picker"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Color Picker
                                </Link>
                                <Link
                                    href="/tools/jwt-decoder"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    JWT Decoder
                                </Link>
                                <Link
                                    href="/tools/text-tools"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Text Tools
                                </Link>
                                <Link
                                    href="/tools/qr-code-generator"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    QR Code Generator
                                </Link>
                                <Link
                                    href="/tools/password-generator"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Password Generator
                                </Link>
                                <Link
                                    href="/tools/uuid-generator"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    UUID Generator
                                </Link>
                                <Link
                                    href="/tools/lorem-ipsum-generator"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Lorem Ipsum
                                </Link>
                                <Link
                                    href="/tools/timestamp-converter"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Timestamp Converter
                                </Link>
                                <Link
                                    href="/tools/diff-checker"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Diff Checker
                                </Link>
                                <Link
                                    href="/tools/html-encoder"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    HTML Encoder
                                </Link>
                                <Link
                                    href="/tools/json-validator"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    JSON Validator
                                </Link>
                                <Link
                                    href="/tools/image-compressor"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Image Compressor
                                </Link>
                                <Link
                                    href="/tools/minifier"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Minifier
                                </Link>
                                <Link
                                    href="/tools/xml-formatter"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    XML Formatter
                                </Link>
                                <Link
                                    href="/tools/yaml-tools"
                                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    YAML Tools
                                </Link>
                            </div>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <ReportIssueLink
                                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                            >
                                Report Issue
                            </ReportIssueLink>
                        </div>
                    </div>
                )}
            </nav>
        </header >
    );
}
