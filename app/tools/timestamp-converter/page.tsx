import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import TimestampConverter from '@/components/tools/TimestampConverter';

export const metadata = genMeta({
    title: 'Free Unix Timestamp Converter - Epoch Time Converter Online',
    description: 'Convert Unix timestamps to dates and dates to Unix timestamps. Real-time epoch time converter with timezone support. Free online tool.',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'epoch time', 'unix time converter'],
    canonical: '/tools/timestamp-converter',
});

const relatedTools = [
    { name: 'UUID Generator', href: '/tools/uuid-generator' },
    { name: 'Hash Generator', href: '/tools/jwt-decoder' },
    { name: 'Base64 Encoder', href: '/tools/base64' },
];

export default function TimestampConverterPage() {
    return (
        <ToolLayout
            title="Unix Timestamp Converter"
            description="Convert between Unix timestamps and human-readable dates. Live epoch time display with timezone support."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is a Unix Timestamp?
                </h2>
                <p className="text-gray-600 mb-4">
                    A Unix timestamp (also known as Epoch time or POSIX time) is a system for tracking time as the number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970 (the Unix epoch). This system is used extensively in programming and computing because it provides a simple, unambiguous way to represent dates and times across different systems and timezones.
                </p>
                <p className="text-gray-600">
                    Unix timestamps are always represented in UTC (Coordinated Universal Time) and are independent of timezones, making them ideal for storing dates and times in databases, APIs, and log files. When displayed to users, timestamps are typically converted to the local timezone for better readability.
                </p>
            </section>

            <TimestampConverter />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Common Uses for Unix Timestamps
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Database Storage:</strong> Store dates and times in databases as integers, making queries and comparisons faster and simpler</li>
                    <li><strong>API Responses:</strong> Exchange date/time information between systems in a standardized, timezone-independent format</li>
                    <li><strong>Log Files:</strong> Timestamp events in server logs and application logs for debugging and analysis</li>
                    <li><strong>Caching:</strong> Set expiration times for cached data using Unix timestamps for precise time control</li>
                    <li><strong>Session Management:</strong> Track session creation and expiration times in web applications</li>
                    <li><strong>Scheduling:</strong> Schedule tasks and cron jobs using Unix timestamps for precise execution times</li>
                    <li><strong>File Systems:</strong> Store file creation, modification, and access times as Unix timestamps</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
