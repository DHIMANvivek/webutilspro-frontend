import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com';
    const lastModified = new Date();

    const tools = [
        'ai-error-explainer',
        'api-playground',
        'base64',
        'code-formatter',
        'color-picker',
        'cron-job-generator',
        'diff-checker',
        'html-encoder',
        'http-headers-analyzer',
        'image-compressor',
        'json-to-csv',
        'json-validator',
        'jwt-decoder',
        'lorem-ipsum-generator',
        'markdown-to-html',
        'mcp-tester',
        'minifier',
        'og-image-generator',
        'password-generator',
        'pdf-extractor',
        'prompt-optimizer',
        'push-notifications',
        'qr-code-generator',
        'regex-tester',
        'tailwind-animations',
        'tailwind-factory',
        'zod-schema-generator',
        'database-architect',
        'text-tools',
        'timestamp-converter',
        'url-encoder',
        'uuid-generator',
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

    const staticRoutes = [
        {
            url: `${baseUrl}/blog`,
            lastModified,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools/push-notifications/dashboard`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...staticRoutes,
        ...toolRoutes,
    ];
}
