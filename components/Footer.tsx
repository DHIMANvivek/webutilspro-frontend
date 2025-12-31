import Link from 'next/link';
import { Github, Twitter, Heart, Zap, Shield, Globe } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050508] text-slate-400 border-t border-white/[0.05] relative overflow-hidden selection:bg-blue-500/30">
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),transparent_50%)] pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            <div className="container-custom pt-32 pb-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-12 lg:col-span-4 mb-8 lg:mb-0">
                        <Link href="/" className="flex items-center space-x-4 mb-10 group no-underline">
                            <div className="w-14 h-14 overflow-hidden rounded-2xl border border-white/[0.12] group-hover:border-blue-500/50 shadow-2xl transition-all duration-700 group-hover:rotate-[12deg] group-hover:scale-110 bg-black/40 backdrop-blur-md">
                                <img src="/logo.png" alt="WebUtilsPro" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter leading-none">WebUtilsPro</span>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mt-1 ml-0.5">Professional Grade</span>
                            </div>
                        </Link>
                        <p className="text-lg text-slate-500 max-w-sm mb-12 leading-relaxed font-medium tracking-tight">
                            The ultimate toolkit for modern web developers. <span className="text-slate-300">AI-powered</span> utilities designed for speed, security, and exceptional DX.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com" className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-blue-600/10 hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-500 group shadow-lg">
                                <Github className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </a>
                            <a href="https://twitter.com" className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-sky-600/10 hover:border-sky-500/50 hover:-translate-y-1.5 transition-all duration-500 group shadow-lg">
                                <Twitter className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-40">Core Tools</h3>
                        <ul className="space-y-6">
                            {[
                                { name: 'Regex Tester', href: '/tools/regex-tester', color: 'hover:text-blue-400' },
                                { name: 'JSON Converter', href: '/tools/json-to-csv', color: 'hover:text-blue-400' },
                                { name: 'Markdown Parser', href: '/tools/markdown-to-html', color: 'hover:text-blue-400' },
                            ].map((tool) => (
                                <li key={tool.name}>
                                    <Link href={tool.href} className={`text-slate-500 ${tool.color} transition-all duration-300 text-sm font-bold flex items-center gap-3 group translate-x-0 hover:translate-x-2`}>
                                        <Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-40">Intelligence</h3>
                        <ul className="space-y-6">
                            {[
                                { name: 'AI Explainer', href: '/tools/ai-error-explainer', color: 'hover:text-purple-400' },
                                { name: 'Prompt Optimizer', href: '/tools/prompt-optimizer', color: 'hover:text-purple-400' },
                                { name: 'MCP Tester', href: '/tools/mcp-tester', color: 'hover:text-purple-400' },
                            ].map((tool) => (
                                <li key={tool.name}>
                                    <Link href={tool.href} className={`text-slate-500 ${tool.color} transition-all duration-300 text-sm font-bold flex items-center gap-3 group translate-x-0 hover:translate-x-2`}>
                                        <Zap className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-purple-500" />
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-40">Company</h3>
                        <ul className="space-y-6">
                            {['About', 'Privacy', 'Terms'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="text-slate-500 hover:text-white transition-all duration-300 text-sm font-bold flex items-center gap-2 group translate-x-0 hover:translate-x-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support / Status */}
                    <div className="md:col-span-12 lg:col-span-2">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#0A0A0F]/80 border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 blur-sm opacity-50"></div>
                                    </div>
                                    <p className="text-xs font-black text-white uppercase tracking-[0.2em]">Systems</p>
                                </div>
                                <h4 className="text-xl font-black text-emerald-400 mb-3 tracking-tight italic">Operational</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider opacity-80">
                                    Global edge nodes active and performing at peak.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2.5">
                            Crafted with <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 animate-pulse" /> for the community.
                        </p>
                        <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.3em] bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/[0.03]">
                            © {currentYear} WebUtilsPro • All Rights Reserved
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:border-emerald-500/30 transition-colors duration-500">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black group-hover:text-slate-300 transition-colors">SSL Secure</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:border-blue-500/30 transition-colors duration-500">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black group-hover:text-slate-300 transition-colors">CDN Edge</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
