import Link from 'next/link';
import { Cloud, Github, Heart, ShieldCheck } from 'lucide-react';
import ReportIssueLink from './ReportIssueLink';

const FOOTER_GROUPS = [
    {
        title: 'Cloud',
        links: [
            { name: 'Cloud Lab', href: '/tools/cloud-lab' },
            { name: 'Webhook Inspector', href: '/tools/webhook-inspector' },
            { name: 'API Playground', href: '/tools/api-playground' }
        ]
    },
    {
        title: 'Build',
        links: [
            { name: 'MCP Tester', href: '/tools/mcp-tester' },
            { name: 'Schema Forge', href: '/tools/schema-forge' },
            { name: 'DB Architect', href: '/tools/database-architect' }
        ]
    },
    {
        title: 'Company',
        links: [
            { name: 'About', href: '/about' },
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Disclaimer', href: '/disclaimer' }
        ]
    }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 wup-paper-grid border-t border-neutral-900/15 text-neutral-700">
            <div className="container-custom py-14">
                <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr_1fr]">
                    <div className="bg-[#fbfbf4]/92 p-6">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center border border-neutral-900 bg-[#fbff5d] shadow-[3px_3px_0_rgba(20,20,15,0.18)]">
                                <img src="/logo.png" alt="WebUtilsPro" className="h-8 w-8 object-cover" />
                            </span>
                            <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-neutral-950">
                                WebUtilsPro
                            </span>
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-600">
                            A dynamic developer workspace for managed cloud testing, API inspection, AI workflows, schemas, and everyday engineering utilities.
                        </p>
                        <a
                            href="https://github.com/DHIMANvivek"
                            className="mt-6 inline-flex h-9 items-center gap-2 border border-neutral-900/15 bg-[#fbfbf4] px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-700 hover:border-neutral-950"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                    </div>

                    {FOOTER_GROUPS.map((group) => (
                        <div key={group.title} className="bg-[#fbfbf4]/92 p-6">
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">{group.title}</h3>
                            <div className="mt-5 space-y-3">
                                {group.links.map((link) => (
                                    <Link key={link.href} href={link.href} className="block text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:underline">
                                        {link.name}
                                    </Link>
                                ))}
                                {group.title === 'Company' && (
                                    <ReportIssueLink className="block cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:underline">
                                        Report Issue
                                    </ReportIssueLink>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="bg-[#fbfbf4]/92 p-6">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">Runtime</h3>
                        <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Systems operational
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                                <Cloud className="h-4 w-4" />
                                Managed cloud runtime
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                                <ShieldCheck className="h-4 w-4" />
                                Private lab sessions
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-4 border border-neutral-900/15 bg-[#fbfbf4]/92 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 md:flex-row md:items-center">
                    <span>© {currentYear} WebUtilsPro. All rights reserved.</span>
                    <span className="flex items-center gap-2">
                        Built with <Heart className="h-3.5 w-3.5 fill-rose-500/20 text-rose-500" /> for builders.
                    </span>
                </div>
            </div>
        </footer>
    );
}
