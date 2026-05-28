import dynamic from 'next/dynamic';
import { generateFAQSchema, generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';

const JavaScriptCompiler = dynamic(() => import('@/components/tools/JavaScriptCompiler'), {
    ssr: false,
    loading: () => <div className="text-center py-12">Loading JavaScript compiler...</div>,
});

export const metadata = genMeta({
    title: 'Free Online JavaScript Compiler with Debugger',
    description: 'Run, test, and debug JavaScript online with console output, syntax checking, runtime errors, return values, debug traces, and a browser-based sandbox.',
    keywords: [
        'javascript compiler',
        'online javascript compiler',
        'javascript debugger online',
        'run javascript online',
        'js compiler',
        'javascript playground',
        'online js editor',
        'debug javascript code',
        'javascript syntax checker',
    ],
    canonical: '/tools/javascript-compiler',
});

const relatedTools = [
    { name: 'Code Formatter', href: '/tools/code-formatter' },
    { name: 'JSON Validator', href: '/tools/json-validator' },
    { name: 'Regex Tester', href: '/tools/regex-tester' },
];

const faqs = [
    {
        question: 'What is an online JavaScript compiler?',
        answer: 'An online JavaScript compiler lets you write and execute JavaScript code directly in the browser without setting up Node.js, npm, or a local editor. It is useful for testing snippets, learning syntax, debugging logic, and sharing small examples.',
    },
    {
        question: 'Does this JavaScript compiler include a debugger?',
        answer: 'Yes. The debugger mode supports trace helpers, checkpoints, console capture, syntax checks, runtime errors, return values, and timeout protection. It is designed for debugging JavaScript logic and data transformations.',
    },
    {
        question: 'Is my JavaScript code sent to a server?',
        answer: 'No. The compiler runs your code inside a browser Web Worker. Your snippets stay in your browser and are not uploaded to WebUtilsPro servers.',
    },
    {
        question: 'Can I run DOM or browser API code?',
        answer: 'This tool is optimized for JavaScript logic, arrays, objects, functions, promises, and algorithms. DOM-specific code is intentionally limited because execution happens in a sandboxed worker environment.',
    },
];

export default function JavaScriptCompilerPage() {
    const toolSchema = generateToolSchema({
        name: 'Free Online JavaScript Compiler with Debugger',
        description: 'Run and debug JavaScript online with console output, syntax checks, and browser-based sandbox execution.',
        url: '/tools/javascript-compiler',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="JavaScript Compiler"
            description="Run, test, and debug JavaScript online with console output, syntax validation, runtime errors, return values, and debug traces."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Online JavaScript Compiler Built for Real Debugging
                </h2>
                <p className="text-gray-600 mb-4">
                    This free online JavaScript compiler helps you run JavaScript snippets instantly without installing Node.js,
                    opening a terminal, or creating a local project. It is built for developers, students, interview preparation,
                    and anyone who wants to quickly test JavaScript logic in a clean browser-based environment.
                </p>
                <p className="text-gray-600">
                    Unlike simple code runners, this JavaScript playground includes syntax checking, captured console output,
                    returned values, runtime error reporting, timeout protection, and a debug mode with trace helpers. It is
                    especially useful for testing array methods, object transformations, async functions, algorithms, and small
                    utility functions.
                </p>
            </section>

            <JavaScriptCompiler />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the JavaScript Compiler
                </h2>
                <ol className="list-decimal pl-6 space-y-3 text-gray-600">
                    <li><strong>Paste or write JavaScript:</strong> Add your JavaScript code in the editor. You can include variables, functions, classes, arrays, objects, promises, and return statements.</li>
                    <li><strong>Check syntax:</strong> Use the syntax checker to catch missing brackets, invalid tokens, or parsing errors before execution.</li>
                    <li><strong>Run code:</strong> Execute your code in a browser Web Worker and inspect console logs, warnings, errors, and returned values.</li>
                    <li><strong>Debug logic:</strong> Use debug mode with <code>__webutilsDebug.trace('label', value)</code> to print intermediate values while your code runs.</li>
                    <li><strong>Review output:</strong> Copy console output, adjust timeout settings, and iterate until your snippet behaves correctly.</li>
                </ol>
            </section>

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Best Use Cases for an Online JS Compiler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-600">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Learning JavaScript</h3>
                        <p>Practice variables, functions, loops, closures, array methods, promises, async/await, and modern ES syntax without setup friction.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Debugging Snippets</h3>
                        <p>Test small code blocks before adding them to production projects. Use console output and debug traces to inspect each transformation.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Interview Practice</h3>
                        <p>Solve algorithm challenges, array/object tasks, and logic questions in a fast online playground with clear runtime feedback.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">AI Code Validation</h3>
                        <p>Paste JavaScript generated by AI tools, run syntax checks, and verify behavior before trusting it in a real application.</p>
                    </div>
                </div>
            </section>

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq) => (
                        <div key={faq.question} className="border-b border-gray-200 pb-6 last:border-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </ToolLayout>
    );
}
