import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import TextTools from '@/components/tools/TextTools';

export const metadata = genMeta({
    title: 'Free Text Tools - Character Count, Word Count, Case Converter',
    description: 'Count characters and words, convert text case (upper/lower/title), and clean up text. Free online text manipulation tools for writers and developers.',
    keywords: ['character count', 'word count', 'text tools', 'case converter', 'uppercase', 'lowercase'],
    canonical: '/tools/text-tools',
});

const relatedTools = [
    { name: 'Markdown → HTML', href: '/tools/markdown-to-html' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'URL Encoder/Decoder', href: '/tools/url-encoder' },
];

export default function TextToolsPage() {
    return (
        <ToolLayout
            title="Text Tools"
            description="Count characters and words, convert case, and clean up your text with powerful text manipulation tools."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What are Text Tools?
                </h2>
                <p className="text-gray-600 mb-4">
                    Text Tools is a comprehensive suite of text manipulation utilities designed for writers, developers, and content creators. Whether you need to check character limits for social media, convert text to different cases, or clean up messy formatting, our tools make it effortless.
                </p>
                <p className="text-gray-600">
                    All processing happens instantly in your browser - your text never leaves your device, ensuring complete privacy. Perfect for checking X character limits (280), SMS message lengths (160), essay word counts, or cleaning up text copied from PDFs and websites.
                </p>
            </section>

            <TextTools />
        </ToolLayout>
    );
}
