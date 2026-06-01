import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import HttpHeadersAnalyzerClient from '@/components/tools/HttpHeadersAnalyzer/HttpHeadersAnalyzerClient';
import ToolLayout from '@/components/ToolLayout';

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
        <ToolLayout
            title="HTTP Headers Analyzer"
            description="Check your website's health and security. Scan for missing security headers like CSP, HSTS, and X-Frame-Options."
            schema={jsonLd}
            relatedTools={[
                { name: 'API Playground', href: '/tools/api-playground' },
                { name: 'Webhook Inspector', href: '/tools/webhook-inspector' },
                { name: 'JWT Security Auditor', href: '/tools/jwt-security-audit' }
            ]}
        >
            <HttpHeadersAnalyzerClient />
        </ToolLayout>
    );
}
