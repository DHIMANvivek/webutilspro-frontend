import Link from 'next/link';
import { Github, Twitter, Heart, Zap, Shield, Globe } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050508] text-slate-400 border-t border-white/5 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container-custom pt-24 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center space-x-3 mb-8 group">
                            <div className="w-12 h-12 overflow-hidden rounded-2xl border border-white/10 group-hover:border-blue-500/50 shadow-2xl transition-all duration-500 group-hover:rotate-6">
                                <img src="/logo.png" alt="WebUtilsPro" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter">WebUtilsPro</span>
                        </Link>
                        <p className="text-lg text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
                            Professional utilities for the modern developer. Powered by AI, built for performance.
                        </p>
                        <div className="flex items-center gap-5">
                            <a href="https://github.com" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group">
                                <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="https://twitter.com" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 group">
                                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">Tools</h3>
                        <ul className="space-y-5">
                            <li><Link href="/tools/regex-tester" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> Regex Tester</Link></li>
                            <li><Link href="/tools/json-to-csv" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> JSON Converter</Link></li>
                            <li><Link href="/tools/markdown-to-html" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> Markdown Parser</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">Advanced</h3>
                        <ul className="space-y-5">
                            <li><Link href="/tools/ai-error-explainer" className="text-slate-500 hover:text-purple-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> AI Explainer</Link></li>
                            <li><Link href="/tools/prompt-optimizer" className="text-slate-500 hover:text-purple-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> Prompt Opt</Link></li>
                            <li><Link href="/tools/woocommerce" className="text-slate-500 hover:text-purple-400 transition-colors text-sm font-semibold flex items-center gap-2 group"><Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /> WooCommerce</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50">Company</h3>
                        <ul className="space-y-5">
                            <li><Link href="/about" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">About</Link></li>
                            <li><Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">Privacy</Link></li>
                            <li><Link href="/terms" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">Terms</Link></li>
                        </ul>
                    </div>

                    {/* Support / Status */}
                    <div className="md:col-span-12 lg:col-span-2">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 opacity-50 flex items-center gap-2">
                            Status
                        </h3>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-sm font-black text-emerald-400">All Systems Go</p>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Our global infrastructure is operating at peak performance.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-sm text-slate-600 font-bold flex items-center gap-2">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by developers for developers.
                        </p>
                        <p className="text-xs text-slate-700 font-medium tracking-tight">
                            © {currentYear} WebUtilsPro. Built with Next.js & Tailwind.
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[10px] text-slate-700 uppercase tracking-[0.2em] font-black">
                            <Shield className="w-3 h-3" /> Secure SSL
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-700 uppercase tracking-[0.2em] font-black">
                            <Globe className="w-3 h-3" /> CDN Edge
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
