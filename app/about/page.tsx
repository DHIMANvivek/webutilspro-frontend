import { generateMetadata as genMeta } from '@/lib/seo';

const profileImage =
    'https://avatars.githubusercontent.com/u/53940939?s=400&u=caedad9a99891ac6de7b43c5b77ac6c75fa4eecc&v=4';

export const metadata = genMeta({
    title: 'About Vivek Dhiman and WebUtilsPro',
    description: 'Meet Vivek Dhiman, the software developer behind WebUtilsPro, a hobby-built collection of practical tools for curious and keen developers.',
    keywords: ['vivek dhiman', 'webutilspro founder', 'software developer', 'developer tools', 'free coding tools'],
});

export default function AboutPage() {
    return (
        <div className="min-h-screen gradient-bg py-12">
            <div className="container-custom max-w-5xl">
                <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr]">
                        <div className="bg-gradient-to-br from-blue-50 via-white to-slate-100 p-8 md:p-12 flex flex-col justify-between border-r border-slate-100">
                            <div>
                                <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-blue-100/80 mb-8 bg-slate-100">
                                    <img
                                        src={profileImage}
                                        alt="Vivek Dhiman"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4">
                                    Founder & Builder
                                </p>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-4">
                                    Vivek Dhiman
                                </h1>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Software developer building practical web utilities as a hobby project for developers who enjoy learning, shipping, and solving real workflow problems.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/80 border border-slate-200 p-4 shadow-sm">
                                    <p className="text-2xl font-black text-slate-950">40+</p>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tools</p>
                                </div>
                                <div className="rounded-2xl bg-white/80 border border-slate-200 p-4 shadow-sm">
                                    <p className="text-2xl font-black text-slate-950">Free</p>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">For Devs</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="prose prose-lg max-w-none">
                                <h2 className="text-3xl font-black text-gray-900 mb-4">Why I Built WebUtilsPro</h2>
                                <p className="text-gray-600 mb-6">
                                    WebUtilsPro started as a personal hobby project by me, Vivek Dhiman, with a simple idea:
                                    developers should have fast, reliable, and easy-to-use tools available whenever they need
                                    them. I built this site to help keen developers save time on everyday tasks like formatting
                                    code, validating data, testing regex, generating QR codes, working with APIs, and exploring
                                    AI-assisted workflows.
                                </p>
                                <p className="text-gray-600 mb-8">
                                    The goal is not just to collect tools, but to make each utility feel useful, focused, and
                                    approachable. Whether someone is debugging a JSON payload, learning a new pattern, or
                                    polishing a small project, WebUtilsPro is designed to be a friendly place to get unstuck.
                                </p>

                                <h2 className="text-2xl font-black text-gray-900 mb-4">What Makes This Project Different</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose mb-8">
                                    {[
                                        {
                                            title: 'Built From Real Developer Needs',
                                            description: 'Tools are chosen around common coding, debugging, formatting, conversion, and productivity problems.',
                                        },
                                        {
                                            title: 'Privacy-Conscious Utilities',
                                            description: 'Many tools run directly in the browser, so sensitive snippets and data can stay on your device.',
                                        },
                                        {
                                            title: 'Learning-Friendly Design',
                                            description: 'Pages include examples, FAQs, and context so newer developers can understand what each tool is doing.',
                                        },
                                        {
                                            title: 'Always Improving',
                                            description: 'WebUtilsPro grows as I experiment, learn, and add utilities that can help the wider developer community.',
                                        },
                                    ].map((point) => (
                                        <div key={point.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{point.title}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <h2 className="text-2xl font-black text-gray-900 mb-4">My Vision</h2>
                                <p className="text-gray-600 mb-6">
                                    I want WebUtilsPro to become a dependable toolkit for curious developers, students,
                                    freelancers, indie hackers, and engineering teams who need quick answers without friction.
                                    Every tool is a small attempt to make development smoother, clearer, and a bit more fun.
                                </p>

                                <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mt-8 rounded-r-2xl">
                                    <p className="text-gray-700 m-0">
                                        Have an idea for a useful developer tool? I would love to hear it. Visit the{' '}
                                        <a href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
                                            contact page
                                        </a>{' '}
                                        and share what would help your workflow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
