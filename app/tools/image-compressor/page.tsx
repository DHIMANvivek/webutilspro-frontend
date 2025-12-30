import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import ImageCompressor from '@/components/tools/ImageCompressor';

export const metadata = genMeta({
    title: 'Free Image Compressor - Compress JPEG, PNG, WebP Online',
    description: 'Compress images online for free. Reduce file size while maintaining quality. Support for JPEG, PNG, and WebP. Batch compression available.',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'optimize images', 'tinypng alternative'],
    canonical: '/tools/image-compressor',
});

const relatedTools = [
    { name: 'Base64 Encoder', href: '/tools/base64' },
    { name: 'QR Code Generator', href: '/tools/qr-code-generator' },
    { name: 'Color Picker', href: '/tools/color-picker' },
];

export default function ImageCompressorPage() {
    return (
        <ToolLayout
            title="Image Compressor"
            description="Compress images to reduce file size without losing quality. Perfect for web optimization and faster loading times."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Compress Images?
                </h2>
                <p className="text-gray-600 mb-4">
                    Image compression reduces file size by removing unnecessary data while preserving visual quality. Smaller images load faster, use less bandwidth, and improve website performance and SEO rankings. Our tool uses advanced compression algorithms to achieve optimal size reduction without noticeable quality loss.
                </p>
                <p className="text-gray-600">
                    All compression happens in your browser - your images are never uploaded to any server, ensuring complete privacy and security. You can compress multiple images at once and choose custom quality settings for each project's needs.
                </p>
            </section>

            <ImageCompressor />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Image Compression Best Practices
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Website Optimization:</strong> Compress images to 70-80% quality for web use - this provides the best balance between file size and visual quality</li>
                    <li><strong>Resize Before Compressing:</strong> Set max width to match your actual display size (e.g., 1920px for full-width desktop images)</li>
                    <li><strong>Choose the Right Format:</strong> Use WebP for best compression, JPEG for photos, and PNG for images with transparency</li>
                    <li><strong>Keep Originals:</strong> Always save your original high-quality images before compression for future editing</li>
                    <li><strong>Test on Different Devices:</strong> Verify compressed images look good on both desktop and mobile screens</li>
                    <li><strong>SEO Benefits:</strong> Faster-loading pages from compressed images improve search engine rankings and user experience</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
