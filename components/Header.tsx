'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ChevronDown,
    Cloud,
    Code2,
    Database,
    LayoutGrid,
    Menu,
    Search,
    ShieldCheck,
    Sparkles,
    TerminalSquare,
    Webhook,
    X,
    Zap,
    type LucideIcon
} from 'lucide-react';
import ReportIssueLink from './ReportIssueLink';

type NavTool = {
    name: string;
    href: string;
    icon: LucideIcon;
    status?: string;
};

type NavGroup = {
    title: string;
    tools: NavTool[];
};

const NAV_GROUPS: NavGroup[] = [
    {
        title: 'Cloud Workflow',
        tools: [
            { name: 'Cloud Lab', href: '/tools/cloud-lab', icon: Cloud, status: 'NEW' },
            { name: 'Webhook Inspector', href: '/tools/webhook-inspector', icon: Webhook },
            { name: 'API Playground', href: '/tools/api-playground', icon: Zap },
            { name: 'OTLP Inspector', href: '/tools/otlp-endpoint-inspector', icon: TerminalSquare }
        ]
    },
    {
        title: 'Build Tools',
        tools: [
            { name: 'MCP Tester', href: '/tools/mcp-tester', icon: Sparkles },
            { name: 'Schema Forge', href: '/tools/schema-forge', icon: Database },
            { name: 'DB Architect', href: '/tools/database-architect', icon: LayoutGrid },
            { name: 'Code Formatter', href: '/tools/code-formatter', icon: Code2 }
        ]
    },
    {
        title: 'Inspect',
        tools: [
            { name: 'JWT Auditor', href: '/tools/jwt-security-audit', icon: ShieldCheck },
            { name: 'Headers Analyzer', href: '/tools/http-headers-analyzer', icon: ShieldCheck },
            { name: 'JSON Validator', href: '/tools/json-validator', icon: Database },
            { name: 'Regex Tester', href: '/tools/regex-tester', icon: Code2 }
        ]
    }
];

const MOBILE_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Tools', href: '/#tools' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const openCommandPalette = () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    };

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-900/15 bg-[#fbfbf4]/88 backdrop-blur-md">
            <nav className="container-custom">
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center border border-neutral-900 bg-[#fbff5d] shadow-[3px_3px_0_rgba(20,20,15,0.22)]">
                            <img src="/logo.png" alt="WebUtilsPro" className="h-7 w-7 object-cover" />
                        </span>
                        <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-neutral-950">
                            WebUtilsPro
                        </span>
                    </Link>

                    <div className="hidden items-center gap-7 md:flex">
                        <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-600 hover:text-neutral-950">
                            Home
                        </Link>

                        <div
                            className="relative"
                            onMouseEnter={() => setIsToolsOpen(true)}
                            onMouseLeave={() => setIsToolsOpen(false)}
                        >
                            <button className="flex items-center gap-1 font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-600 hover:text-neutral-950">
                                Tools
                                <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`absolute left-1/2 top-full mt-4 w-[720px] -translate-x-1/2 border border-neutral-900/20 bg-[#fbfbf4] shadow-[12px_14px_0_rgba(20,20,15,0.12)] transition-all duration-200 ${isToolsOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}
                            >
                                <div className="grid grid-cols-3 gap-px bg-neutral-900/15">
                                    {NAV_GROUPS.map((group) => (
                                        <div key={group.title} className="bg-[#fbfbf4] p-4">
                                            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                                                {group.title}
                                            </div>
                                            <div className="space-y-1">
                                                {group.tools.map((tool) => {
                                                    const Icon = tool.icon;
                                                    return (
                                                        <Link
                                                            key={tool.href}
                                                            href={tool.href}
                                                            onClick={() => setIsToolsOpen(false)}
                                                            className="group/tool flex items-center justify-between gap-3 border border-transparent px-2 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-900/15 hover:bg-[#fbff5d]/45 hover:text-neutral-950"
                                                        >
                                                            <span className="flex min-w-0 items-center gap-3">
                                                                <Icon className="h-4 w-4 shrink-0" />
                                                                <span className="truncate">{tool.name}</span>
                                                            </span>
                                                            {tool.status && (
                                                                <span className="border border-neutral-900/25 bg-[#fbff5d] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]">
                                                                    {tool.status}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/#tools"
                                    onClick={() => setIsToolsOpen(false)}
                                    className="block border-t border-neutral-900/15 px-4 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-600 hover:bg-[#fbff5d]/45 hover:text-neutral-950"
                                >
                                    View dynamic tool catalog
                                </Link>
                            </div>
                        </div>

                        <Link href="/about" className="font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-600 hover:text-neutral-950">
                            About
                        </Link>
                        <Link href="/contact" className="font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-600 hover:text-neutral-950">
                            Contact
                        </Link>
                        <ReportIssueLink className="cursor-pointer font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-600 hover:text-neutral-950">
                            Report
                        </ReportIssueLink>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <button
                            onClick={openCommandPalette}
                            className="flex h-9 items-center gap-2 border border-neutral-900/15 bg-[#fbfbf4] px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600 hover:border-neutral-950 hover:text-neutral-950"
                        >
                            <Search className="h-4 w-4" />
                            Find
                        </button>
                        <Link
                            href="/tools/cloud-lab"
                            className="flex h-9 items-center gap-2 border border-neutral-950 bg-[#fbff5d] px-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-950 shadow-[3px_3px_0_rgba(20,20,15,0.2)]"
                        >
                            Cloud Lab
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={openCommandPalette}
                            className="p-2 text-neutral-700"
                            aria-label="Search tools"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="p-2 text-neutral-700"
                            aria-label="Open menu"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed left-0 right-0 top-16 z-50 border-b border-neutral-900/15 bg-[#fbfbf4] p-4 md:hidden">
                    <div className="grid grid-cols-2 gap-px border border-neutral-900/15 bg-neutral-900/15">
                        {MOBILE_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-[#fbfbf4] px-4 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-700"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 grid gap-px border border-neutral-900/15 bg-neutral-900/15">
                        {NAV_GROUPS.flatMap((group) => group.tools).slice(0, 8).map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 bg-[#fbfbf4] px-4 py-3 text-sm font-medium text-neutral-800"
                                >
                                    <Icon className="h-4 w-4" />
                                    {tool.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
