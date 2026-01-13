'use client';

import React, { useState, useEffect } from 'react';
import { TOP_SECRETS } from './CommonSecrets';
import { ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle, Terminal, XCircle, RotateCcw, Fingerprint, Eye } from 'lucide-react';

// --- Crypto Utils (Client Side) ---
// Using SubtleCrypto for performance and no external deps
const signHmacSha256 = async (key: string, data: string) => {
    const encoder = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
    // Convert to Base64Url
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

// --- Types ---
interface AuditStep {
    id: string;
    name: string;
    status: 'pending' | 'scanning' | 'pass' | 'fail' | 'warning';
    message: string;
}

interface DecodedToken {
    header: any;
    payload: any;
    signature: string;
}

export default function JwtAuditClient() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<DecodedToken | null>(null);
    const [auditLog, setAuditLog] = useState<AuditStep[]>([]);
    const [isAuditing, setIsAuditing] = useState(false);
    const [securityScore, setSecurityScore] = useState<string | null>(null);
    const [crackedSecret, setCrackedSecret] = useState<string | null>(null);

    // --- Audit Logic ---
    const runAudit = async () => {
        if (!token) return;
        setIsAuditing(true);
        setSecurityScore(null);
        setCrackedSecret(null);
        const log: AuditStep[] = [];

        // 1. Structure Check
        const parts = token.split('.');
        if (parts.length !== 3) {
            setAuditLog([{ id: 'struct', name: 'Token Structure', status: 'fail', message: 'Invalid JWT format. Must have 3 parts.' }]);
            setIsAuditing(false);
            return;
        }

        try {
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            setDecoded({ header, payload, signature: parts[2] });

            log.push({ id: 'struct', name: 'Structure Analysis', status: 'pass', message: 'Valid Header & Payload JSON.' });
            setAuditLog([...log]);

            // 2. Algorithm Check
            await new Promise(r => setTimeout(r, 600)); // Sim delay
            if (header.alg === 'none' || !header.alg) {
                log.push({ id: 'alg', name: 'Algorithm Strength', status: 'fail', message: 'CRITICAL: "none" algorithm detected. Token is unsecured.' });
            } else if (header.alg.toUpperCase() === 'HS256') {
                log.push({ id: 'alg', name: 'Algorithm Strength', status: 'pass', message: 'HS256 (Symmetric) detected. Vulnerable to Brute Force if secret is weak.' });
            } else {
                log.push({ id: 'alg', name: 'Algorithm Strength', status: 'pass', message: `${header.alg} detected. Using Asymmetric encryption is best practice.` });
            }
            setAuditLog([...log]);

            // 3. Brute Force Dictionary Attack
            if (header.alg === 'HS256') {
                const stepIdx = log.push({ id: 'crack', name: 'Secret Strength Test', status: 'scanning', message: 'Initializing Dictionary Attack...' }) - 1;
                setAuditLog([...log]);

                let foundSecret = null;
                const dataPart = `${parts[0]}.${parts[1]}`;

                for (const secret of TOP_SECRETS) {
                    const sig = await signHmacSha256(secret, dataPart);
                    if (sig === parts[2]) {
                        foundSecret = secret;
                        break;
                    }
                    // Visual "Working" effect
                    if (Math.random() > 0.8) {
                        log[stepIdx].message = `Testing secret: "${secret}"...`;
                        setAuditLog([...log]);
                        await new Promise(r => setTimeout(r, 50));
                    }
                }

                if (foundSecret) {
                    log[stepIdx] = { id: 'crack', name: 'Secret Strength Test', status: 'fail', message: `CRITICAL: Secret Cracked! It is "${foundSecret}".` };
                    setCrackedSecret(foundSecret);
                } else {
                    log[stepIdx] = { id: 'crack', name: 'Secret Strength Test', status: 'pass', message: 'Secret not found in top 50 common passwords.' };
                }
            } else {
                log.push({ id: 'crack', name: 'Secret Strength Test', status: 'pass', message: 'Asymmetric or Non-HMAC algo. Brute force skipped.' });
            }
            setAuditLog([...log]);

            // 4. PII & Expiration
            const sensitiveKeys = ['password', 'card', 'ssn', 'social', 'credit', 'balance'];
            const foundSensitive = Object.keys(payload).filter(k => sensitiveKeys.some(s => k.toLowerCase().includes(s)));

            if (foundSensitive.length > 0) {
                log.push({ id: 'pii', name: 'Data Privacy', status: 'warning', message: `Warning: Payload contains sensitive keys: ${foundSensitive.join(', ')}` });
            } else {
                log.push({ id: 'pii', name: 'Data Privacy', status: 'pass', message: 'No obvious sensitive PII patterns found in payload.' });
            }

            // Expiration
            const now = Math.floor(Date.now() / 1000);
            if (!payload.exp) {
                log.push({ id: 'exp', name: 'Token Lifecycle', status: 'warning', message: 'No "exp" (Expiration) claim found. Token never expires.' });
            } else if (payload.exp < now) {
                log.push({ id: 'exp', name: 'Token Lifecycle', status: 'warning', message: 'Token is EXPIRED. Services should reject it.' });
            } else {
                log.push({ id: 'exp', name: 'Token Lifecycle', status: 'pass', message: `Valid expiration found (${new Date(payload.exp * 1000).toLocaleString()}).` });
            }

            setAuditLog([...log]);

            // Calculate Score
            const fails = log.filter(l => l.status === 'fail').length;
            const warnings = log.filter(l => l.status === 'warning').length;
            if (fails > 0) setSecurityScore('F');
            else if (warnings > 0) setSecurityScore('B');
            else setSecurityScore('A+');

        } catch (e) {
            setAuditLog([{ id: 'err', name: 'Parsing', status: 'fail', message: 'Failed to decode token segments.' }]);
        }
        setIsAuditing(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Input & Decoder */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Fingerprint size={16} className="text-emerald-500" /> Analyzed Token
                        </label>
                        {decoded && (
                            <button onClick={() => { setToken(''); setDecoded(null); setAuditLog([]); setSecurityScore(null); }} className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                                <RotateCcw size={12} /> Reset
                            </button>
                        )}
                    </div>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full h-40 bg-slate-50 text-slate-800 font-mono text-sm p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none transition-all placeholder:text-slate-400 shadow-inner"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                    <button
                        onClick={runAudit}
                        disabled={!token || isAuditing}
                        className={`mt-4 w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all
                            ${!token ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                isAuditing ? 'bg-emerald-50 text-emerald-600 animate-pulse border border-emerald-200' :
                                    'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'}
                        `}
                    >
                        {isAuditing ? 'Running Security Audit...' : 'Simulate Breach Attack'}
                    </button>
                </div>

                {/* Decoded View */}
                {decoded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-400 text-xs uppercase mb-2">Header</h4>
                            <pre className="text-xs text-slate-700 font-mono overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-400 text-xs uppercase mb-2">Payload</h4>
                            <pre className="text-xs text-slate-700 font-mono overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Hacker Console (Keeping Dark for aesthetics) */}
            <div className="w-full lg:w-[450px] bg-black rounded-2xl border border-slate-800 p-6 font-mono relative overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>

                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
                    <Terminal size={18} className="text-green-500" />
                    <span className="text-green-500 font-bold text-sm">SECURITY_AUDIT:~/ROOT</span>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto relative z-10">
                    {auditLog.length === 0 && (
                        <div className="text-slate-600 text-sm">Waiting for target token...</div>
                    )}
                    {auditLog.map((step) => (
                        <div key={step.id} className="flex gap-3 text-xs items-start">
                            <div className="mt-0.5">
                                {step.status === 'scanning' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />}
                                {step.status === 'pass' && <ShieldCheck size={14} className="text-green-500" />}
                                {step.status === 'fail' && <XCircle size={14} className="text-red-500" />}
                                {step.status === 'warning' && <AlertTriangle size={14} className="text-orange-500" />}
                            </div>
                            <div>
                                <span className={`font-bold ${step.status === 'fail' ? 'text-red-500' :
                                    step.status === 'warning' ? 'text-orange-400' :
                                        step.status === 'scanning' ? 'text-yellow-500' : 'text-slate-400'
                                    }`}>[{step.name}]</span>
                                <p className={`${step.status === 'fail' ? 'text-red-400' :
                                    step.status === 'warning' ? 'text-orange-300' : 'text-slate-500'
                                    }`}>
                                    {step.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Grade Stamp */}
                {securityScore && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-dashed rounded-lg p-6 rotate-[-12deg] flex flex-col items-center justify-center opacity-0 animate-in zoom-in fade-in duration-500 fill-mode-forwards z-30 bg-black/80 backdrop-blur-sm"
                        style={{ borderColor: securityScore === 'F' ? '#ef4444' : securityScore === 'A+' ? '#10b981' : '#f59e0b' }}
                    >
                        <span className="text-sm font-black uppercase tracking-widest" style={{ color: securityScore === 'F' ? '#ef4444' : securityScore === 'A+' ? '#10b981' : '#f59e0b' }}>Security Grade</span>
                        <span className="text-8xl font-black" style={{ color: securityScore === 'F' ? '#ef4444' : securityScore === 'A+' ? '#10b981' : '#f59e0b' }}>{securityScore}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
