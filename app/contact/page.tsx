'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Github, Mail, MessageSquareText } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="wup-page-shell">
            <section className="wup-page-hero">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        <div className="wup-kicker">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            Contact
                        </div>
                        <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-normal md:text-7xl">
                            Send a message.
                        </h1>
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600 md:text-xl">
                            Have questions, suggestions, or feedback? Send it over and I will get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            <section className="wup-section">
                <div className="container-custom grid grid-cols-1 gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-[1.1fr_0.9fr]">
                    {/* Contact Form */}
                    <div className="bg-[#fbfbf4] p-6 md:p-8">
                        <h2 className="text-2xl font-semibold text-neutral-950">
                            Send Us a Message
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            Fill out the form below with the tool idea, bug report, or workflow problem you want to share.
                        </p>

                        {error && (
                            <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        {submitted ? (
                            <div className="mt-6 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                Thank you for your message! We'll be in touch soon.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-600">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="textarea-field"
                                        placeholder="Your message..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary flex w-full items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-[#fbfbf4] p-6 md:p-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-950">
                                Get In Touch
                            </h2>
                            <div className="mt-6 grid gap-px border border-neutral-900/15 bg-neutral-900/15">
                                <div className="flex items-start gap-3 bg-[#fbfbf4] p-4">
                                    <Mail className="h-5 w-5 flex-shrink-0 text-neutral-900" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-950">Email</h3>
                                        <a href="mailto:googlydhiman.4236@gmail.com" className="text-sm text-neutral-600 underline decoration-neutral-900/25 underline-offset-4 hover:text-neutral-950">
                                            googlydhiman.4236@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#fbfbf4] p-4">
                                    <Clock className="h-5 w-5 flex-shrink-0 text-neutral-900" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-950">Response Time</h3>
                                        <p className="text-sm text-neutral-600">Usually within 24-48 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#fbfbf4] p-4">
                                    <Github className="h-5 w-5 flex-shrink-0 text-neutral-900" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-950">GitHub</h3>
                                        <a href="https://github.com/DHIMANvivek" className="text-sm text-neutral-600 underline decoration-neutral-900/25 underline-offset-4 hover:text-neutral-950">
                                            DHIMANvivek
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border border-neutral-900/15 bg-[#fbff5d] p-5">
                            <h3 className="font-semibold text-neutral-950">Quick Questions?</h3>
                            <p className="mt-2 text-sm leading-6 text-neutral-700">
                                Check our tools pages for detailed documentation and FAQs that might answer
                                your question.
                            </p>
                            <Link href="/#tools" className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-950">
                                Browse Tools
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
