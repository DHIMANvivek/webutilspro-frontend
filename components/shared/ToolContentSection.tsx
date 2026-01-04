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
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="container-custom max-w-4xl mx-auto space-y-16">

                {/* Introduction */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest">
                        <BookOpen size={14} />
                        In-Depth Guide
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">{title}</h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {intro}
                    </p>
                </div>

                {/* Features / Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* How to Use */}
                {howTo && (
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                            <Lightbulb size={14} />
                            How it works
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">How to use this tool</h3>
                        <ol className="space-y-4">
                            {howTo.map((step, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                    <p className="text-slate-600 leading-relaxed pt-1">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* FAQs */}
                {faqs && faqs.length > 0 && (
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-widest">
                            <HelpCircle size={14} />
                            FAQ
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
                        <div className="grid gap-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="font-bold text-slate-900 text-lg">{faq.question}</h4>
                                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
