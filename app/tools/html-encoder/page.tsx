import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import HtmlEncoder from '@/components/tools/HtmlEncoder';

export const metadata = genMeta({
    title: 'Free HTML Encoder/Decoder - Escape HTML Entities Online',
    description: 'Encode and decode HTML entities. Convert special characters to HTML entities and vice versa. Free online HTML encoder/decoder tool.',
    keywords: ['html encoder', 'html decoder', 'html entities', 'escape html', 'unescape html', 'html escape'],
    canonical: '/tools/html-encoder',
});

const relatedTools = [
    { name: 'URL Encoder/Decoder', href: '/tools/url-encoder' },
    { name: 'Base64 Encoder', href: '/tools/base64' },
    { name: 'JSON Validator', href: '/tools/json-validator' },
];

export default function HtmlEncoderPage() {
    return (
        <ToolLayout
            title="HTML Encoder/Decoder"
            description="Encode HTML special characters to entities and decode HTML entities back to characters. Essential for web security and displaying code."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is HTML Encoding?
                </h2>
                <p className="text-gray-600 mb-4">
                    HTML encoding (also known as HTML escaping) is the process of converting special characters into their HTML entity equivalents. For example, the less-than sign {"<"} becomes &amp;lt; and the ampersand &amp; becomes &amp;amp;. This is essential for displaying these characters correctly in HTML and preventing security vulnerabilities like cross-site scripting (XSS) attacks.
                </p>
                <p className="text-gray-600">
                    When user input or code examples need to be displayed on a web page, encoding ensures that the browser interprets them as text rather than executable HTML or JavaScript. Our tool makes it easy to encode and decode HTML entities instantly and includes a reference of common HTML entities.
                </p>
            </section>

            <HtmlEncoder />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Use HTML Encoding?
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Security (XSS Prevention):</strong> Encoding user input prevents malicious scripts from being executed in the browser, protecting against cross-site scripting attacks</li>
                    <li><strong>Display Code Examples:</strong> When showing HTML or XML code on a webpage, encoding ensures the code is displayed as text rather than rendered as HTML</li>
                    <li><strong>Special Character Display:</strong> Show reserved HTML characters like {"<"}, {">"}, and &amp; correctly in your content without breaking the HTML structure</li>
                    <li><strong>Data Sanitization:</strong> Clean user-submitted data before storing it in databases or displaying it on web pages</li>
                    <li><strong>Email Templates:</strong> Ensure email content displays correctly across different email clients by encoding special characters</li>
                    <li><strong>XML/RSS Feeds:</strong> Properly encode content for XML-based formats where special characters have specific meanings</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
