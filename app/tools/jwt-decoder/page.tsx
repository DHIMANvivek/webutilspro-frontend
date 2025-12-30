import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import JwtHashTool from '@/components/tools/JwtHashTool';

export const metadata = genMeta({
    title: 'Free JWT Decoder & Hash Generator - Decode JWT, Generate SHA, MD5',
    description: 'Decode JWT tokens and generate cryptographic hashes (SHA-1, SHA-256, SHA-512). Free online JWT decoder and hash generator tool.',
    keywords: ['jwt decoder', 'hash generator', 'sha256', 'md5 hash', 'jwt token decoder', 'cryptographic hash'],
    canonical: '/tools/jwt-decoder',
});

const relatedTools = [
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
];

export default function JwtDecoderPage() {
    return (
        <ToolLayout
            title="JWT Decoder & Hash Generator"
            description="Decode JWT tokens to view headers and payloads. Generate cryptographic hashes with SHA-1, SHA-256, or SHA-512."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    JWT Decoder & Hash Generator
                </h2>
                <p className="text-gray-600 mb-4">
                    JSON Web Tokens (JWT) are used for secure information transmission between parties. Our JWT decoder lets you inspect the header and payload of any JWT token without verification. Perfect for debugging authentication issues and understanding token contents.
                </p>
                <p className="text-gray-600">
                    The hash generator creates cryptographic hashes using SHA-1, SHA-256, or SHA-512 algorithms. Use it for data integrity verification, creating checksums, or generating unique identifiers. All operations are performed securely in your browser.
                </p>
            </section>

            <JwtHashTool />
        </ToolLayout>
    );
}
