import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com';
    return {
        rules: [
            {
                // Allow Googlebot (for search and AdSense) full access
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                // Explicitly allow Googlebot-AdSense crawler
                userAgent: 'Googlebot-AdSense',
                allow: '/',
            },
            {
                // Allow all other crawlers, but block API routes
                userAgent: '*',
                allow: '/',
                disallow: ['/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
