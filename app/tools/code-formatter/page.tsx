import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import CodeFormatter from '@/components/tools/CodeFormatter';

export const metadata = genMeta({
    title: 'Free Code Formatter - Format JS, HTML, CSS, JSON, SQL Online',
    description: 'Format and beautify your code instantly. Supports JavaScript, HTML, CSS, JSON, and SQL. Free online code formatter with syntax highlighting.',
    keywords: ['code formatter', 'beautify code', 'js formatter', 'html formatter', 'css formatter', 'json formatter', 'sql formatter'],
    canonical: '/tools/code-formatter',
});

const relatedTools = [
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
    { name: 'Regex Tester', href: '/tools/regex-tester' },
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
];

export default function CodeFormatterPage() {
    return (
        <ToolLayout
            title="Code Formatter"
            description="Beautify and format your code with support for JavaScript, HTML, CSS, JSON, and SQL."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the Code Formatter?
                </h2>
                <p className="text-gray-600 mb-4">
                    The Code Formatter is a free online tool that beautifies and formats your code automatically. Whether you're working with minified JavaScript, messy HTML, or compact JSON, our formatter adds proper indentation, line breaks, and spacing to make your code readable and maintainable.
                </p>
                <p className="text-gray-600">
                    Supporting multiple languages including JavaScript, HTML, CSS, JSON, and SQL, this tool is perfect for developers who need to quickly clean up code from various sources. All formatting happens in your browser, so your code stays private and secure.
                </p>
            </section>

            <CodeFormatter />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Format Your Code?
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Improve code readability and maintainability</li>
                    <li>Follow consistent coding style across your project</li>
                    <li>Debug minified code more easily</li>
                    <li>Prepare code for code reviews and collaboration</li>
                    <li>Learn proper code structure and indentation</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
