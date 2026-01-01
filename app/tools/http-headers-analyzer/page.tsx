import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import HttpHeadersAnalyzerClient from '@/components/tools/HttpHeadersAnalyzer/HttpHeadersAnalyzerClient';

export const metadata = genMeta({
    title: 'HTTP Headers Analyzer & Security Scanner | WebUtilsPro',
    description: 'Analyze website HTTP headers for security vulnerabilities. Check for HSTS, CSP, X-Frame-Options and get a security grade.',
    keywords: [
        'http headers analyzer',
        'security header scanner',
        'csp checker',
        'hsts analyzer',
        'website security check',
        'http response headers'
    ],
    canonical: '/tools/http-headers-analyzer'
});

const jsonLd = generateToolSchema({
    name: 'HTTP Headers Analyzer',
    description: 'Scan website HTTP headers for security best practices and vulnerabilities.',
    url: 'https://webutilspro.com/tools/http-headers-analyzer'
});

export default function HttpHeadersAnalyzerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <div className="container mx-auto px-4 py-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        HTTP Headers <span className="text-blue-600">Analyzer</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Check your website's health and security. Scan for missing <strong className="text-slate-900 dark:text-white">Security Headers</strong> like CSP, HSTS, and X-XSS-Protection.
                    </p>
                </div>

                <HttpHeadersAnalyzerClient />
            </div>
        </div>
    );
}
