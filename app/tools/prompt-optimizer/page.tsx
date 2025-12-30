import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import PromptOptimizer from '@/components/tools/PromptOptimizer';
import AdPlacement from '@/components/AdPlacement';

export const metadata = genMeta({
    title: 'Free AI Prompt Optimizer - Improve Your AI Prompts',
    description: 'Optimize your AI prompts for better results with our free prompt optimizer. Get suggestions, improvements, and tips for crafting effective AI prompts. Perfect for ChatGPT, Claude, and more.',
    keywords: ['prompt optimizer', 'ai prompts', 'chatgpt prompts', 'prompt engineering', 'ai prompt tips', 'better prompts'],
    canonical: '/tools/prompt-optimizer',
});

const relatedTools = [
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
    { name: 'Markdown → HTML', href: '/tools/markdown-to-html' },
    { name: 'Regex Tester', href: '/tools/regex-tester' },
];

const faqs = [
    {
        question: 'What is prompt optimization?',
        answer: 'Prompt optimization is the process of refining your instructions to AI models to get better, more accurate, and more useful responses. A well-optimized prompt is clear, specific, provides context, and guides the AI toward the desired output format and tone.',
    },
    {
        question: 'Why do I need to optimize my prompts?',
        answer: 'Optimized prompts lead to significantly better AI responses. They help the AI understand your intent, reduce ambiguity, provide necessary context, and specify the format you want. This saves time by getting the right answer on the first try instead of multiple iterations.',
    },
    {
        question: 'What AI models does this work with?',
        answer: 'The optimization principles apply to all major AI models including ChatGPT (GPT-3.5 and GPT-4), Claude, Google Bard, and other large language models. Better prompts universally improve AI outputs across different platforms.',
    },
    {
        question: 'Is there a limit on optimizations?',
        answer: 'Yes, there is a limit of 10 prompt optimizations per day per IP address to ensure fair access for all users. This limit resets every 24 hours.',
    },
    {
        question: 'Will you save my prompts?',
        answer: 'No, we do not permanently store your prompts. They are processed temporarily to generate optimizations and then discarded. Your prompts remain private and secure.',
    },
];

export default function PromptOptimizerPage() {
    const toolSchema = generateToolSchema({
        name: 'AI Prompt Optimizer',
        description: 'Optimize your AI prompts for better, more accurate responses',
        url: '/tools/prompt-optimizer',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="Prompt Optimizer"
            description="Transform basic prompts into optimized instructions that get better AI responses. Get instant suggestions and improvements."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            {/* What is This Tool Section */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the Prompt Optimizer?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>
                        The <strong>AI Prompt Optimizer</strong> is a powerful tool that helps you craft better prompts
                        for AI language models like ChatGPT, Claude, Google Bard, and others. Good prompts are the key
                        to getting useful AI responses, but writing effective prompts requires understanding prompt
                        engineering principles. Our tool does this for you automatically.
                    </p>
                    <p>
                        Simply paste your basic prompt, select your use case, and our AI will analyze it and provide an
                        improved version. The optimized prompt includes better structure, clearer instructions, relevant
                        context, and specific output formatting requests. You'll also see detailed explanations of what
                        was improved and why.
                    </p>
                    <p>
                        Whether you're using AI for coding, writing, analysis, brainstorming, or any other task, optimized
                        prompts dramatically improve the quality of responses you receive. Learn prompt engineering best
                        practices while getting instant improvements to your prompts. The tool is perfect for beginners
                        learning to work with AI and experienced users looking to refine their prompting skills.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <PromptOptimizer />

            {/* How to Use Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the Prompt Optimizer
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Select Your Use Case:</strong> Choose the category that best matches what you want to
                            use AI for (coding, writing, creative, analysis, etc.). This helps tailor the optimization.
                        </li>
                        <li>
                            <strong>Enter Your Prompt:</strong> Type or paste the prompt you want to optimize. Don't worry
                            if it's basic—that's what the tool is for! Click "Load Example" to see a sample if needed.
                        </li>
                        <li>
                            <strong>Get Optimization:</strong> Click "Optimize Prompt" and our AI will analyze your input
                            and generate an improved version with better structure and clarity.
                        </li>
                        <li>
                            <strong>Review Improvements:</strong> Examine the optimized prompt and read through the
                            explanations of what was changed and why each improvement matters.
                        </li>
                        <li>
                            <strong>Copy and Use:</strong> Click the copy button to copy the optimized prompt, then paste
                            it into your AI tool of choice. Compare the results with your original prompt!
                        </li>
                        <li>
                            <strong>Learn from Tips:</strong> Read the prompt engineering tips provided to understand how
                            to write better prompts on your own in the future.
                        </li>
                    </ol>
                </div>
            </section>

            {/* AdSense Placement */}
            <AdPlacement />

            {/* Prompt Engineering Principles */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Prompt Engineering Principles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Be Specific</h3>
                        <p className="text-sm text-gray-600">
                            Clear, detailed prompts get better results. Specify exactly what you want, including format,
                            length, style, and any constraints.
                        </p>
                    </div>
                    <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Provide Context</h3>
                        <p className="text-sm text-gray-600">
                            Give the AI background information. Explain your goal, audience, and any relevant details
                            that help it understand your needs.
                        </p>
                    </div>
                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Use Examples</h3>
                        <p className="text-sm text-gray-600">
                            Show the AI what you want with examples. "Like this" is often clearer than trying to describe
                            the desired format in words.
                        </p>
                    </div>
                    <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Assign a Role</h3>
                        <p className="text-sm text-gray-600">
                            Tell the AI to act as an expert in a field. "You are an experienced software engineer" helps
                            frame the response appropriately.
                        </p>
                    </div>
                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Break Down Complex Tasks</h3>
                        <p className="text-sm text-gray-600">
                            For complicated requests, break them into steps. Ask the AI to think step-by-step or tackle
                            one part at a time.
                        </p>
                    </div>
                    <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Iterate and Refine</h3>
                        <p className="text-sm text-gray-600">
                            Don't expect perfection on the first try. Review the output and refine your prompt based on
                            what's missing or incorrect.
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

            {/* Examples Section */}
            <section className="card mt-8 bg-green-50 border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Before & After Examples</h2>
                <div className="space-y-6">
                    <div>
                        <div className="bg-white rounded-lg p-4 mb-2">
                            <p className="text-xs font-semibold text-red-600 uppercase mb-2">Before (Vague)</p>
                            <p className="text-gray-700">"Write some code"</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-xs font-semibold text-green-600 uppercase mb-2">After (Optimized)</p>
                            <p className="text-gray-700">
                                "Write a Python function called `calculate_average` that takes a list of numbers as input
                                and returns their average. Include error handling for empty lists and non-numeric values.
                                Add docstring documentation and example usage."
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg p-4 mb-2">
                            <p className="text-xs font-semibold text-red-600 uppercase mb-2">Before (Vague)</p>
                            <p className="text-gray-700">"Explain AI"</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-xs font-semibold text-green-600 uppercase mb-2">After (Optimized)</p>
                            <p className="text-gray-700">
                                "Explain artificial intelligence to a 10-year-old using simple language and everyday
                                examples. Cover what AI is, how it learns, and 3-4 real-world applications they might
                                encounter. Keep it under 200 words and make it engaging."
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </ToolLayout>
    );
}
