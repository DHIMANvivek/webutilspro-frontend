import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'Terms of Service',
    description: 'Read our terms of service to understand the rules and regulations for using WebUtilsPro.',
    keywords: ['terms of service', 'user agreement', 'terms and conditions'],
});

export default function TermsPage() {
    return (
        <div className="wup-page-shell">
            <div className="container-custom max-w-4xl py-12 md:py-16">
                <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-7xl">
                    Terms of Service
                </h1>

                <div className="border border-neutral-900/15 bg-[#fbfbf4] p-6 md:p-10">
                    <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="wup-prose">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">1. Agreement to Terms</h2>
                            <p className="leading-7 text-neutral-600">
                                By accessing or using Web UtilsPro ("Service"), you agree to be bound by these Terms of
                                Service ("Terms"). If you disagree with any part of these terms, you may not access the
                                Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">2. Use of Service</h2>

                            <h3 className="text-lg font-semibold text-neutral-950">2.1 Permitted Use</h3>
                            <p className="leading-7 text-neutral-600">
                                You may use our Service for lawful purposes only. Our tools are provided free of charge for
                                personal and commercial use, subject to these Terms.
                            </p>

                            <h3 className="text-lg font-semibold text-neutral-950">2.2 Prohibited Use</h3>
                            <p className="leading-7 text-neutral-600">You agree not to:</p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1">
                                <li>Use the Service in any way that violates applicable laws or regulations</li>
                                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Use automated systems (bots, scripts) to access the Service excessively</li>
                                <li>Transmit viruses, malware, or other malicious code</li>
                                <li>Reverse engineer or attempt to extract source code</li>
                                <li>Remove or modify any copyright, trademark, or proprietary notices</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">3. Rate Limiting and Fair Use</h2>
                            <p className="leading-7 text-neutral-600">
                                To ensure fair access for all users, we implement rate limiting on certain tools,
                                particularly our AI-powered services. Current limits are set at 10 requests per day per
                                IP address for AI tools. Excessive use may result in temporary or permanent restriction
                                of access.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">4. Intellectual Property</h2>

                            <h3 className="text-lg font-semibold text-neutral-950">4.1 Our Content</h3>
                            <p className="leading-7 text-neutral-600">
                                The Service and its original content, features, and functionality are owned by WebUtilsPro
                                and are protected by international copyright, trademark, patent, trade secret, and other
                                intellectual property laws.
                            </p>

                            <h3 className="text-lg font-semibold text-neutral-950">4.2 Your Content</h3>
                            <p className="leading-7 text-neutral-600">
                                You retain all rights to any content you input into our tools. We do not claim ownership
                                of your data. For client-side tools, your data never leaves your browser. For server-side
                                AI tools, data is processed temporarily and not stored.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">5. Disclaimer of Warranties</h2>
                            <p className="leading-7 text-neutral-600">
                                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. WebUtilsPro makes no
                                warranties, expressed or implied, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1">
                                <li>Warranties of merchantability or fitness for a particular purpose</li>
                                <li>That the Service will be uninterrupted, timely, secure, or error-free</li>
                                <li>That the results obtained from using the Service will be accurate or reliable</li>
                                <li>That any errors in the Service will be corrected</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">6. Limitation of Liability</h2>
                            <p className="leading-7 text-neutral-600">
                                In no event shall WebUtilsPro, its directors, employees, partners, agents, suppliers, or
                                affiliates be liable for any indirect, incidental, special, consequential, or punitive
                                damages, including without limitation loss of profits, data, use, goodwill, or other
                                intangible losses, resulting from:
                            </p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1 mt-3">
                                <li>Your access to or use of or inability to access or use the Service</li>
                                <li>Any conduct or content of any third party on the Service</li>
                                <li>Any content obtained from the Service</li>
                                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">7. AI-Powered Tools</h2>
                            <p className="leading-7 text-neutral-600">
                                Our AI-powered tools (Error Explainer and Prompt Optimizer) use artificial intelligence
                                to generate responses. Please note:
                            </p>
                            <ul className="list-disc pl-6 leading-7 text-neutral-600 space-y-1">
                                <li>AI-generated content may not always be accurate or complete</li>
                                <li>You should verify all AI-generated suggestions before implementing them</li>
                                <li>We are not responsible for any issues arising from following AI-generated advice</li>
                                <li>AI tools are subject to daily usage limits to ensure fair access</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">8. Third-Party Services</h2>
                            <p className="leading-7 text-neutral-600">
                                Our Service may contain links to third-party websites or services that are not owned or
                                controlled by WebUtilsPro. We have no control over and assume no responsibility for the
                                content, privacy policies, or practices of any third-party websites or services, including
                                Google AdSense advertisements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">9. Modifications to Service</h2>
                            <p className="leading-7 text-neutral-600">
                                We reserve the right to modify or discontinue, temporarily or permanently, the Service
                                (or any part thereof) with or without notice. We shall not be liable to you or any third
                                party for any modification, suspension, or discontinuance of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">10. Changes to Terms</h2>
                            <p className="leading-7 text-neutral-600">
                                We reserve the right to modify or replace these Terms at any time. If a revision is
                                material, we will provide at least 30 days' notice prior to any new terms taking effect.
                                What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">11. Governing Law</h2>
                            <p className="leading-7 text-neutral-600">
                                These Terms shall be governed and construed in accordance with the laws of the jurisdiction
                                in which WebUtilsPro operates, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">12. Contact Us</h2>
                            <p className="leading-7 text-neutral-600">
                                If you have any questions about these Terms, please contact us at{' '}
                                <a href="mailto:googlydhiman.4236@gmail.com" className="font-semibold text-neutral-950 underline decoration-neutral-900/25 underline-offset-4 hover:decoration-neutral-950">
                                    googlydhiman.4236@gmail.com
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
