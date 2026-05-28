import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'Disclaimer',
    description: 'Read our disclaimer to understand the limitations of liability and accuracy of information on WebUtilsPro.',
    keywords: ['disclaimer', 'legal notice', 'limitation of liability', 'AI accuracy'],
});

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen gradient-bg py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Disclaimer
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <p className="text-sm text-gray-500 mb-6">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="prose prose-lg max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. General Disclaimer</h2>
                            <p className="text-gray-600">
                                All tools, utilities, and information provided by WebUtilsPro ("Service") are provided on an
                                "as is" and "as available" basis without any warranties of any kind, whether express or
                                implied. We do not guarantee that the Service will meet your requirements or be
                                uninterrupted, timely, secure, or error-free.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Accuracy of Information</h2>
                            <p className="text-gray-600">
                                While we strive to provide accurate and up-to-date tools and information, WebUtilsPro
                                makes no representations or warranties of any kind, express or implied, about the
                                completeness, accuracy, reliability, suitability, or availability of the results
                                obtained from using our tools, particularly our AI-powered features.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. AI-Generated Content</h2>
                            <p className="text-gray-600">
                                Our AI tools (such as the Error Explainer and Prompt Optimizer) generate responses using
                                machine learning models. These responses should be used for informational purposes only
                                and should not be relied upon as absolute fact. Always verify AI-generated code or
                                suggestions before implementation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. No Professional Advice</h2>
                            <p className="text-gray-600">
                                The information and tools provided by WebUtilsPro do not constitute professional
                                engineering, legal, or financial advice. Any reliance you place on such information
                                is strictly at your own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. External Links and Advertisements</h2>
                            <p className="text-gray-600">
                                Our Service contains links to third-party websites and advertisements, including Google
                                AdSense after approval. We have no control over the content, privacy policies, or practices
                                of any third-party sites and assume no responsibility for them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
                            <p className="text-gray-600">
                                In no event shall WebUtilsPro or its creators be liable for any direct, indirect,
                                incidental, special, consequential, or punitive damages arising out of your access to,
                                use of, or inability to use our tools, even if we have been advised of the possibility
                                of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contact</h2>
                            <p className="text-gray-600">
                                If you have any questions regarding this disclaimer, please contact us at{' '}
                                <a href="mailto:googlydhiman.4236@gmail.com" className="text-primary-600 hover:text-primary-700">
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
