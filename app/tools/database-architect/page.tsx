import { Metadata } from 'next';
import DatabaseArchitectClient from '@/components/tools/DatabaseArchitect/DatabaseArchitectClient';
import ToolLayout from '@/components/ToolLayout';
import { Database, Share2, Code2, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Visual Database Architect | ERD-to-Code Designer | WebUtilsPro',
    description: 'Design your database schema visually with our interactive ERD tool. Export production-ready SQL, Prisma, Drizzle, and TypeORM code instantly.',
    keywords: 'visual database designer, erd tool online, database architect, sql generator, prisma schema generator, drizzle orm tool, database modeling, schema designer',
    alternates: {
        canonical: 'https://webutilspro.com/tools/database-architect'
    }
};

export default function DatabaseArchitectPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Visual Database Architect",
        "operatingSystem": "All",
        "applicationCategory": "DeveloperApplication",
        "description": "Premium interactive tool for visual database modeling and automated schema generation for SQL, Prisma, and Drizzle.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <ToolLayout
            title="Visual Database Architect"
            description="The flagship interactive canvas for modern database modeling."
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="w-full">
                {/* Viral Header Section */}
                <div className="mb-10 border border-neutral-900/15 bg-[#fbfbf4] p-6 text-center md:p-8">
                    <div className="wup-kicker">
                        <Sparkles className="h-3.5 w-3.5" />
                        ERD-to-code
                    </div>
                    <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-6xl">
                        Draw your scalable database.
                    </h1>
                    <p className="mx-auto mt-5 max-w-4xl text-lg font-medium leading-8 text-neutral-600">
                        Stop writing boilerplate SQL. Use our high-performance interactive canvas to design your entities, connect relationships with satisfying cables, and export production-ready code in one click.
                    </p>
                </div>

                {/* The Interactive Studio */}
                <div id="designer-studio" className="scroll-mt-24">
                    <DatabaseArchitectClient />
                </div>

                {/* Viral SEO Content Sections */}
                <div className="mt-20 space-y-20">
                    {/* Why Visual Architechture? */}
                    <div className="grid grid-cols-1 gap-px border border-neutral-900/15 bg-neutral-900/15 lg:grid-cols-2">
                        <div className="bg-[#fbfbf4] p-6 md:p-8">
                            <div className="border border-neutral-900/15 bg-[#fffefa] p-6">
                                <pre className="overflow-auto font-mono text-sm leading-relaxed text-neutral-950">
                                    <code>{`// 1. Draw your tables
// 2. Connect the cables
// 3. Export to Prisma:

model User {
  id    String @id @default(cuid())
  email String @unique
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}`}</code>
                                </pre>
                            </div>
                            <div className="mt-4 inline-flex items-center gap-2 border border-neutral-900/15 bg-[#fbff5d] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-neutral-950">
                                <span className="h-2 w-2 bg-emerald-500" />
                                Live Sync Enabled
                            </div>
                        </div>
                        <div className="space-y-8 bg-[#fbfbf4] p-6 md:p-8">
                            <h2 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-5xl">
                                Because schemas should be visual.
                            </h2>
                            <div className="space-y-5 text-lg font-medium leading-8 text-neutral-600">
                                <p>
                                    Database design is the foundation of every great application. But why are we still wasting hours on typos and syntax errors in raw text files?
                                </p>
                                <p>
                                    The <strong className="font-semibold text-neutral-950">Visual Database Architect</strong> turns data modeling into a creative process. It is built for rapid prototyping and enterprise-grade architecture.
                                </p>
                                <ul className="grid grid-cols-1 gap-px border border-neutral-900/15 bg-neutral-900/15 pt-0 sm:grid-cols-2">
                                    {[
                                        { icon: Zap, text: 'No Syntactic Errors' },
                                        { icon: Share2, text: 'Team Alignment' },
                                        { icon: Code2, text: 'Multi-ORM Export' },
                                        { icon: Database, text: 'ERD Automation' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 bg-[#fbfbf4] p-4">
                                            <div className="flex h-10 w-10 items-center justify-center border border-neutral-900/15 bg-[#fbff5d]">
                                                <item.icon className="h-5 w-5 text-neutral-950" />
                                            </div>
                                            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-800">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-3">
                        {[
                            { title: 'Interactive Canvas', icon: '🎨', desc: 'Industry-standard drag-and-drop mechanics with infinite workspace zoom and pan.' },
                            { title: 'Satisfying "Cables"', icon: '🧬', desc: 'Watch your relationships snap together with smart-routing edge paths and animated flows.' },
                            { title: 'Prisma First', icon: '💎', desc: 'Directly compatible with Prisma schemas, including cuid, autoincrement, and relation attributes.' },
                            { title: 'SQL Dialects', icon: '🗄️', desc: 'Export clean SQL for PostgreSQL, MySQL, and SQLite with proper foreign key constraints.' },
                            { title: 'Drizzle & TypeORM', icon: '📜', desc: 'Generate TypeScript entities and schemas that are type-safe and ready to drop into your repo.' },
                            { title: 'Auto-Scaling UI', icon: '🖥️', desc: 'Nodes react to your content, auto-expanding as you add more columns and indices.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#fbfbf4] p-6">
                                <span className="text-4xl mb-8 block">{item.icon}</span>
                                <h4 className="mb-4 text-xl font-semibold text-neutral-950">{item.title}</h4>
                                <p className="text-sm font-medium leading-6 text-neutral-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Technical FAQ Section */}
                    <div className="mx-auto max-w-4xl space-y-10">
                        <div className="text-center">
                            <h2 className="mb-4 text-4xl font-semibold tracking-normal text-neutral-950">Database Architecture FAQ</h2>
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">A deep utility guide for architects</p>
                        </div>
                        <div className="grid grid-cols-1 gap-px border border-neutral-900/15 bg-neutral-900/15">
                            {[
                                { q: "How do I define One-to-Many relationships?", a: "Simply drag a cable from the Primary Key of your Parent table to the Foreign Key column of your Child table. The Architect will automatically assign the correct relationship attributes for Prisma and SQL." },
                                { q: "Can I import an existing SQL schema?", a: "Yes! Use our 'Magic Import' feature to paste your raw CREATE TABLE statements, and we will reconstruct the visual ERD for you instantly." },
                                { q: "What data types are supported?", a: "We support the full spectrum of modern application types: String, Int, BigInt, Float, Boolean, DateTime, Json, and Boolean, with automatic mapping for different ORMs." },
                                { q: "Does it help with database normalization?", a: "While we don't automatically normalize, the visual layout makes detecting redundant data and circular dependencies significantly easier than reading raw code." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-[#fbfbf4] p-6">
                                    <h5 className="mb-3 text-lg font-semibold text-neutral-950">Q: {faq.q}</h5>
                                    <p className="text-base font-medium leading-7 text-neutral-600">A: {faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Viral CTA */}
                    <div className="border border-neutral-900/15 bg-[#fbff5d] p-8 text-center md:p-12">
                        <h3 className="mb-6 text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl">Modernize Your Data Flow.</h3>
                        <p className="mx-auto mb-8 max-w-3xl text-lg font-medium leading-8 text-neutral-700">
                            Build schemas faster. Catch design flaws earlier. Impress your leads with stunning ERD diagrams that actually work.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="flex items-center gap-3 border border-neutral-900/15 bg-[#fbfbf4] px-6 py-3 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-neutral-700">
                                <Code2 className="h-4 w-4 text-neutral-950" />
                                10k Exported Schemas/Month
                            </div>
                            <a
                                href="#designer-studio"
                                className="flex items-center gap-3 border border-neutral-950 bg-neutral-950 px-6 py-3 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white no-underline transition-colors hover:bg-neutral-800"
                            >
                                <Zap className="h-4 w-4" />
                                Start Designing Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
