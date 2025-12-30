import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import ColorTool from '@/components/tools/ColorTool';

export const metadata = genMeta({
    title: 'Free Color Picker & Gradient Generator - HEX, RGB, HSL',
    description: 'Pick colors and generate gradients with our free color tool. Convert between HEX, RGB, and HSL formats. Create beautiful CSS gradients instantly.',
    keywords: ['color picker', 'gradient generator', 'hex to rgb', 'color converter', 'css gradient', 'color tool'],
    canonical: '/tools/color-picker',
});

const relatedTools = [
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'Markdown → HTML', href: '/tools/markdown-to-html' },
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
];

export default function ColorPickerPage() {
    return (
        <ToolLayout
            title="Color Picker & Gradient Generator"
            description="Pick colors, convert formats (HEX/RGB/HSL), and generate beautiful CSS gradients for your designs."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Color Tools for Designers & Developers
                </h2>
                <p className="text-gray-600 mb-4">
                    Our color picker and gradient generator helps you create perfect color schemes for your projects. Pick any color visually or enter color codes, then instantly convert between HEX, RGB, and HSL formats.  The gradient generator lets you create stunning CSS gradients with full control over colors and direction.
                </p>
                <p className="text-gray-600">
                    All tools provide ready-to-use CSS code that you can copy directly into your stylesheets. Perfect for web designers, developers, and anyone working with colors in digital projects.
                </p>
            </section>

            <ColorTool />
        </ToolLayout>
    );
}
