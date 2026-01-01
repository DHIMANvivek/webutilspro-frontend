import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com';
    const lastModified = new Date();

    const tools = [
        'ai-error-explainer',
        'base64',
        'code-formatter',
        'color-picker',
        'diff-checker',
        'html-encoder',
        'image-compressor',
        'json-to-csv',
        'json-validator',
        'jwt-decoder',
        'lorem-ipsum-generator',
        'markdown-to-html',
        'mcp-tester',
        'minifier',
        'password-generator',
        'pdf-extractor',
        'prompt-optimizer',
        'qr-code-generator',
        'regex-tester',
        'text-tools',
        'timestamp-converter',
        'url-encoder',
        'uuid-generator',
        'cron-job-generator',
        'http-headers-analyzer',
        'og-image-generator',
        'woocommerce',
        'xml-formatter',
        'yaml-tools',
    ];

    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...toolRoutes,
    ];
}
