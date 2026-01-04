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

            <div className="w-full py-12">
                {/* Viral Header Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8 shadow-2xl">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Viral Feature: ERD-to-Code</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
                        Draw Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Scalable Database
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
                        Stop writing boilerplate SQL. Use our high-performance interactive canvas to design your entities, connect relationships with satisfying cables, and export production-ready code in one click.
                    </p>
                </div>

                {/* The Interactive Studio */}
                <div id="designer-studio" className="scroll-mt-24">
                    <DatabaseArchitectClient />
                </div>

                {/* Viral SEO Content Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 space-y-40">
                    {/* Why Visual Architechture? */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative p-12 rounded-[3.5rem] bg-slate-900 border border-white/5 shadow-2xl">
                                <pre className="text-sm font-mono text-indigo-400/90 leading-relaxed overflow-hidden">
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
                                <div className="absolute bottom-6 right-8 flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Live Sync Enabled</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-10">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                Because Schemas <br />
                                <span className="text-indigo-500">Should Be Visual.</span>
                            </h2>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                                <p>
                                    Database design is the foundation of every great application. But why are we still wasting hours on typos and syntax errors in raw text files?
                                </p>
                                <p>
                                    The **Visual Database Architect** turns data modeling into a creative process. It's built for rapid prototyping and enterprise-grade architecture.
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {[
                                        { icon: Zap, text: 'No Syntactic Errors', color: 'text-yellow-500' },
                                        { icon: Share2, text: 'Team Alignment', color: 'text-blue-500' },
                                        { icon: Code2, text: 'Multi-ORM Export', color: 'text-purple-500' },
                                        { icon: Database, text: 'ERD Automation', color: 'text-emerald-500' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[11px]">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { title: 'Interactive Canvas', icon: '🎨', desc: 'Industry-standard drag-and-drop mechanics with infinite workspace zoom and pan.' },
                            { title: 'Satisfying "Cables"', icon: '🧬', desc: 'Watch your relationships snap together with smart-routing edge paths and animated flows.' },
                            { title: 'Prisma First', icon: '💎', desc: 'Directly compatible with Prisma schemas, including cuid, autoincrement, and relation attributes.' },
                            { title: 'SQL Dialects', icon: '🗄️', desc: 'Export clean SQL for PostgreSQL, MySQL, and SQLite with proper foreign key constraints.' },
                            { title: 'Drizzle & TypeORM', icon: '📜', desc: 'Generate TypeScript entities and schemas that are type-safe and ready to drop into your repo.' },
                            { title: 'Auto-Scaling UI', icon: '🖥️', desc: 'Nodes react to your content, auto-expanding as you add more columns and indices.' }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <span className="text-4xl mb-8 block">{item.icon}</span>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl mb-4">{item.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Technical FAQ Section */}
                    <div className="max-w-4xl mx-auto space-y-16">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Database Architecture FAQ</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">A Deep Utility Guide for Architects</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                            {[
                                { q: "How do I define One-to-Many relationships?", a: "Simply drag a cable from the Primary Key of your Parent table to the Foreign Key column of your Child table. The Architect will automatically assign the correct relationship attributes for Prisma and SQL." },
                                { q: "Can I import an existing SQL schema?", a: "Yes! Use our 'Magic Import' feature to paste your raw CREATE TABLE statements, and we will reconstruct the visual ERD for you instantly." },
                                { q: "What data types are supported?", a: "We support the full spectrum of modern application types: String, Int, BigInt, Float, Boolean, DateTime, Json, and Boolean, with automatic mapping for different ORMs." },
                                { q: "Does it help with database normalization?", a: "While we don't automatically normalize, the visual layout makes detecting redundant data and circular dependencies significantly easier than reading raw code." }
                            ].map((faq, i) => (
                                <div key={i} className="p-10 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 relative group">
                                    <div className="absolute top-10 left-0 w-1 h-12 bg-indigo-500 rounded-r-full scale-0 group-hover:scale-100 transition-transform"></div>
                                    <h5 className="font-black text-slate-900 dark:text-white mb-4 text-lg tracking-tight">Q: {faq.q}</h5>
                                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">A: {faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Viral CTA */}
                    <div className="p-20 rounded-[5rem] bg-slate-900 text-center relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h3 className="text-5xl font-black text-white mb-8 tracking-tighter relative z-10">Modernize Your Data Flow.</h3>
                        <p className="text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed relative z-10 font-bold italic text-lg opacity-80">
                            Build schemas faster. Catch design flaws earlier. Impress your leads with stunning ERD diagrams that actually work.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 relative z-10">
                            <div className="flex items-center gap-3 px-8 py-3 bg-white/5 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
                                <Code2 className="w-4 h-4 text-indigo-400" />
                                10k Exported Schemas/Month
                            </div>
                            <a
                                href="#designer-studio"
                                className="flex items-center gap-3 px-8 py-3 bg-indigo-600 rounded-2xl border border-indigo-400/30 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer no-underline"
                            >
                                <Zap className="w-4 h-4" />
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
