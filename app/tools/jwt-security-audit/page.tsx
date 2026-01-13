import React from 'react';
import { Metadata } from 'next';
import JwtAuditClient from '@/components/tools/JwtAudit/JwtAuditClient';
import { ShieldAlert, BookOpen, AlertTriangle, Fingerprint, LayoutGrid } from 'lucide-react';
import { DEMO_TOKEN } from '@/components/tools/JwtAudit/CommonSecrets';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'JWT Security Auditor | Token Breach Simulator',
    description: 'Test your JWT tokens against common attacks. Simulate None-Algorithm exploits, Brute Force weak secrets, and detect PII leaks.',
    keywords: 'jwt security test, jwt breach simulator, crack jwt token, jwt weak secret, jwt none algorithm exploit, token audit',
};

export default function JwtAuditPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

            <div className="pt-24 pb-24 container-custom">
                <div className="max-w-5xl mx-auto px-4 mb-8">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { name: 'JWT Audit', href: '/tools/jwt-security-audit' },
                        ]}
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <ShieldAlert size={14} />
                        Security Operations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                        JWT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-red-600 animate-gradient">Breach Simulator</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Don't just decode your tokens—attack them. This tool runs client-side simulations to test your JWT for weak secrets and critical vulnerabilities.
                    </p>
                </div>

                {/* Main Audit Terminal */}
                <div id="audit-studio" className="relative z-10 mb-24">
                    <JwtAuditClient />
                </div>

                {/* Disclaimer */}
                <div className="max-w-3xl mx-auto mb-24 p-6 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-4">
                    <AlertTriangle className="text-orange-500 shrink-0 mt-1" />
                    <div className="text-sm text-orange-800 leading-relaxed">
                        <strong>Privacy Notice:</strong> All security checks, including the dictionary "brute-force" attack, run entirely in your browser. Your tokens and secrets are <u>never</u> sent to our servers.
                    </div>
                </div>

                {/* Educational Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-left">
                    <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Fingerprint size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Weak Secret Attack</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Simulates a brute-force attempt using a dictionary of the top 100 most common passwords. If your signing key is "secret" or "123456", we will find it.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldAlert size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">"None" Algo Exploit</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Checks if your token header explicitly allows the `none` algorithm, a critical vulnerability that allows attackers to forge admin tokens efficiently.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">PII Leak Scan</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Scans your payload for sensitive data like passwords, emails, or credit card numbers that should never be stored in a client-readable JWT.
                        </p>
                    </div>
                </div>
            </div>

            {/* SEO Content Section (Light Mode) */}
            <section className="py-24 border-t border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-6 space-y-24">

                    {/* Intro */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-100">
                            <BookOpen size={14} />
                            Security Briefing
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900">Understanding JWT Vulnerabilities</h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            JSON Web Tokens (JWT) are the standard for modern stateless authentication. However, their self-contained nature makes them a prime target for attackers. If implemented incorrectly, a JWT can be manipulated to grant unauthorized admin access, leak PII, or allow account takeovers.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">The "None" Algorithm Exploits</h3>
                            <p className="text-slate-600 leading-relaxed">
                                The JWT header specifies the signing algorithm. A critical flaw in some libraries allows attackers to set this to `none`, effectively telling the server "this token isn't signed, trust me." If the server accepts this, anyone can forge a token with `admin: true`.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">Weak Signing Secrets</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Many developers use default secrets like `secret123` or `yoursecretkey`. Attackers can use tools like Hashcat to brute-force millions of these secrets per second offline. Once the secret is found, they can sign their own arbitrary tokens.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">Information Leaks (PII)</h3>
                            <p className="text-slate-600 leading-relaxed">
                                JWTs are just Base64 encoded, not encrypted. Anyone who intercepts the token (e.g., via local storage or insecure HTTP) can read the payload. Storing emails, user IDs, or roles in clean text exposes your user architecture to potential exploit.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">Key Confusion Attacks</h3>
                            <p className="text-slate-600 leading-relaxed">
                                A more advanced attack where the attacker changes the algorithm from RS256 (Asymmetric) to HS256 (Symmetric) and uses the public key (which is public) to sign the token. If the server isn't strict, it might try to verify the HS256 signature using the public key as the secret.
                            </p>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="space-y-12">
                        <h3 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h3>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-slate-900">Is it safe to paste my production token here?</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Yes. This tool runs 100% client-side. Your token never leaves your browser. However, as a best practice, you should rotate any production credential you paste into a third-party tool, or use a test token with similar structure.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-slate-900">How do I fix a weak secret?</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Generate a cryptographically strong random string (at least 256 bits for HS256). You can use our <a href="/tools/uuid-generator" className="text-red-600 hover:text-red-500 underline">UUID Generator</a> or a dedicated secret management service. Never commit secrets to git.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-slate-900">Should I store JWTs in LocalStorage?</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Generally, no. LocalStorage is vulnerable to XSS (Cross-Site Scripting). If an attacker runs JS on your domain, they can steal the token. HttpOnly cookies are recommended for storing sensitive session tokens.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
