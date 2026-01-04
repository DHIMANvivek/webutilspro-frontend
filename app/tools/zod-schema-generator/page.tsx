import { Metadata } from 'next';
import ZodSchemaGeneratorClient from '@/components/tools/ZodSchemaGenerator/ZodSchemaGeneratorClient';
import ToolLayout from '@/components/ToolLayout';
import { Database, Zap, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Everything-to-Zod Schema Factory | WebUtilsPro',
    description: 'Transform JSON, TypeScript interfaces, and GraphQL SDL into production-ready Zod schemas and Prisma models instantly.',
    keywords: 'zod schema generator, json to zod, typescript to zod, graphql to zod, prisma model generator, schema factory, devtools, type safety',
    alternates: {
        canonical: 'https://webutilspro.com/tools/zod-schema-generator'
    }
};

export default function ZodSchemaGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Everything-to-Zod Schema Factory",
        "operatingSystem": "All",
        "applicationCategory": "DeveloperApplication",
        "description": "Powerful data transformer that converts JSON, TypeScript, and GraphQL into Zod schemas and Prisma models.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <ToolLayout
            title="Everything-to-Zod Schema Factory"
            description="Transform JSON, TypeScript, and GraphQL into production-ready Zod schemas instantly."
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/20 mb-6">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Deep Utility Suite</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Everything-to-Zod <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Schema Factory
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Bridge the gap between raw data and type-safety. Convert JSON, TypeScript, or GraphQL into high-performance Zod schemas and Prisma models in seconds.
                    </p>
                </div>

                <ZodSchemaGeneratorClient />

                {/* Viral SEO Content Sections */}
                <div className="mt-32 space-y-32">
                    {/* Why Zod? */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                                Why Progressive <br />
                                <span className="text-indigo-500">Validation Matters</span>
                            </h2>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    In modern web development, TypeScript provides compile-time safety, but it doesn't protect you at runtime. That's where **Zod** shines. By using a schema-first approach, you ensure that the data entering your application—whether from a form, an API, or a database—is exactly what you expect.
                                </p>
                                <p>
                                    Our **Everything-to-Zod Schema Factory** accelerates this process by 10x. instead of manually defining complex nested objects, you simply paste your sample data and get a production-ready validator.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {[
                                        'Zero Dependencies (Runtime)',
                                        'Type Inference out of the box',
                                        'Works in Node, Browser, and Edge',
                                        'Extensible and Composible'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl overflow-hidden">
                                <pre className="text-xs font-mono text-indigo-300 leading-relaxed">
                                    <code>{`// Before: Manual types are brittle
interface User { id: string }

// After: Zod is the source of truth
const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  lastSeen: z.string().datetime()
});

type User = z.infer<typeof User>;`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'JSON to Zod', desc: 'Paste raw API responses and generate deep nested schemas automatically.' },
                            { title: 'TS to Zod', desc: 'Convert your existing TypeScript interfaces into runtime validators.' },
                            { title: 'GQL to Zod', desc: 'Bridge the gap between your GraphQL schema and your client-side validation.' },
                            { title: 'Prisma Models', desc: 'Instantly generate database models from your data prototypes.' }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
                                <span className="text-4xl mb-6 block">{(['📦', '📜', '🧬', '🗄️'])[i]}</span>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg mb-4">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Frequently Asked Questions</h2>
                            <p className="text-slate-500 font-medium">Everything you need to know about the Factory.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { q: "Is this tool free for commercial use?", a: "Yes, 100% free. The code generated is yours to use in any project." },
                                { q: "Does it support nested JSON objects?", a: "Absolutely. Our engine recursively parses your JSON to any depth, handling arrays, dates, and nested objects." },
                                { q: "Can it handle TypeScript unions and intersections?", a: "Our current parser handles standard interfaces and types. Complex unions are coming in V4!" },
                                { q: "Why generate Prisma models?", a: "Modeling your database from real-world data samples (JSON) is often faster than starting from scratch. We help you bridge that gap." }
                            ].map((faq, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5">
                                    <h5 className="font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Q: {faq.q}</h5>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">A: {faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="p-16 rounded-[4rem] bg-slate-950 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h3 className="text-4xl font-black text-white mb-8 tracking-tighter relative z-10">Stop Writing Schemas. Build Products.</h3>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed relative z-10 font-medium italic">
                            The Zod Schema Factory is part of the WebUtilsPro power suite. High-performance tools for engineers who value their time.
                        </p>
                        <div className="flex justify-center gap-6 relative z-10">
                            <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase text-slate-400">
                                <Database className="w-3.5 h-3.5" />
                                1.2M+ Schemas Generated
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
