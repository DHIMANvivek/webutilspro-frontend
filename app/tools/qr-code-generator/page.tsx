import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import QRCodeGenerator from '@/components/tools/QRCodeGenerator';

export const metadata = genMeta({
    title: 'Free QR Code Generator - Create Custom QR Codes Online',
    description: 'Generate QR codes for URLs, text, WiFi, and more. Customize colors and size. Download as PNG. Free online QR code generator tool.',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code', 'custom qr code'],
    canonical: '/tools/qr-code-generator',
});

const relatedTools = [
    { name: 'URL Encoder/Decoder', href: '/tools/url-encoder' },
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
    { name: 'Color Picker', href: '/tools/color-picker' },
];

export default function QRCodeGeneratorPage() {
    return (
        <ToolLayout
            title="QR Code Generator"
            description="Create custom QR codes for URLs, text, and more. Customize colors, adjust size, and download instantly."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is a QR Code Generator?
                </h2>
                <p className="text-gray-600 mb-4">
                    A QR Code (Quick Response Code) is a two-dimensional barcode that can store URLs, text, contact information, WiFi credentials, and more. Our free QR Code Generator lets you create custom QR codes instantly with full control over size, colors, and error correction levels.
                </p>
                <p className="text-gray-600">
                    Perfect for sharing website links, creating business cards, event tickets, product labels, or any situation where you need to quickly share information that can be scanned with a smartphone camera. Customize the appearance to match your brand while maintaining scannability.
                </p>
            </section>

            <QRCodeGenerator />
        </ToolLayout>
    );
}
