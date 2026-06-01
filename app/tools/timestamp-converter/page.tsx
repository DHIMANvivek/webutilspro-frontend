import { Metadata } from 'next';
import TimestampConverterClient from '@/components/tools/TimestampConverter/TimestampConverterClient';
import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';

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

    const relatedTools = [
        { name: 'UUID Generator', href: '/tools/uuid-generator' },
        { name: 'Cron Job Generator', href: '/tools/cron-job-generator' },
        { name: 'JSON Validator', href: '/tools/json-validator' }
    ];

    return (
        <ToolLayout
            title="Timestamp Converter"
            description="Convert between Unix timestamps, ISO 8601, UTC, and local time formats with timezone support and one-click copying."
            relatedTools={relatedTools}
            schema={toolSchema}
        >
            <TimestampConverterClient />

            {/* SEO Content */}
            <section className="mt-10 border border-neutral-900/15 bg-[#fbfbf4] p-5 md:p-6">
                <div className="wup-prose">
                    <h2>About Timestamp Converter</h2>
                    <p>
                        Our timestamp converter tool helps developers convert between different time formats instantly.
                        Whether you're working with Unix timestamps, ISO 8601 dates, or UTC strings, this tool provides
                        accurate conversions with real-time updates.
                    </p>

                    <h3>Features</h3>
                    <ul>
                        <li>Convert Unix timestamps (seconds and milliseconds)</li>
                        <li>ISO 8601 format support</li>
                        <li>UTC and local time formatting</li>
                        <li>Relative time display (e.g., "2 hours ago")</li>
                        <li>One-click copy to clipboard</li>
                        <li>Real-time current timestamp</li>
                    </ul>

                    <h3>What is a Unix Timestamp?</h3>
                    <p>
                        A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT),
                        not counting leap seconds. It's a widely used time format in programming and databases.
                    </p>

                    <h3>Common Use Cases</h3>
                    <ul>
                        <li>Converting API timestamps to readable formats</li>
                        <li>Debugging time-related issues in applications</li>
                        <li>Working with different timezone data</li>
                        <li>Converting database timestamps</li>
                        <li>Testing date/time functionality</li>
                    </ul>
                </div>
            </section>
        </ToolLayout>
    );
}
