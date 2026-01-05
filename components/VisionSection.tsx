import React from 'react';
import { Play, Rocket, Globe, Zap, Users, Shield } from 'lucide-react';

export default function VisionSection() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Video Column */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video border border-slate-800">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/pPGT1Kxzmc0?rel=0"
                                title="WebUtilsPro Vision"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                            Our Mission & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Future Roadmap
                            </span>
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                            WebUtilsPro started with a simple goal: to provide high-quality, privacy-first developer tools without the clutter. We are building a comprehensive ecosystem that empowers developers to build faster and safer.
                        </p>

                        <div className="space-y-8">
                            {/* Our Aim */}
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Core Mission</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        To democratize access to premium-grade development utilities. We believe privacy is a right, not a feature—that's why our tools process data locally whenever possible.
                                    </p>
                                </div>
                            </div>

                            {/* Future Roadmap */}
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Road Ahead</h3>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                            <span>Integration with Autonomous AI Agents</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                            <span>Cloud Sync & Team Collaboration Features</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                            <span>Public API for all tools</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Helper component for Icon (since Target wasn't imported in previous attempts, defining purely visual one or simple import)
function Target({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}
