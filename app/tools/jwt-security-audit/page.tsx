import React from 'react';
import { Metadata } from 'next';
import JwtAuditClient from '@/components/tools/JwtAudit/JwtAuditClient';
import { ShieldAlert, BookOpen, AlertTriangle, Fingerprint } from 'lucide-react';
import { DEMO_TOKEN } from '@/components/tools/JwtAudit/CommonSecrets';

export const metadata: Metadata = {
    title: 'JWT Security Auditor | Token Breach Simulator',
    description: 'Test your JWT tokens against common attacks. Simulate None-Algorithm exploits, Brute Force weak secrets, and detect PII leaks.',
    keywords: 'jwt security test, jwt breach simulator, crack jwt token, jwt weak secret, jwt none algorithm exploit, token audit',
};

export default function JwtAuditPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">

            <div className="pt-32 pb-24 container-custom">
                <div className="relative z-10 max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 border border-red-800 text-red-400 text-[11px] font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <ShieldAlert size={14} />
                        Security Operations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                        JWT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-gradient">Breach Simulator</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                        Don't just decode your tokens—attack them. This tool runs client-side simulations to test your JWT for weak secrets and critical vulnerabilities.
                    </p>
                </div>

                {/* Main Audit Terminal */}
                <div id="audit-studio" className="relative z-10 mb-24">
                    <JwtAuditClient />
                </div>

                {/* Disclaimer */}
                <div className="max-w-3xl mx-auto mb-24 p-6 rounded-xl bg-orange-900/20 border border-orange-800/50 flex items-start gap-4">
                    <AlertTriangle className="text-orange-500 shrink-0 mt-1" />
                    <div className="text-sm text-orange-200/80 leading-relaxed">
                        <strong>Privacy Notice:</strong> All security checks, including the dictionary "brute-force" attack, run entirely in your browser. Your tokens and secrets are <u>never</u> sent to our servers.
                    </div>
                </div>

                {/* Educational Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-left">
                    <div className="p-8 bg-black/40 rounded-3xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-red-900/40 text-red-400 rounded-xl flex items-center justify-center mb-6">
                            <Fingerprint size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Weak Secret Attack</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Simulates a brute-force attempt using a dictionary of the top 100 most common passwords. If your signing key is "secret" or "123456", we will find it.
                        </p>
                    </div>
                    <div className="p-8 bg-black/40 rounded-3xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-orange-900/40 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                            <ShieldAlert size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">"None" Algo Exploit</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Checks if your token header explicitly allows the `none` algorithm, a critical vulnerability that allows attackers to forge admin tokens efficiently.
                        </p>
                    </div>
                    <div className="p-8 bg-black/40 rounded-3xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-blue-900/40 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">PII Leak Scan</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Scans your payload for sensitive data like passwords, emails, or credit card numbers that should never be stored in a client-readable JWT.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
