import { Metadata } from 'next';
import { Code2, History, Zap } from 'lucide-react';
import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import APIPlaygroundClient from '@/components/tools/APIPlayground/APIPlaygroundClient';

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

const relatedTools = [
    { name: 'Webhook Inspector', href: '/tools/webhook-inspector' },
    { name: 'HTTP Headers Analyzer', href: '/tools/http-headers-analyzer' },
    { name: 'JSON Validator', href: '/tools/json-validator' }
];

const features = [
    {
        title: 'Fast API checks',
        description: 'Paste an endpoint, choose a method, send the request, and inspect the response without installing a desktop client.',
        icon: Zap
    },
    {
        title: 'Code generation',
        description: 'Turn tested requests into copy-ready snippets for cURL and common application code workflows.',
        icon: Code2
    },
    {
        title: 'Request history',
        description: 'Keep recent requests nearby while you test headers, auth modes, bodies, and endpoint variations.',
        icon: History
    }
];

export default function APIPlaygroundPage() {
    const toolSchema = generateToolSchema({
        name: 'API Testing Playground',
        description: 'Test REST APIs, inspect responses, import cURL, and generate reusable request code.',
        url: '/tools/api-playground'
    });

    return (
        <ToolLayout
            title="API Testing Playground"
            description="Test REST APIs, import cURL commands, inspect responses, and generate request code from a focused browser workspace."
            relatedTools={relatedTools}
            schema={toolSchema}
        >
            <APIPlaygroundClient />

            <section className="mt-10">
                <div className="mb-6">
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                        Why developers use it
                    </div>
                    <h2 className="mt-2 text-3xl font-semibold text-neutral-950">API testing without the visual noise.</h2>
                </div>

                <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="bg-[#fbfbf4] p-5">
                                <Icon className="h-5 w-5 text-neutral-900" />
                                <h3 className="mt-5 text-lg font-semibold text-neutral-950">{feature.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-neutral-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </ToolLayout>
    );
}
