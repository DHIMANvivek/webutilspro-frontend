import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import AiErrorExplainer from '@/components/tools/AiErrorExplainer';


export const metadata = genMeta({
    title: 'Free AI Error Explainer - Debug Code Errors with AI',
    description: 'Get AI-powered explanations for programming errors. Paste your error message and get instant explanations, solutions, and prevention tips. Supports all programming languages.',
    keywords: ['ai error explainer', 'debug errors', 'error analysis', 'programming errors', 'code debugging', 'ai debugging'],
    canonical: '/tools/ai-error-explainer',
});

const relatedTools = [
    { name: 'Regex Tester', href: '/tools/regex-tester' },
    { name: 'Prompt Optimizer', href: '/tools/prompt-optimizer' },
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
];

const faqs = [
    {
        question: 'How does the AI Error Explainer work?',
        answer: 'Simply paste your error message or stack trace, select your programming language, and click Analyze. Our AI processes the error and provides a detailed explanation, possible causes, step-by-step solutions, and tips to prevent similar errors in the future.',
    },
    {
        question: 'What programming languages are supported?',
        answer: 'The AI Error Explainer supports all major programming languages including JavaScript, Python, Java, C#, PHP, Ruby, Go, Rust, TypeScript, and more. The AI can understand and explain errors from any language.',
    },
    {
        question: 'Is there a limit on how many errors I can analyze?',
        answer: 'Yes, to ensure fair access for all users, there is a limit of 10 requests per day per IP address. This limit resets every 24 hours.',
    },
    {
        question: 'Is my code safe when using this tool?',
        answer: 'Yes! We only process the error message you provide, not your entire codebase. The error messages are sent securely to our server, analyzed, and not permanently stored. Your actual code remains private.',
    },
    {
        question: 'What if the AI explanation doesn\'t solve my problem?',
        answer: 'While our AI provides highly accurate explanations based on common error patterns, some complex or context-specific errors may require additional debugging. Use the explanation as a starting point and apply your understanding of your specific codebase.',
    },
];

export default function AiErrorExplainerPage() {
    const toolSchema = generateToolSchema({
        name: 'AI Error Explainer',
        description: 'Get AI-powered explanations and solutions for programming errors',
        url: '/tools/ai-error-explainer',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="AI Error Explainer"
            description="Get instant, AI-powered explanations for programming errors. Understand what went wrong and how to fix it."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            {/* What is This Tool Section */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the AI Error Explainer?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>
                        The <strong>AI Error Explainer</strong> is an intelligent debugging assistant that helps developers
                        understand and fix programming errors quickly. When you encounter an error message or exception
                        that you don't understand, simply paste it into our tool along with the programming language,
                        and our AI will provide a comprehensive explanation.
                    </p>
                    <p>
                        Unlike traditional debugging where you might spend hours searching Stack Overflow or documentation,
                        our AI analyzes your specific error and provides targeted solutions. It explains what the error
                        means in plain language, identifies possible causes, offers step-by-step fix instructions, and
                        provides code examples when applicable.
                    </p>
                    <p>
                        The tool supports all major programming languages and frameworks. Whether you're dealing with
                        JavaScript TypeError, Python ImportError, Java NullPointerException, or any other error, our AI
                        has been trained on millions of error patterns to give you accurate, actionable guidance. It's
                        like having an experienced developer explain the error to you, but available 24/7.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <AiErrorExplainer />

            {/* How to Use Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the AI Error Explainer
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Select Your Language:</strong> Choose the programming language you're working with from
                            the dropdown. This helps the AI provide more accurate, language-specific guidance.
                        </li>
                        <li>
                            <strong>Paste Your Error:</strong> Copy the error message from your console, terminal, or IDE
                            and paste it into the text area. Include the full stack trace if available for better analysis.
                        </li>
                        <li>
                            <strong>Get AI Analysis:</strong> Click the "Explain Error" button. Our AI will process the
                            error and generate a comprehensive explanation in seconds.
                        </li>
                        <li>
                            <strong>Review the Explanation:</strong> Read through the AI's analysis, which includes what
                            the error means, why it occurred, and how to fix it. Code examples are provided when relevant.
                        </li>
                        <li>
                            <strong>Implement the Solution:</strong> Follow the step-by-step fix instructions to resolve
                            your error. Apply the prevention tips to avoid similar issues in the future.
                        </li>
                    </ol>
                </div>
            </section>

            {/* AdSense Placement */}


            {/* Common Error Types */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Error Types We Handle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Syntax Errors</h3>
                        <p className="text-sm text-gray-600">
                            Missing brackets, semicolons, or incorrect syntax that prevents code from running.
                        </p>
                    </div>
                    <div className="border-l-4 border-secondary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Type Errors</h3>
                        <p className="text-sm text-gray-600">
                            Operations on incompatible data types or accessing undefined properties.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Runtime Errors</h3>
                        <p className="text-sm text-gray-600">
                            Null reference exceptions, array out of bounds, division by zero, etc.
                        </p>
                    </div>
                    <div className="border-l-4 border-secondary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Import/Module Errors</h3>
                        <p className="text-sm text-gray-600">
                            Missing dependencies, incorrect import statements, or module not found errors.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Logic Errors</h3>
                        <p className="text-sm text-gray-600">
                            Code runs but produces incorrect results due to flawed logic or algorithms.
                        </p>
                    </div>
                    <div className="border-l-4 border-secondary-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Async/Promise Errors</h3>
                        <p className="text-sm text-gray-600">
                            Unhandled promise rejections or issues with asynchronous code execution.
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
            <section className="card mt-8 bg-blue-50 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices for Error Debugging</h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Include full stack traces:</strong> The more context you provide, the better the
                            AI can understand and explain the error.</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Read the entire explanation:</strong> Don't just jump to the solution. Understanding
                            the cause helps prevent future occurences.</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Apply prevention tips:</strong> Use the AI's prevention suggestions to improve
                            your coding practices and avoid similar errors.</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Test the fix:</strong> After implementing the suggested solution, test thoroughly
                            to ensure the error is resolved and no new issues arise.</span>
                    </li>
                </ul>
            </section>
        </ToolLayout>
    );
}
