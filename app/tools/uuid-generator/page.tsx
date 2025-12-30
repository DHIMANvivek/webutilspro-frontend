import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import UuidGenerator from '@/components/tools/UuidGenerator';

export const metadata = genMeta({
    title: 'Free UUID/GUID Generator - Generate Unique Identifiers Online',
    description: 'Generate UUID/GUID (Universally Unique Identifiers) instantly. Bulk generation, uppercase, no-dashes options. Free online UUID generator tool.',
    keywords: ['uuid generator', 'guid generator', 'unique id', 'uuid v4', 'random uuid'],
    canonical: '/tools/uuid-generator',
});

const relatedTools = [
    { name: 'Password Generator', href: '/tools/password-generator' },
    { name: 'Hash Generator', href: '/tools/jwt-decoder' },
    { name: 'Base64 Encoder', href: '/tools/base64' },
];

export default function UuidGeneratorPage() {
    return (
        <ToolLayout
            title="UUID/GUID Generator"
            description="Generate universally unique identifiers (UUIDs) instantly. Perfect for database keys, session IDs, and unique identifiers."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is a UUID/GUID?
                </h2>
                <p className="text-gray-600 mb-4">
                    A UUID (Universally Unique Identifier) or GUID (Globally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems. The probability of duplicate UUIDs is so low that it's considered practically zero, making them perfect for distributed systems where unique identifiers are needed without central coordination.
                </p>
                <p className="text-gray-600">
                    Our UUID generator creates Version 4 UUIDs using cryptographically strong random numbers. Each UUID consists of 32 hexadecimal digits displayed in five groups separated by hyphens (8-4-4-4-12), for example: 550e8400-e29b-41d4-a716-446655440000.
                </p>
            </section>

            <UuidGenerator />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Common Use Cases for UUIDs
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Database Primary Keys:</strong> Use UUIDs as primary keys in distributed databases to avoid ID conflicts across different servers</li>
                    <li><strong>Session Identifiers:</strong> Generate unique session IDs for web applications and API authentication tokens</li>
                    <li><strong>File Names:</strong> Create unique filenames for uploaded files to prevent collisions and overwriting</li>
                    <li><strong>API Request IDs:</strong> Track and debug API requests with unique identifiers for logging and tracing</li>
                    <li><strong>Message Queue IDs:</strong> Assign unique identifiers to messages in distributed message queues</li>
                    <li><strong>Transaction IDs:</strong> Generate unique transaction identifiers for financial systems and payment processing</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
