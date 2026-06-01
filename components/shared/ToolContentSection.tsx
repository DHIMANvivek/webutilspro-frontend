import React from 'react';
import { HelpCircle, BookOpen, Lightbulb } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface ToolContentProps {
    title: string;
    intro: string;
    features: {
        title: string;
        description: string;
    }[];
    howTo?: string[];
    faqs?: FAQ[];
}

export default function ToolContentSection({ title, intro, features, howTo, faqs }: ToolContentProps) {
    return (
        <section className="border-t border-neutral-900/10 bg-[#fbfbf4] py-14">
            <div className="container-custom mx-auto max-w-4xl space-y-14">

                {/* Introduction */}
                <div className="space-y-6">
                    <div className="wup-kicker">
                        <BookOpen size={14} />
                        In-Depth Guide
                    </div>
                    <h2 className="text-3xl font-semibold tracking-normal text-neutral-950 md:text-4xl">{title}</h2>
                    <p className="text-lg leading-8 text-neutral-600">
                        {intro}
                    </p>
                </div>

                {/* Features / Insights */}
                <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-2">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-[#fbfbf4] p-5">
                            <h3 className="mb-3 text-lg font-semibold text-neutral-950">{feature.title}</h3>
                            <p className="text-sm leading-6 text-neutral-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* How to Use */}
                {howTo && (
                    <div className="space-y-6">
                        <div className="wup-kicker">
                            <Lightbulb size={14} />
                            How it works
                        </div>
                        <h3 className="text-2xl font-semibold text-neutral-950">How to use this tool</h3>
                        <ol className="grid gap-px border border-neutral-900/15 bg-neutral-900/15">
                            {howTo.map((step, idx) => (
                                <li key={idx} className="flex gap-4 bg-[#fbfbf4] p-4">
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-neutral-950 bg-neutral-950 font-mono text-xs font-bold text-white">
                                        {idx + 1}
                                    </span>
                                    <p className="pt-1 leading-7 text-neutral-600">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* FAQs */}
                {faqs && faqs.length > 0 && (
                    <div className="space-y-8">
                        <div className="wup-kicker">
                            <HelpCircle size={14} />
                            FAQ
                        </div>
                        <h3 className="text-2xl font-semibold text-neutral-950">Frequently Asked Questions</h3>
                        <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="space-y-2 bg-[#fbfbf4] p-5">
                                    <h4 className="text-lg font-semibold text-neutral-950">{faq.question}</h4>
                                    <p className="leading-7 text-neutral-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
