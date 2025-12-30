import Link from 'next/link';

export default function HomePage() {
    const tools = [
        {
            name: 'Regex Tester',
            description: 'Test and debug regular expressions with real-time matching and highlighting.',
            icon: '🔍',
            href: '/tools/regex-tester',
            category: 'Text Processing',
        },
        {
            name: 'JSON ↔ CSV Converter',
            description: 'Convert between JSON and CSV formats instantly with validation.',
            icon: '🔄',
            href: '/tools/json-to-csv',
            category: 'Data Conversion',
        },
        {
            name: 'Markdown → HTML',
            description: 'Convert Markdown to HTML with live preview and syntax highlighting.',
            icon: '📝',
            href: '/tools/markdown-to-html',
            category: 'Content',
        },
        {
            name: 'AI Error Explainer',
            description: 'Get AI-powered explanations and fixes for programming errors.',
            icon: '🤖',
            href: '/tools/ai-error-explainer',
            category: 'AI-Powered',
        },
        {
            name: 'Prompt Optimizer',
            description: 'Optimize your AI prompts for better results and clarity.',
            icon: '✨',
            href: '/tools/prompt-optimizer',
            category: 'AI-Powered',
        },
        {
            name: 'Code Formatter',
            description: 'Beautify JavaScript, HTML, CSS, JSON, and SQL code instantly.',
            icon: '💫',
            href: '/tools/code-formatter',
            category: 'Code Tools',
        },
        {
            name: 'Base64 Encoder/Decoder',
            description: 'Encode and decode Base64 strings for data transmission.',
            icon: '🔐',
            href: '/tools/base64',
            category: 'Encoding',
        },
        {
            name: 'URL Encoder/Decoder',
            description: 'Convert URLs to safe encoded format and back.',
            icon: '🔗',
            href: '/tools/url-encoder',
            category: 'Encoding',
        },
        {
            name: 'Color Picker & Gradients',
            description: 'Pick colors, convert formats, and generate CSS gradients.',
            icon: '🎨',
            href: '/tools/color-picker',
            category: 'Design',
        },
        {
            name: 'JWT Decoder & Hash Generator',
            description: 'Decode JWT tokens and generate cryptographic hashes.',
            icon: '🔑',
            href: '/tools/jwt-decoder',
            category: 'Security',
        },
        {
            name: 'Text Tools',
            description: 'Count characters/words, convert case, and clean up text.',
            icon: '📄',
            href: '/tools/text-tools',
            category: 'Utilities',
        },
        {
            name: 'QR Code Generator',
            description: 'Generate custom QR codes for URLs, text, and more.',
            icon: '📱',
            href: '/tools/qr-code-generator',
            category: 'Utilities',
        },
        {
            name: 'Password Generator',
            description: 'Create secure passwords and check password strength.',
            icon: '🔒',
            href: '/tools/password-generator',
            category: 'Security',
        },
        {
            name: 'UUID Generator',
            description: 'Generate unique identifiers (UUIDs) instantly.',
            icon: '🔑',
            href: '/tools/uuid-generator',
            category: 'Utilities',
        },
        {
            name: 'Lorem Ipsum Generator',
            description: 'Generate placeholder text for designs and mockups.',
            icon: '📝',
            href: '/tools/lorem-ipsum-generator',
            category: 'Text',
        },
        {
            name: 'Timestamp Converter',
            description: 'Convert Unix timestamps to dates and vice versa.',
            icon: '⏰',
            href: '/tools/timestamp-converter',
            category: 'Utilities',
        },
        {
            name: 'Diff Checker',
            description: 'Compare text files and highlight differences.',
            icon: '🔍',
            href: '/tools/diff-checker',
            category: 'Utilities',
        },
        {
            name: 'HTML Encoder/Decoder',
            description: 'Encode/decode HTML entities for security and display.',
            icon: '🔐',
            href: '/tools/html-encoder',
            category: 'Web',
        },
        {
            name: 'JSON Validator',
            description: 'Validate, format, and minify JSON data instantly.',
            icon: '✅',
            href: '/tools/json-validator',
            category: 'Data',
        },
        {
            name: 'Image Compressor',
            description: 'Compress images to reduce file size and improve performance.',
            icon: '📷',
            href: '/tools/image-compressor',
            category: 'Media',
        },
        {
            name: 'Minifier',
            description: 'Minify JavaScript, CSS, and HTML for production.',
            icon: '⚡',
            href: '/tools/minifier',
            category: 'Web',
        },
        {
            name: 'XML Formatter',
            description: 'Format, validate, and convert XML documents.',
            icon: '📜',
            href: '/tools/xml-formatter',
            category: 'Data',
        },
        {
            name: 'YAML Tools',
            description: 'Convert YAML ↔ JSON and validate YAML files.',
            icon: '🛠️',
            href: '/tools/yaml-tools',
            category: 'Data',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="gradient-bg py-20">
                <div className="container-custom">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Free Developer Tools for{' '}
                            <span className="text-gradient">Every Task</span>
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            Boost your productivity with our collection of powerful, free developer tools.
                            From regex testing to AI-powered error explanations, we've got you covered.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#tools" className="btn-primary">
                                Explore Tools
                            </a>
                            <Link href="/about" className="btn-secondary">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* MCP Tools Section - Premium Features */}
            <section className="py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                                ✨ Premium MCP Integration
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            MCP-Powered Tools
                        </h2>
                        <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                            Advanced tools powered by Model Context Protocol for seamless integration and automation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {/* WooCommerce Manager */}
                        <Link
                            href="/tools/woocommerce"
                            className="block bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                    🛍️
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                            WooCommerce Manager
                                        </h3>
                                        <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            MCP
                                        </span>
                                    </div>
                                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                                        Secure WooCommerce store management with MCP integration and AI chat.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="bg-purple-500/30 text-purple-200 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-400/30">
                                            🔐 Secure
                                        </span>
                                        <span className="bg-blue-500/30 text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-400/30">
                                            🤖 AI-Powered
                                        </span>
                                        <span className="bg-pink-500/30 text-pink-200 text-xs font-medium px-2 py-0.5 rounded-full border border-pink-400/30">
                                            🔄 Full CRUD
                                        </span>
                                    </div>
                                    <div className="mt-3 text-purple-300 text-sm font-semibold group-hover:text-white transition-colors flex items-center gap-2">
                                        <span>Explore Tool</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* MCP Tool Tester */}
                        <Link
                            href="/tools/mcp-tester"
                            className="block bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                    🧪
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                            MCP Tool Tester
                                        </h3>
                                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            NEW
                                        </span>
                                    </div>
                                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                                        Test any MCP server dynamically with custom configs and AI chat interface.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="bg-cyan-500/30 text-cyan-200 text-xs font-medium px-2 py-0.5 rounded-full border border-cyan-400/30">
                                            🔧 Dynamic
                                        </span>
                                        <span className="bg-blue-500/30 text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-400/30">
                                            � Interactive
                                        </span>
                                        <span className="bg-indigo-500/30 text-indigo-200 text-xs font-medium px-2 py-0.5 rounded-full border border-indigo-400/30">
                                            🎯 Universal
                                        </span>
                                    </div>
                                    <div className="mt-3 text-purple-300 text-sm font-semibold group-hover:text-white transition-colors flex items-center gap-2">
                                        <span>Test MCP Servers</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Developer Tools
                        </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Tools designed to streamline your development workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => {
                            // Map category to CSS class
                            const categoryClass = `category-${tool.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`;

                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="card group"
                                >
                                    <div className="flex items-start space-x-4 relative z-10">
                                        <div className="tool-icon">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gradient transition-all">
                                                {tool.name}
                                            </h3>
                                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{tool.description}</p>
                                            <span className={`category-badge ${categoryClass}`}>
                                                {tool.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Boost Your Productivity?
                    </h2>
                    <p className="text-lg mb-8 text-blue-50">
                        Start using our free developer tools today. No sign-up required.
                    </p>
                    <a href="#tools" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Get Started Now
                    </a>
                </div>
            </section>
        </div>
    );
}
