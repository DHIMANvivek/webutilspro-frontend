import Link from 'next/link';
import AdPlacement from './AdPlacement';

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
    return (
        <div className="min-h-screen gradient-bg">
            <div className="container-custom py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-primary-600">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/#tools" className="hover:text-primary-600">
                                Tools
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{title}</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl">{description}</p>
                </div>

                {/* Main Tool Content */}
                <div className="mb-12">{children}</div>

                {/* AdSense Placement */}
                <AdPlacement />

                {/* Related Tools */}
                {relatedTools.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Related Tools
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedTools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="card hover:border-primary-300 transition-all"
                                >
                                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Explore this tool →
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Schema Markup */}
                {schema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                )}
            </div>
        </div>
    );
}
