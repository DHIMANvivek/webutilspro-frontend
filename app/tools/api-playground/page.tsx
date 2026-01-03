import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import APIPlaygroundClient from '@/components/tools/APIPlayground/APIPlaygroundClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LayoutGrid } from 'lucide-react';

export const metadata: Metadata = genMeta({
    title: 'API Testing Playground - Free Online REST API Tester | Postman Alternative',
    description: 'Professional API testing tool. Test REST, GraphQL, and WebSocket APIs online. Free Postman alternative with code generation, collections, and beautiful UI. No signup required.',
    keywords: [
        'API testing tool',
        'REST API tester',
        'Postman alternative',
        'GraphQL playground',
        'API client online',
        'test API online',
        'HTTP client',
        'cURL converter',
        'API playground',
        'free API tester'
    ],
});

export default function APIPlaygroundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark">
            {/* Hero Section */}
            <div className="relative border-b border-slate-700/50 bg-gradient-to-r from-indigo-950/30 to-purple-950/30 backdrop-blur-xl">
                <div className="container-custom py-12">
                    <Breadcrumbs
                        items={[
                            { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { name: 'API Playground', href: '/tools/api-playground' },
                        ]}
                    />
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Pro API Testing Tool</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                            API Testing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Playground</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-6 leading-relaxed max-w-2xl">
                            Test REST APIs, GraphQL endpoints, and webhooks instantly. Beautiful interface, powerful features, zero configuration.
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">No Signup Required</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Code Generation</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
                                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Save Collections</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tool */}
            <APIPlaygroundClient />

            {/* Features Section */}
            <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
                <div className="container-custom py-16">
                    <h2 className="text-3xl font-black text-white mb-8 text-center">Why Developers Love This Tool</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Lightning Fast</h3>
                            <p className="text-slate-400 text-sm">Test APIs instantly. No installation, no configuration. Just paste and test.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Code Generation</h3>
                            <p className="text-slate-400 text-sm">Export to cURL, JavaScript, Python, and more. Copy-paste ready code.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Save Collections</h3>
                            <p className="text-slate-400 text-sm">Organize requests into collections. Access history. Work offline.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
