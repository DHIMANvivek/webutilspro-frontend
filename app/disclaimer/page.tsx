import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'Disclaimer',
    description: 'Read our disclaimer to understand the limitations of liability and accuracy of information on WebUtilsPro.',
    keywords: ['disclaimer', 'legal notice', 'limitation of liability', 'AI accuracy'],
});

export default function DisclaimerPage() {
    return (
        <div className="wup-page-shell">
            <div className="container-custom max-w-4xl py-12 md:py-16">
                <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-7xl">
                    Disclaimer
                </h1>

                <div className="border border-neutral-900/15 bg-[#fbfbf4] p-6 md:p-10">
                    <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="wup-prose">
                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">1. General Disclaimer</h2>
                            <p className="leading-7 text-neutral-600">
                                All tools, utilities, and information provided by WebUtilsPro ("Service") are provided on an
                                "as is" and "as available" basis without any warranties of any kind, whether express or
                                implied. We do not guarantee that the Service will meet your requirements or be
                                uninterrupted, timely, secure, or error-free.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">2. Accuracy of Information</h2>
                            <p className="leading-7 text-neutral-600">
                                While we strive to provide accurate and up-to-date tools and information, WebUtilsPro
                                makes no representations or warranties of any kind, express or implied, about the
                                completeness, accuracy, reliability, suitability, or availability of the results
                                obtained from using our tools, particularly our AI-powered features.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">3. AI-Generated Content</h2>
                            <p className="leading-7 text-neutral-600">
                                Our AI tools (such as the Error Explainer and Prompt Optimizer) generate responses using
                                machine learning models. These responses should be used for informational purposes only
                                and should not be relied upon as absolute fact. Always verify AI-generated code or
                                suggestions before implementation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">4. No Professional Advice</h2>
                            <p className="leading-7 text-neutral-600">
                                The information and tools provided by WebUtilsPro do not constitute professional
                                engineering, legal, or financial advice. Any reliance you place on such information
                                is strictly at your own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">5. External Links and Advertisements</h2>
                            <p className="leading-7 text-neutral-600">
                                Our Service contains links to third-party websites and advertisements, including Google
                                AdSense after approval. We have no control over the content, privacy policies, or practices
                                of any third-party sites and assume no responsibility for them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">6. Limitation of Liability</h2>
                            <p className="leading-7 text-neutral-600">
                                In no event shall WebUtilsPro or its creators be liable for any direct, indirect,
                                incidental, special, consequential, or punitive damages arising out of your access to,
                                use of, or inability to use our tools, even if we have been advised of the possibility
                                of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neutral-950">7. Contact</h2>
                            <p className="leading-7 text-neutral-600">
                                If you have any questions regarding this disclaimer, please contact us at{' '}
                                <a href="mailto:googlydhiman.4236@gmail.com" className="font-semibold text-neutral-950 underline decoration-neutral-900/25 underline-offset-4 hover:decoration-neutral-950">
                                    googlydhiman.4236@gmail.com
                                </a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
