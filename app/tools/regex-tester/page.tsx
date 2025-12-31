import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import RegexTester from '@/components/tools/RegexTester';
import AdPlacement from '@/components/AdPlacement';

export const metadata = genMeta({
    title: 'Free Online Regex Tester - Test Regular Expressions',
    description: 'Test and debug regular expressions with our free online regex tester. Real-time matching, syntax highlighting, capture groups, and common patterns library. Perfect for developers.',
    keywords: ['regex tester', 'regular expression tester', 'regex validator', 'pattern matching', 'regex debugger', 'test regex online'],
    canonical: '/tools/regex-tester',
});

const relatedTools = [
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
    { name: 'Markdown → HTML', href: '/tools/markdown-to-html' },
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
];

const faqs = [
    {
        question: 'What is a regular expression (regex)?',
        answer: 'A regular expression (regex) is a sequence of characters that defines a search pattern. It\'s commonly used for pattern matching within strings, data validation, find and replace operations, and text parsing.',
    },
    {
        question: 'What are regex flags and what do they mean?',
        answer: 'Regex flags modify the behavior of the pattern: g (global) finds all matches, i (case insensitive) ignores case, m (multiline) treats ^ and $ as line boundaries, s (dotall) makes . match newlines, u (unicode) enables full unicode support, and y (sticky) matches only from lastIndex.',
    },
    {
        question: 'How do I test my regex pattern?',
        answer: 'Enter your regular expression pattern in the pattern field, select appropriate flags, input your test string, and click "Test Pattern". The tool will highlight all matches and show capture groups if your pattern includes them.',
    },
    {
        question: 'What are capture groups in regex?',
        answer: 'Capture groups are portions of a regex pattern enclosed in parentheses (). They allow you to extract specific parts of matched text. For example, (\\d{3})-(\\d{4}) would capture area code and number separately from a phone number.',
    },
    {
        question: 'Is my data safe when using this regex tester?',
        answer: 'Yes, absolutely! All regex testing happens entirely in your browser. Your patterns and test strings never leave your device or get sent to any server, ensuring complete privacy and security.',
    },
];

export default function RegexTesterPage() {
    const toolSchema = generateToolSchema({
        name: 'Free Online Regex Tester',
        description: 'Test and debug regular expressions with real-time matching and highlighting',
        url: '/tools/regex-tester',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="Regex Tester"
            description="Test and debug regular expressions with real-time matching, syntax highlighting, and capture group analysis."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            {/* What is This Tool Section */}
            <section className="card mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the Regex Tester?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>
                        Our <strong>Free Online Regex Tester</strong> is a powerful tool designed for developers,
                        data analysts, and anyone working with text patterns. Regular expressions (regex) are
                        essential for pattern matching, data validation, and text processing, but they can be
                        tricky to get right. This tool provides instant visual feedback to help you write and
                        debug regex patterns efficiently.
                    </p>
                    <p>
                        The regex tester runs entirely in your browser, ensuring your sensitive data never leaves
                        your device. Whether you're validating email addresses, parsing log files, extracting data
                        from text, or building complex search patterns, our tool makes regex development fast and
                        intuitive.
                    </p>
                    <p>
                        With features like real-time match highlighting, capture group display, and a library of
                        common patterns, you can quickly test and refine your regular expressions. The tool
                        supports all standard regex flags including global, case-insensitive, multiline, and unicode
                        matching.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <RegexTester />

            {/* How to Use Section */}
            <section className="card mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the Regex Tester
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Enter Your Pattern:</strong> Type your regular expression pattern in the pattern
                            field. You can write it from scratch or click one of the common patterns to load a
                            pre-built example.
                        </li>
                        <li>
                            <strong>Select Flags:</strong> Choose appropriate flags for your pattern. Enable the "g"
                            (global) flag to find all matches, "i" for case-insensitive matching, "m" for multiline
                            mode, or any combination that suits your needs.
                        </li>
                        <li>
                            <strong>Add Test String:</strong> Input the text you want to test your pattern against.
                            This can be a single line or multiple lines of text.
                        </li>
                        <li>
                            <strong>Test Pattern:</strong> Click the "Test Pattern" button to execute the regex
                            against your test string. The tool will instantly show all matches with highlighting.
                        </li>
                        <li>
                            <strong>Review Results:</strong> Examine the highlighted matches in your test string.
                            The tool displays match count, positions, and capture groups if your pattern includes them.
                        </li>
                        <li>
                            <strong>Refine and Iterate:</strong> Adjust your pattern based on the results and test
                            again. The instant feedback loop helps you quickly perfect your regex.
                        </li>
                    </ol>
                </div>
            </section>

            {/* AdSense Placement */}
            <AdPlacement />

            {/* Examples Section */}
            <section className="card mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases & Examples</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Email Validation</h3>
                    <p>
                        <strong>Pattern:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}$
                        </code>
                    </p>
                    <p>
                        This pattern validates email addresses, ensuring they have the proper format with a local
                        part, @ symbol, domain, and top-level domain.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">URL Extraction</h3>
                    <p>
                        <strong>Pattern:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}(/.*)?
                        </code>
                    </p>
                    <p>
                        Use this to find HTTP or HTTPS URLs in text. The pattern matches the protocol, domain,
                        and optional path.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Phone Number Formatting</h3>
                    <p>
                        <strong>Pattern:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            ^(\+1)?[-.\s]?\(?\d{'{3}'}\)?[-.\s]?\d{'{3}'}[-.\s]?\d{'{4}'}$
                        </code>
                    </p>
                    <p>
                        This validates US phone numbers in various formats: (123) 456-7890, 123-456-7890,
                        123.456.7890, or with +1 country code.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Date Extraction</h3>
                    <p>
                        <strong>Pattern:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            ^\d{'{4}'}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$
                        </code>
                    </p>
                    <p>
                        Match dates in YYYY-MM-DD format, ensuring valid month and day ranges.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="card mb-12">
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

            {/* Tips Section */}
            <section className="relative rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-primary-50/50 to-white border-2 border-primary-100/80 shadow-xl shadow-primary-500/10 mb-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-inner">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Pro Tips for Regex Success</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <li className="flex items-start p-4 rounded-2xl hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5 bg-primary-100/50 rounded-full flex items-center justify-center p-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span><strong className="text-gray-900 block mb-1">Start simple</strong> Begin with basic patterns and gradually add complexity. Test each addition to ensure it works as expected.</span>
                    </li>
                    <li className="flex items-start p-4 rounded-2xl hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5 bg-primary-100/50 rounded-full flex items-center justify-center p-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span><strong className="text-gray-900 block mb-1">Use capture groups wisely</strong> Parentheses create capture groups that extract matched portions. Use non-capturing groups (?:...) when you don't need extraction.</span>
                    </li>
                    <li className="flex items-start p-4 rounded-2xl hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5 bg-primary-100/50 rounded-full flex items-center justify-center p-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span><strong className="text-gray-900 block mb-1">Escape special characters</strong> Characters like ., *, +, ?, etc. have special meanings. Use backslash (\) to match them literally.</span>
                    </li>
                    <li className="flex items-start p-4 rounded-2xl hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 mt-0.5 bg-primary-100/50 rounded-full flex items-center justify-center p-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span><strong className="text-gray-900 block mb-1">Test with edge cases</strong> Try your pattern with unusual inputs, empty strings, and boundary conditions to ensure robustness.</span>
                    </li>
                </ul>
            </section>
        </ToolLayout>
    );
}
