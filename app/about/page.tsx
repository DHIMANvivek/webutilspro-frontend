import Link from 'next/link';
import { ArrowRight, BadgeCheck, Code2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/seo';

const profileImage =
    'https://avatars.githubusercontent.com/u/54342280?v=4';

const principles = [
    {
        title: 'Built from real developer needs',
        description: 'Tools are chosen around common coding, debugging, formatting, conversion, and productivity problems.',
        icon: Code2
    },
    {
        title: 'Privacy-conscious utilities',
        description: 'Many tools run directly in the browser, so sensitive snippets and data can stay on your device.',
        icon: ShieldCheck
    },
    {
        title: 'Learning-friendly design',
        description: 'Pages include examples, FAQs, and context so newer developers can understand what each tool is doing.',
        icon: BadgeCheck
    },
    {
        title: 'Always improving',
        description: 'WebUtilsPro grows as I experiment, learn, and add utilities that can help the wider developer community.',
        icon: HeartHandshake
    }
];

export const metadata = genMeta({
    title: 'About Vivek Dhiman and WebUtilsPro',
    description: 'Meet Vivek Dhiman, the software developer behind WebUtilsPro, a hobby-built collection of practical tools for curious and keen developers.',
    keywords: ['Vivek Dhiman', 'webutilspro founder', 'software developer', 'developer tools', 'free coding tools'],
});

export default function AboutPage() {
    return (
        <div className="wup-page-shell">
            <section className="wup-page-hero">
                <div className="container-custom">
                    <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-center">
                        <div className="border border-neutral-900/15 bg-[#fbfbf4] p-4 shadow-[10px_12px_0_rgba(20,20,15,0.1)]">
                            <div className="aspect-square overflow-hidden border border-neutral-900/15 bg-neutral-900/10">
                                <img src={profileImage} alt="Vivek Dhiman" className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <div>
                            <div className="wup-kicker">Founder & Builder</div>
                            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-normal md:text-7xl">
                                Vivek Dhiman
                            </h1>
                            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600 md:text-xl">
                                Software developer building practical web utilities as a hobby project for developers who enjoy learning, shipping, and solving real workflow problems.
                            </p>

                            <div className="mt-8 grid max-w-xl gap-px border border-neutral-900/15 bg-neutral-900/15 sm:grid-cols-2">
                                <div className="bg-[#fbfbf4] p-5">
                                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Focus</div>
                                    <div className="mt-2 text-2xl font-semibold">Practical utilities</div>
                                    <p className="mt-2 text-sm leading-6 text-neutral-600">Small tools that solve real developer workflow problems.</p>
                                </div>
                                <div className="bg-[#fbfbf4] p-5">
                                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Approach</div>
                                    <div className="mt-2 text-2xl font-semibold">Built with care</div>
                                    <p className="mt-2 text-sm leading-6 text-neutral-600">Fast, simple, and privacy-conscious wherever possible.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="wup-section">
                <div className="container-custom grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Why WebUtilsPro exists</div>
                        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Fast tools for curious builders.</h2>
                    </div>
                    <div className="wup-prose">
                        <p>
                            WebUtilsPro started as a personal hobby project with a simple idea: developers should have fast, reliable, and easy-to-use tools available whenever they need them.
                        </p>
                        <p>
                            The goal is not just to collect tools, but to make each utility feel useful, focused, and approachable. Whether someone is debugging JSON, learning a pattern, or polishing a small project, WebUtilsPro is designed to help them get unstuck.
                        </p>
                    </div>
                </div>
            </section>

            <section className="wup-page-hero">
                <div className="container-custom">
                    <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-2">
                        {principles.map((point) => {
                            const Icon = point.icon;
                            return (
                                <div key={point.title} className="bg-[#fbfbf4] p-6">
                                    <Icon className="h-6 w-6 text-neutral-900" />
                                    <h3 className="mt-6 text-xl font-semibold text-neutral-950">{point.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-neutral-600">{point.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex flex-col justify-between gap-4 border border-neutral-900/15 bg-[#fbfbf4] p-5 md:flex-row md:items-center">
                        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
                            Have an idea for a useful developer tool? Share what would help your workflow.
                        </p>
                        <Link href="/contact" className="inline-flex h-11 items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                            Contact
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
