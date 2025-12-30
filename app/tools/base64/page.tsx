import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import Base64Tool from '@/components/tools/Base64Tool';

export const metadata = genMeta({
    title: 'Free Base64 Encoder/Decoder - Encode & Decode Base64 Online',
    description: 'Encode and decode Base64 strings instantly. Free online Base64 converter for text, URLs, and data. Fast, secure, and easy to use.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'encode base64', 'decode base64'],
    canonical: '/tools/base64',
});

const relatedTools = [
    { name: 'URL Encoder/Decoder', href: '/tools/url-encoder' },
    { name: 'JWT Decoder', href: '/tools/jwt-decoder' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
];

export default function Base64Page() {
    return (
        <ToolLayout
            title="Base64 Encoder/Decoder"
            description="Encode text to Base64 or decode Base64 strings back to readable text. Fast and secure."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is Base64 Encoding?
                </h2>
                <p className="text-gray-600 mb-4">
                    Base64 is an encoding scheme that converts binary data into ASCII text format using 64 different characters. It's widely used in web development for embedding images in CSS/HTML, transmitting data over APIs, and encoding email attachments.
                </p>
                <p className="text-gray-600">
                    Our Base64 encoder/decoder lets you quickly convert between plain text and Base64 format. All conversions happen in your browser for maximum privacy and security.
                </p>
            </section>

            <Base64Tool />
        </ToolLayout>
    );
}
