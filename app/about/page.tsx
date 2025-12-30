import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'About Us',
    description: 'Learn about WebUtilsPro, our mission to provide free, high-quality developer tools, and how we help developers boost their productivity.',
    keywords: ['about webutilspro', 'developer tools platform', 'free coding tools', 'programming utilities'],
});

export default function AboutPage() {
    return (
        <div className="min-h-screen gradient-bg py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    About WebUtilsPro
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-6">
                            WebUtilsPro was created with a simple mission: to provide developers with free,
                            high-quality tools that solve real problems. We believe that essential development
                            utilities should be accessible to everyone, regardless of budget or experience level.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
                        <p className="text-gray-600 mb-4">
                            Our platform features a carefully curated collection of developer tools, each designed
                            to address specific pain points in the development workflow:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                            <li>
                                <strong>Regex Tester:</strong> Debug and test regular expressions with real-time
                                matching and highlighting
                            </li>
                            <li>
                                <strong>JSON ↔ CSV Converter:</strong> Seamlessly convert between JSON and CSV
                                formats with validation
                            </li>
                            <li>
                                <strong>Markdown to HTML:</strong> Transform Markdown into clean HTML with live
                                preview
                            </li>
                            <li>
                                <strong>AI Error Explainer:</strong> Get intelligent explanations and solutions
                                for programming errors
                            </li>
                            <li>
                                <strong>Prompt Optimizer:</strong> Craft better AI prompts with expert suggestions
                            </li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Principles</h2>
                        <div className="space-y-4 mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
                                <p className="text-gray-600">
                                    Most of our tools process data directly in your browser, ensuring your information
                                    never leaves your device. We don't track, store, or sell your data.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Free</h3>
                                <p className="text-gray-600">
                                    We're committed to keeping our core tools free forever. We believe access to
                                    essential development tools shouldn't come with a price tag.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Over Quantity</h3>
                                <p className="text-gray-600">
                                    Rather than offering hundreds of mediocre tools, we focus on creating a small
                                    collection of exceptionally useful, well-designed utilities.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                                <p className="text-gray-600">
                                    We listen to our users and continuously improve our tools based on real feedback
                                    and use cases from the developer community.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking Forward</h2>
                        <p className="text-gray-600 mb-6">
                            We're constantly working to expand our toolkit with new features and capabilities.
                            Our roadmap includes additional AI-powered tools, enhanced collaboration features,
                            and integrations with popular development platforms. We're excited about the future
                            and grateful for the support of our growing community.
                        </p>

                        <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mt-8">
                            <p className="text-gray-700">
                                Have a suggestion for a new tool or feature? We'd love to hear from you!
                                Visit our <a href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">contact page</a> to
                                get in touch.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
