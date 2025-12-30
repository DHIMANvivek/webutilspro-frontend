import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import JsonValidator from '@/components/tools/JsonValidator';

export const metadata = genMeta({
    title: 'Free JSON Validator & Formatter - Validate JSON Online',
    description: 'Validate, format, and minify JSON data. Find errors with line numbers. Free online JSON validator and formatter tool.',
    keywords: ['json validator', 'json formatter', 'validate json', 'format json', 'json beautifier', 'json minifier'],
    canonical: '/tools/json-validator',
});

const relatedTools = [
    { name: 'JSON ↔ CSV', href: '/tools/json-to-csv' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'Diff Checker', href: '/tools/diff-checker' },
];

export default function JsonValidatorPage() {
    return (
        <ToolLayout
            title="JSON Validator & Formatter"
            description="Validate JSON syntax, format with proper indentation, and minify for production. Get detailed error messages with line numbers."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is a JSON Validator?
                </h2>
                <p className="text-gray-600 mb-4">
                    A JSON validator is a tool that checks if your JSON (JavaScript Object Notation) data is properly formatted according to the JSON specification. It identifies syntax errors like missing commas, mismatched brackets, unquoted keys, or trailing commas, and shows you exactly where the error occurs with line numbers and detailed error messages.
                </p>
                <p className="text-gray-600">
                    Our JSON validator not only validates your JSON but also formats it with proper indentation for readability and can minify it for production use. It calculates useful statistics like file size, line count, and nesting depth, helping you optimize your JSON data for APIs, configuration files, and data storage.
                </p>
            </section>

            <JsonValidator />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    When to Use a JSON Validator
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>API Development:</strong> Validate API request and response payloads to ensure they conform to the expected JSON structure</li>
                    <li><strong>Configuration Files:</strong> Check configuration files for applications, build tools, and frameworks that use JSON format</li>
                    <li><strong>Data Import/Export:</strong> Verify JSON data before importing into databases or exporting to external systems</li>
                    <li><strong>Debugging:</strong> Find and fix syntax errors in JSON data that cause parsing failures in applications</li>
                    <li><strong>Learning JSON:</strong> Understand JSON syntax rules by testing examples and seeing what causes errors</li>
                    <li><strong>Code Review:</strong> Ensure JSON files in version control are properly formatted and error-free</li>
                    <li><strong>Data Transformation:</strong> Validate JSON before and after transformation operations to ensure data integrity</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
