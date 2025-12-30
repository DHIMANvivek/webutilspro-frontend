import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';

export const metadata = genMeta({
    title: 'Free Lorem Ipsum Generator - Placeholder Text Generator',
    description: 'Generate Lorem Ipsum placeholder text for your designs and mockups. Choose paragraphs, sentences, or words. Free online Lorem Ipsum generator.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'filler text', 'lorem ipsum', 'lipsum'],
    canonical: '/tools/lorem-ipsum-generator',
});

const relatedTools = [
    { name: 'Text Tools', href: '/tools/text-tools' },
    { name: 'Password Generator', href: '/tools/password-generator' },
    { name: 'UUID Generator', href: '/tools/uuid-generator' },
];

export default function LoremIpsumPage() {
    return (
        <ToolLayout
            title="Lorem Ipsum Generator"
            description="Generate placeholder Lorem Ipsum text for your design projects. Fast, customizable, and free."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is Lorem Ipsum?
                </h2>
                <p className="text-gray-600 mb-4">
                    Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s. It's derived from sections of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. The text has been scrambled to make it nonsensical Latin, serving as filler content that allows designers to focus on layout and visual elements without being distracted by meaningful content.
                </p>
                <p className="text-gray-600">
                    Using Lorem Ipsum is standard practice in the design industry because it has a more-or-less normal distribution of letters, making it look like readable English. This helps clients and stakeholders visualize the final product without getting caught up in the actual content during the design phase.
                </p>
            </section>

            <LoremIpsumGenerator />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Use Lorem Ipsum?
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Focus on Design:</strong> Lorem Ipsum lets designers and clients concentrate on visual elements and layout without content distractions</li>
                    <li><strong>Realistic Text Rendering:</strong> The distribution of letters approximates English, showing how text will appear in the final design</li>
                    <li><strong>Standard Practice:</strong> Widely recognized in the industry as placeholder text, making mockups and templates universally understood</li>
                    <li><strong>Avoid Placeholder Bias:</strong> Using meaningful content in mockups can bias design decisions or distract from layout issues</li>
                    <li><strong>Fill Space Accurately:</strong> Generates the right amount of text to test layouts at various content lengths</li>
                    <li><strong>Professional Appearance:</strong> Makes mockups and prototypes look more polished and complete during presentations</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
