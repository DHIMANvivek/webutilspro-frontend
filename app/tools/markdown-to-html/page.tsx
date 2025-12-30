import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import MarkdownConverter from '@/components/tools/MarkdownConverter';
import AdPlacement from '@/components/AdPlacement';

export const metadata = genMeta({
    title: 'Free Markdown to HTML Converter - Convert MD to HTML Online',
    description: 'Convert Markdown to HTML instantly with our free online converter. Live preview, syntax highlighting, download HTML files. Perfect for developers and content creators.',
    keywords: ['markdown to html', 'md to html', 'markdown converter', 'html converter', 'markdown parser', 'md converter'],
    canonical: '/tools/markdown-to-html',
});

const relatedTools = [
    { name: 'Regex Tester', href: '/tools/regex-tester' },
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
    { name: 'Prompt Optimizer', href: '/tools/prompt-optimizer' },
];

const faqs = [
    {
        question: 'What is Markdown?',
        answer: 'Markdown is a lightweight markup language that uses plain text formatting syntax to create formatted documents. It\'s widely used for documentation, README files, blog posts, and content management because it\'s easy to read and write.',
    },
    {
        question: 'Why convert Markdown to HTML?',
        answer: 'Converting Markdown to HTML is essential for displaying formatted content on websites, generating documentation, creating email templates, or integrating Markdown content into web applications. HTML is the standard for web content, making this conversion necessary for web publishing.',
    },
    {
        question: 'Does this tool support GitHub Flavored Markdown (GFM)?',
        answer: 'Yes! Our converter supports GitHub Flavored Markdown, including features like tables, task lists, strikethrough text, and automatic URL linking. This makes it perfect for converting GitHub README files and documentation.',
    },
    {
        question: 'Can I download the converted HTML?',
        answer: 'Absolutely! After conversion, you can download a complete HTML file with proper structure and styling, ready to use as a standalone webpage. You can also copy just the HTML code if you need to embed it elsewhere.',
    },
    {
        question: 'Is the preview exactly how it will look on my website?',
        answer: 'The preview shows the semantic structure and formatting of your converted HTML. The final appearance on your website will depend on your site\'s CSS styles. The downloaded HTML file includes basic, professional styling that works well for most use cases.',
    },
];

export default function MarkdownConverterPage() {
    const toolSchema = generateToolSchema({
        name: 'Free Markdown to HTML Converter',
        description: 'Convert Markdown to HTML with live preview and syntax highlighting',
        url: '/tools/markdown-to-html',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="Markdown → HTML Converter"
            description="Convert Markdown to clean, semantic HTML with live preview and instant results. Download complete HTML files or copy code."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            {/* What is This Tool Section */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is the Markdown to HTML Converter?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>
                        Our <strong>Free Markdown to HTML Converter</strong> is a powerful tool that transforms Markdown
                        text into clean, semantic HTML code instantly. Whether you're a developer documenting code, a
                        content creator writing blog posts, or a technical writer building documentation, this tool
                        makes it easy to convert readable Markdown syntax into web-ready HTML.
                    </p>
                    <p>
                        The converter features real time conversion with live preview, so you can see exactly how your
                        formatted content will appear as you type. It supports all standard Markdown syntax including
                        headings, lists, code blocks, links, images, blockquotes, and tables. With GitHub Flavored
                        Markdown (GFM) support, you can even use advanced features like task lists and strikethrough text.
                    </p>
                    <p>
                        All conversion happens locally in your browser, ensuring your content remains private and secure.
                        The tool generates clean, properly structured HTML that's accessible, SEO-friendly, and ready to
                        use. You can download a complete HTML document with professional styling or copy just the HTML
                        code to embed in your existing projects.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <MarkdownConverter />

            {/* How to Use Section */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    How to Use the Markdown to HTML Converter
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Write or Paste Markdown:</strong> Enter your Markdown text in the input field. You can
                            write from scratch or paste existing Markdown content. Click "Load Example" to see sample
                            Markdown syntax.
                        </li>
                        <li>
                            <strong>See Live Preview:</strong> As you type, the preview updates in real-time showing how
                            your formatted content will appear. Switch between "Preview" and "HTML Code" tabs to see the
                            rendered output or the raw HTML.
                        </li>
                        <li>
                            <strong>Review the HTML:</strong> Click the "HTML Code" tab to view the generated HTML. The
                            code is clean, semantic, and ready to use in your projects.
                        </li>
                        <li>
                            <strong>Copy or Download:</strong> Use the "Copy HTML" button to copy the HTML code to your
                            clipboard, or click "Download HTML File" to get a complete, styled HTML document that you can
                            open directly in a browser.
                        </li>
                        <li>
                            <strong>Use in Your Project:</strong> Paste the HTML into your website, blog, documentation,
                            or any web project. The generated HTML is standards-compliant and accessible.
                        </li>
                    </ol>
                </div>
            </section>

            {/* AdSense Placement */}
            <AdPlacement />

            {/* Markdown Syntax Examples */}
            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Markdown Syntax Examples</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Headings & Text</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
                                <div className="text-gray-600"># Main Heading (H1)</div>
                                <div className="text-gray-600">## Sub Heading (H2)</div>
                                <div className="text-gray-600">**Bold text**</div>
                                <div className="text-gray-600">*Italic text*</div>
                                <div className="text-gray-600">~~Strikethrough~~</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lists & Quotes</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
                                <div className="text-gray-600">- Unordered list item</div>
                                <div className="text-gray-600">1. Ordered list item</div>
                                <div className="text-gray-600">&gt; Blockquote text</div>
                                <div className="text-gray-600">- [ ] Task list item</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Code & Links</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
                                <div className="text-gray-600">`inline code`</div>
                                <div className="text-gray-600">```language</div>
                                <div className="text-gray-600">code block</div>
                                <div className="text-gray-600">```</div>
                                <div className="text-gray-600">[Link text](url)</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Images & Tables</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
                                <div className="text-gray-600">![Alt text](image.jpg)</div>
                                <div className="text-gray-600">| Header 1 | Header 2 |</div>
                                <div className="text-gray-600">|----------|----------|</div>
                                <div className="text-gray-600">| Cell 1   | Cell 2   |</div>
                            </div>
                        </div>
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

            {/* Use Cases */}
            <section className="card mt-8 bg-primary-50 border-primary-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfect For...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Documentation</h3>
                            <p className="text-sm text-gray-600">Convert README files and technical documentation to HTML</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Blog Posts</h3>
                            <p className="text-sm text-gray-600">Write in Markdown, publish as HTML for your blog or CMS</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Email Templates</h3>
                            <p className="text-sm text-gray-600">Create formatted email content from Markdown</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Web Development</h3>
                            <p className="text-sm text-gray-600">Generate HTML snippets for your web projects</p>
                        </div>
                    </div>
                </div>
            </section>
        </ToolLayout>
    );
}
