import Link from 'next/link';
import AdPlacement from './AdPlacement';
import { ChevronRight, Home, LayoutGrid } from 'lucide-react';
import { generateBreadcrumb } from '@/lib/seo';

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
        <div className="min-h-screen gradient-bg selection:bg-blue-500/30">
            <div className="container-custom py-12 md:py-16">
                {/* Breadcrumb */}
                <nav className="mb-8 animate-fade-in">
                    <ol className="flex items-center space-x-2 text-sm text-slate-500">
                        <li className="flex items-center">
                            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </li>
                        <li className="flex items-center">
                            <Link href="/#tools" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Tools</span>
                            </Link>
                        </li>
                        <li>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </li>
                        <li className="text-slate-900 font-semibold">{title}</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-12 animate-slide-up">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Main Tool Content */}
                <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
                        {children}
                    </div>
                </div>

                {/* AdSense Placement */}
                <div className="mb-20">
                    <AdPlacement />
                </div>

                {/* Related Tools */}
                {relatedTools.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-slate-200/60 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight italic">
                            Keep Exploring
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedTools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="card group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                >
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-2">{tool.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        Open Tool <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Schema Markup */}
                {combinedSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
                    />
                )}
            </div>
        </div>
    );
}
