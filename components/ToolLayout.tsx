'use client';

import Link from 'next/link';

import { ArrowRight, ChevronRight, LayoutGrid } from 'lucide-react';
import { generateBreadcrumb } from '@/lib/seo';
import Breadcrumbs from './Breadcrumbs';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ToolLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    relatedTools?: { name: string; href: string }[];
    schema?: object;
}

export default function ToolLayout({
    title,
    description,
    children,
    relatedTools = [],
    schema,
}: ToolLayoutProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const pathname = usePathname();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    useEffect(() => {
        async function fetchToolImage() {
            try {
                const response = await fetch(`${backendUrl}/api/media/public-tools`);
                if (response.ok) {
                    const tools = await response.json();
                    const slug = pathname.split('/').pop();
                    const currentTool = tools.find((t: any) => t.id === slug);
                    if (currentTool?.imageUrl) setImageUrl(currentTool.imageUrl);
                }
            } catch (err) {
                console.warn('ToolLayout: Failed to fetch image');
            }
        }
        fetchToolImage();
    }, [backendUrl, pathname]);

    const breadcrumbSchema = generateBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Tools', url: '/#tools' },
        { name: title, url: '#' },
    ]);

    const combinedSchema = Array.isArray(schema)
        ? [breadcrumbSchema, ...schema]
        : schema
            ? [breadcrumbSchema, schema]
            : breadcrumbSchema;

    return (
        <div className="min-h-screen bg-[#f7f7f1] text-neutral-950 selection:bg-[#fbff5d]">
            <section className="wup-paper-grid border-b border-neutral-900/10">
                <div className="container-custom py-10 md:py-14">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                            { name: title, href: '#' },
                        ]}
                    />

                    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
                        <div>
                            <div className="wup-kicker">
                                <LayoutGrid className="h-3.5 w-3.5" />
                                WebUtilsPro Tool
                            </div>
                            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-tight tracking-normal md:text-7xl">
                                {title}
                            </h1>
                            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600 md:text-xl">
                                {description}
                            </p>
                        </div>

                        <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                { label: 'Mode', value: 'Browser' },
                                { label: 'Access', value: 'No signup' },
                                { label: 'Output', value: 'Copy ready' }
                            ].map((row) => (
                                <div key={row.label} className="bg-[#fbfbf4] p-4">
                                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{row.label}</div>
                                    <div className="mt-2 truncate text-xl font-semibold">{row.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {imageUrl && (
                        <div className="mt-8 aspect-[16/7] overflow-hidden border border-neutral-900/15 bg-neutral-900/10">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="border-b border-neutral-900/10 bg-[#fbfbf4] py-10 md:py-12">
                <div className="container-custom">
                    <div id="tool-functional-area" className="border border-neutral-900/15 bg-[#fbfbf4] p-4 md:p-6">
                        {children}
                    </div>
                </div>
            </section>

            {relatedTools.length > 0 && (
                <section className="wup-paper-grid py-12 md:py-14">
                    <div className="container-custom">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Related tools</div>
                                <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Keep exploring.</h2>
                            </div>
                            <Link href="/#tools" className="inline-flex h-11 items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                                All tools
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-3">
                            {relatedTools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="group bg-[#fbfbf4] p-5 transition-colors hover:bg-white"
                                >
                                    <h3 className="text-lg font-semibold text-neutral-950">{tool.name}</h3>
                                    <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 group-hover:text-neutral-950">
                                        Open tool <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {combinedSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
                />
            )}
        </div>
    );
}
