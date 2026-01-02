import { Metadata } from 'next';
import TimestampConverterClient from '@/components/tools/TimestampConverter/TimestampConverterClient';
import { generateMetadata as genMeta, generateToolSchema, generateBreadcrumb } from '@/lib/seo';

export const metadata: Metadata = genMeta({
    title: 'Timestamp Converter - Unix, ISO, UTC Time Converter',
    description: 'Convert between Unix timestamps, ISO 8601, UTC, and local time formats instantly. Free online timestamp converter with timezone support and relative time formatting.',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'iso 8601 converter', 'time zone converter', 'utc converter'],
    canonical: 'https://webutilspro.com/tools/timestamp-converter'
});

export default function TimestampConverterPage() {
    const toolSchema = generateToolSchema({
        name: 'Timestamp Converter',
        description: 'Convert between Unix timestamps, ISO 8601, UTC, and local time formats with timezone support',
        url: 'https://webutilspro.com/tools/timestamp-converter'
    });

    const breadcrumb = generateBreadcrumb([
        { name: 'Home', url: 'https://webutilspro.com' },
        { name: 'Tools', url: 'https://webutilspro.com/tools' },
        { name: 'Timestamp Converter', url: 'https://webutilspro.com/tools/timestamp-converter' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />

            <div className="py-12 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-2xl">⏱️</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">
                                Timestamp Converter
                            </h1>
                            <p className="text-lg text-slate-300">
                                Convert between Unix timestamps, ISO 8601, UTC, and more
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                            ✓ Real-time Updates
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold flex items-center gap-1">
                            ✓ Multiple Formats
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold flex items-center gap-1">
                            ✓ One-Click Copy
                        </span>
                    </div>
                </div>
            </div>

            <TimestampConverterClient />

            {/* SEO Content */}
            <div className="container-custom py-12">
                <div className="max-w-4xl mx-auto prose prose-slate">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">About Timestamp Converter</h2>
                    <p className="text-gray-600 mb-6">
                        Our timestamp converter tool helps developers convert between different time formats instantly.
                        Whether you're working with Unix timestamps, ISO 8601 dates, or UTC strings, this tool provides
                        accurate conversions with real-time updates.
                    </p>

                    <h3 className="text-xl font-black text-gray-900 mb-3">Features</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                        <li>Convert Unix timestamps (seconds and milliseconds)</li>
                        <li>ISO 8601 format support</li>
                        <li>UTC and local time formatting</li>
                        <li>Relative time display (e.g., "2 hours ago")</li>
                        <li>One-click copy to clipboard</li>
                        <li>Real-time current timestamp</li>
                    </ul>

                    <h3 className="text-xl font-black text-gray-900 mb-3">What is a Unix Timestamp?</h3>
                    <p className="text-gray-600 mb-6">
                        A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT),
                        not counting leap seconds. It's a widely used time format in programming and databases.
                    </p>

                    <h3 className="text-xl font-black text-gray-900 mb-3">Common Use Cases</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Converting API timestamps to readable formats</li>
                        <li>Debugging time-related issues in applications</li>
                        <li>Working with different timezone data</li>
                        <li>Converting database timestamps</li>
                        <li>Testing date/time functionality</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
