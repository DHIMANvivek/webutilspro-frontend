import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import Minifier from '@/components/tools/Minifier';

export const metadata = genMeta({
    title: 'Free JS/CSS/HTML Minifier - Minify Code Online',
    description: 'Minify JavaScript, CSS, and HTML code online. Reduce file size and improve page load speed. Free code minification tool.',
    keywords: ['minify javascript', 'minify css', 'minify html', 'code minifier', 'compress code'],
    canonical: '/tools/minifier',
});

const relatedTools = [
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'JSON Validator', href: '/tools/json-validator' },
    { name: 'Diff Checker', href: '/tools/diff-checker' },
];

export default function MinifierPage() {
    return (
        <ToolLayout
            title="Code Minifier"
            description="Minify JavaScript, CSS, and HTML to reduce file size and improve website performance."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is Code Minification?
                </h2>
                <p className="text-gray-600 mb-4">
                    Code minification is the process of removing all unnecessary characters from source code without changing its functionality. This includes removing whitespace, line breaks, comments, and shortening variable names. Minified code takes up less space and downloads faster, improving website performance and user experience.
                </p>
                <p className="text-gray-600">
                    Our minifier processes your JavaScript, CSS, and HTML files to create production-ready versions that load faster. The tool also includes a beautify option to reverse the process and make minified code readable again. Always keep your original source files for development and use minified versions only in production.
                </p>
            </section>

            <Minifier />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Benefits of Code Minification
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Faster Page Load Times:</strong> Smaller file sizes mean less data to download, resulting in faster page loads and better user experience</li>
                    <li><strong>Reduced Bandwidth:</strong> Minified files consume less bandwidth, saving costs for high-traffic websites and improving mobile experience</li>
                    <li><strong>Better SEO Rankings:</strong> Google considers page speed as a ranking factor - faster sites rank higher in search results</li>
                    <li><strong>Improved Performance:</strong> Less code to parse means faster JavaScript execution and CSS rendering</li>
                    <li><strong>Production Optimization:</strong> Industry standard practice for deploying production code in professional web development</li>
                    <li><strong>Clean Deployment:</strong> Remove development comments and debug code from your production environment</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
