import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg"></div>
                            <span className="text-xl font-bold text-white">WebUtilsPro</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Free developer tools to boost your productivity and streamline your workflow.
                        </p>
                    </div>

                    {/* Tools - Column 1 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Developer Tools</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/tools/regex-tester"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Regex Tester
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/json-to-csv"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    JSON ↔ CSV
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/markdown-to-html"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Markdown → HTML
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/code-formatter"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Code Formatter
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/base64"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Base64 Encoder
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tools - Column 2 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">AI & Security</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/tools/ai-error-explainer"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    AI Error Explainer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/prompt-optimizer"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Prompt Optimizer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/url-encoder"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    URL Encoder
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/color-picker"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Color Picker
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/jwt-decoder"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    JWT Decoder
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/text-tools"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Text Tools
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/qr-code-generator"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    QR Code Generator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/password-generator"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Password Generator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/uuid-generator"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    UUID Generator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/lorem-ipsum-generator"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Lorem Ipsum
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tools/timestamp-converter"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Timestamp Converter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        © {currentYear} WebUtilsPro. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-2 md:mt-0">
                        This site uses AdSense for monetization. We respect your privacy.
                    </p>
                </div>
            </div>
        </footer>
    );
}
