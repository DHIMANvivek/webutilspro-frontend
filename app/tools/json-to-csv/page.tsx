import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import JsonCsvConverter from '@/components/tools/JsonCsvConverter';


export const metadata = genMeta({
    title: 'Free JSON to CSV Converter - Convert JSON ↔ CSV Online',
    description: 'Convert between JSON and CSV formats instantly with our free online converter. Bidirectional conversion, validation, download, and copy features. Perfect for developers and data analysts.',
    keywords: ['json to csv', 'csv to json', 'json converter', 'csv converter', 'data conversion', 'json parser', 'csv parser'],
    canonical: '/tools/json-to-csv',
});

const relatedTools = [
    { name: 'Regex Tester', href: '/tools/regex-tester' },
    { name: 'Markdown → HTML', href: '/tools/markdown-to-html' },
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
];

const faqs = [
    {
        question: 'What is JSON and when should I use it?',
        answer: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that\'s easy for humans to read and write, and easy for machines to parse and generate. Use JSON for APIs, configuration files, and data storage where hierarchical structure is important.',
    },
    {
        question: 'What is CSV and when should I use it?',
        answer: 'CSV (Comma-Separated Values) is a simple file format for tabular data. Use CSV when you need to work with spreadsheet applications like Excel, import data into databases, or share data in a universally compatible format.',
    },
    {
        question: 'How do I convert JSON to CSV?',
        answer: 'Paste your JSON data (must be an array of objects or a single object) into the input field, select "JSON → CSV" mode, and click Convert. The tool will generate a CSV with headers from your JSON keys. You can then copy or download the result.',
    },
    {
        question: 'Can I convert CSV back to JSON?',
        answer: 'Yes! Switch to "CSV → JSON" mode, paste your CSV data (with headers in the first row), and click Convert. The tool will create a JSON array of objects where each row becomes an object with keys from the header row.',
    },
    {
        question: 'Is my data safe when using this converter?',
        answer: 'Absolutely! All conversion happens entirely in your browser. Your data never gets sent to our servers or anywhere else, ensuring complete privacy and security of your information.',
    },
];

export default function JsonCsvConverterPage() {
    const toolSchema = generateToolSchema({
        name: 'Free JSON to CSV Converter',
        description: 'Convert between JSON and CSV formats instantly with bidirectional conversion',
        url: '/tools/json-to-csv',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="JSON ↔ CSV Converter"
            description="Convert between JSON and CSV formats instantly with our free bidirectional converter. Download, copy, and validate your data."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            {/* What is This Tool Section */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the JSON ↔ CSV Converter?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>
                        Our <strong>Free JSON to CSV Converter</strong> is a powerful, bidirectional data conversion
                        tool designed for developers, data analysts, and anyone working with structured data. Whether
                        you need to transform JSON APIs into spreadsheet-friendly CSV or convert CSV exports into
                        JSON for programmatic access, this tool handles both directions seamlessly.
                    </p>
                    <p>
                        The converter runs entirely in your browser, ensuring your sensitive data remains private
                        and never leaves your device. With support for complex data structures, proper CSV escaping
                        for special characters, and instant validation, you can confidently convert data between
                        these two popular formats.
                    </p>
                    <p>
                        Key features include one-click downloading of converted files, clipboard copying for easy
                        pasting into other applications, and example data loading to help you understand the expected
                        format. The tool intelligently handles edge cases like commas within values, quoted strings,
                        and nested structures, making data transformation effortless.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <JsonCsvConverter />

            {/* How to Use Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the JSON ↔ CSV Converter
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Converting JSON to CSV</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Select JSON → CSV Mode:</strong> Click the "JSON → CSV" button at the top of the
                            converter to set the conversion direction.
                        </li>
                        <li>
                            <strong>Input Your JSON:</strong> Paste your JSON data into the input field. For best results,
                            use an array of objects where each object has the same keys. You can click "Load Example" to
                            see a sample format.
                        </li>
                        <li>
                            <strong>Convert:</strong> Click the "Convert to CSV" button. The tool will validate your JSON
                            and generate a CSV with headers from your object keys.
                        </li>
                        <li>
                            <strong>Use the Result:</strong> Copy the output to your clipboard or download it as a .csv
                            file using the provided buttons.
                        </li>
                    </ol>

                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Converting CSV to JSON</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Select CSV → JSON Mode:</strong> Click the "CSV → JSON" button to switch the
                            conversion direction.
                        </li>
                        <li>
                            <strong>Input Your CSV:</strong> Paste your CSV data. Ensure the first row contains headers
                            that will become the JSON object keys. Click "Load Example" for a sample.
                        </li>
                        <li>
                            <strong>Convert:</strong> Click the "Convert to JSON" button. The tool will parse your CSV
                            and create a JSON array of objects.
                        </li>
                        <li>
                            <strong>Use the Result:</strong> Copy the formatted JSON or download it as a .json file.
                        </li>
                    </ol>
                </div>
            </section>

            {/* AdSense Placement */}


            {/* Use Cases Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">API to Spreadsheet</h3>
                        <p className="text-gray-600">
                            Export JSON data from APIs into CSV format for easy viewing and analysis in Excel,
                            Google Sheets, or other spreadsheet applications.
                        </p>
                    </div>
                    <div className="border-l-4 border-secondary-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Migration</h3>
                        <p className="text-gray-600">
                            Convert CSV exports from databases or legacy systems into JSON for import into modern
                            applications, NoSQL databases, or APIs.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Generation</h3>
                        <p className="text-gray-600">
                            Transform JSON analytics data into CSV for creating reports, charts, and presentations
                            in business intelligence tools.
                        </p>
                    </div>
                    <div className="border-l-4 border-secondary-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing</h3>
                        <p className="text-gray-600">
                            Convert between formats for data cleaning, transformation pipelines, or integration
                            with different data processing tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {faq.question}
                            </h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Practices */}
            <section className="card mt-8 bg-primary-50 border-primary-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices & Tips</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">For JSON to CSV:</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Ensure all objects in your array have the same keys for consistent CSV headers</li>
                            <li>Flatten nested objects before conversion for better CSV compatibility</li>
                            <li>Use simple data types (strings, numbers, booleans) rather than complex objects</li>
                            <li>Validate your JSON syntax before conversion to avoid errors</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">For CSV to JSON:</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Always include a header row with column names</li>
                            <li>Avoid special characters in headers for cleaner JSON keys</li>
                            <li>Use quotes around values containing commas or line breaks</li>
                            <li>Ensure consistent number of columns across all rows</li>
                        </ul>
                    </div>
                </div>
            </section>
        </ToolLayout>
    );
}
