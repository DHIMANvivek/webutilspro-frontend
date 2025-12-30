import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import UrlTool from '@/components/tools/UrlTool';

export const metadata = genMeta({
    title: 'Free URL Encoder/Decoder - Encode & Decode URLs Online',
    description: 'Encode and decode URLs instantly. Convert special characters to URL-safe format and back. Free online URL encoder/decoder tool.',
    keywords: ['url encoder', 'url decoder', 'encode url', 'decode url', 'url encoding', 'percent encoding'],
    canonical: '/tools/url-encoder',
});

const relatedTools = [
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
];

export default function UrlEncoderPage() {
    return (
        <ToolLayout
            title="URL Encoder/Decoder"
            description="Encode URLs to safe format or decode encoded URLs back to readable text. Real-time conversion."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is URL Encoding?
                </h2>
                <p className="text-gray-600 mb-4">
                    URL encoding (also called percent-encoding) converts special characters in URLs to a format that can be safely transmitted over the internet. Characters like spaces, ampersands, and question marks are replaced with their percent-encoded equivalents (e.g., space becomes %20).
                </p>
                <p className="text-gray-600">
                    This tool provides instant bidirectional conversion - encode readable URLs to safe format or decode percent-encoded URLs back to human-readable text.
                </p>
            </section>

            <UrlTool />
        </ToolLayout>
    );
}
