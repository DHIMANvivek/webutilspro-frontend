import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'Privacy Policy',
    description: 'Read our privacy policy to understand how WebUtilsPro collects, uses, and protects your data.',
    keywords: ['privacy policy', 'data protection', 'user privacy'],
});

export default function PrivacyPage() {
    return (
        <div className="wup-page-shell">
            <div className="container-custom max-w-4xl py-12 md:py-16">
                <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-7xl">
                    Privacy Policy
                </h1>

                <div className="border border-neutral-900/15 bg-[#fbfbf4] p-6 md:p-10">
                    <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="wup-prose">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">1. Introduction</h2>
                            <p className="leading-7 text-neutral-600">
                                Vivek Dhiman ("we," "our," or "us") is committed to protecting your privacy. This Privacy
                                Policy explains how we collect, use, disclose, and safeguard your information when you visit
                                our website and use our developer tools.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">2. Information We Collect</h2>

                            <h3 className="text-lg font-semibold text-neutral-950">2.1 Information You Provide</h3>
                            <p className="leading-7 text-neutral-600">
                                Most of our tools process data entirely in your browser without sending information to our
                                servers. However, when you use our contact form or AI-powered tools, we may collect:
                            </p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1 mb-4">
                                <li>Name and email address (when you contact us)</li>
                                <li>Error messages or prompts (for AI-powered tools, temporarily processed and not stored)</li>
                                <li>IP address (for rate limiting purposes)</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-neutral-950">2.2 Automatically Collected Information</h3>
                            <p className="leading-7 text-neutral-600">
                                When you visit our website, we automatically collect certain information about your device,
                                including:
                            </p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1 mb-4">
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">3. How We Use Your Information</h2>
                            <p className="leading-7 text-neutral-600">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1">
                                <li>Provide and maintain our tools and services</li>
                                <li>Respond to your comments, questions, and requests</li>
                                <li>Monitor and analyze usage patterns and trends</li>
                                <li>Prevent fraudulent or abusive use of our services</li>
                                <li>Improve our website and develop new features</li>
                                <li>Serve relevant advertisements through Google AdSense</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">4. Data Processing and Storage</h2>
                            <p className="leading-7 text-neutral-600">
                                <strong>Client-Side Processing:</strong> Our non-AI tools (Regex Tester, JSON/CSV Converter,
                                Markdown Converter) process all data locally in your browser. This data never leaves your
                                device and is not transmitted to our servers.
                            </p>
                            <p className="leading-7 text-neutral-600">
                                <strong>Server-Side Processing:</strong> Our AI-powered tools send data to our servers for
                                processing. This data is used solely to generate responses and is not permanently stored.
                                We implement rate limiting to prevent abuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">5. Google AdSense</h2>
                            <p className="leading-7 text-neutral-600">
                                We use Google AdSense to serve advertisements on our website. Google uses cookies to serve
                                ads based on your prior visits to our website or other websites. You can opt out of
                                personalized advertising by visiting{' '}
                                <a href="https://www.google.com/settings/ads" className="font-semibold text-neutral-950 underline decoration-neutral-900/25 underline-offset-4 hover:decoration-neutral-950" target="_blank" rel="noopener noreferrer">
                                    Google's Ads Settings
                                </a>.
                            </p>
                            <p className="leading-7 text-neutral-600">
                                Third-party vendors, including Google, use cookies to serve ads based on a user's past
                                visits to our website. Google's use of advertising cookies enables it and its partners to
                                serve ads based on visits to our site and other sites on the Internet.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">6. Cookies and Tracking Technologies</h2>
                            <p className="leading-7 text-neutral-600">
                                We use cookies and similar tracking technologies to track activity on our website and hold
                                certain information. Cookies are files with small amounts of data that may include an
                                anonymous unique identifier.
                            </p>
                            <p className="leading-7 text-neutral-600">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                                sent. However, if you do not accept cookies, you may not be able to use some portions of
                                our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">7. Data Security</h2>
                            <p className="leading-7 text-neutral-600">
                                We implement appropriate technical and organizational security measures to protect your
                                personal information. However, no method of transmission over the Internet or electronic
                                storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">8. Your Rights</h2>
                            <p className="leading-7 text-neutral-600">Depending on your location, you may have certain rights regarding your personal information, including:</p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1">
                                <li>The right to access your personal information</li>
                                <li>The right to rectify inaccurate personal information</li>
                                <li>The right to erase your personal information</li>
                                <li>The right to restrict processing of your personal information</li>
                                <li>The right to data portability</li>
                                <li>The right to withdraw consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">9. Children's Privacy</h2>
                            <p className="leading-7 text-neutral-600">
                                Our service does not address anyone under the age of 13. We do not knowingly collect
                                personally identifiable information from children under 13. If you are a parent or guardian
                                and you are aware that your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">10. Changes to This Privacy Policy</h2>
                            <p className="leading-7 text-neutral-600">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by
                                posting the new Privacy Policy on this page and updating the "Last Updated" date at the top
                                of this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">11. Contact Us</h2>
                            <p className="leading-7 text-neutral-600">
                                If you have any questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:vivekdhiman.developer@gmail.com" className="font-semibold text-neutral-950 underline decoration-neutral-900/25 underline-offset-4 hover:decoration-neutral-950">
                                    vivekdhiman.developer@gmail.com
                                </a>{' '}
                                or visit our <a href="/contact" className="font-semibold text-neutral-950 underline decoration-neutral-900/25 underline-offset-4 hover:decoration-neutral-950">contact page</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
