import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import DiffChecker from '@/components/tools/DiffChecker';

export const metadata = genMeta({
    title: 'Free Text Diff Checker - Compare Files & Code Online',
    description: 'Compare two text files and highlight differences line-by-line. Side-by-side and unified diff views. Free online diff checker tool.',
    keywords: ['diff checker', 'text compare', 'file comparison', 'code diff', 'text difference', 'compare text'],
    canonical: '/tools/diff-checker',
});

const relatedTools = [
    { name: 'Text Tools', href: '/tools/text-tools' },
    { name: 'JSON Validator', href: '/tools/json-validator' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
];

export default function DiffCheckerPage() {
    return (
        <ToolLayout
            title="Text Diff Checker"
            description="Compare two text files and find differences instantly. Perfect for code reviews, document comparison, and version tracking."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is a Diff Checker?
                </h2>
                <p className="text-gray-600 mb-4">
                    A diff checker (or difference checker) is a tool that compares two versions of text and highlights the differences between them. It shows what has been added, removed, or changed, making it easy to track changes in documents, source code, configuration files, and more.
                </p>
                <p className="text-gray-600">
                    Our diff checker provides both unified and side-by-side views, supports line-by-line, word-by-word, and character-by-character comparison modes, and offers options to ignore whitespace and case differences for more flexible comparisons.
                </p>
            </section>

            <DiffChecker />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Common Use Cases for Diff Checkers
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Code Reviews:</strong> Compare code changes before and after modifications to review what developers have changed</li>
                    <li><strong>Document Versioning:</strong> Track changes between different versions of contracts, articles, or documentation</li>
                    <li><strong>Debugging:</strong> Compare configuration files or logs to identify what changed when an issue occurred</li>
                    <li><strong>Plagiarism Detection:</strong> Compare two documents to find similarities and differences</li>
                    <li><strong>Data Migration:</strong> Verify that data was correctly transformed during migration processes</li>
                    <li><strong>Translation Review:</strong> Compare original and translated texts to ensure accuracy</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
