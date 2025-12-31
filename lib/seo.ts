import { Metadata } from 'next';

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
    const {
        title,
        description,
        keywords = [],
        canonical,
        ogImage = '/og-image.png',
    } = config;

    const fullTitle = `${title} | WebUtilsPro`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com';
    const canonicalUrl = canonical || siteUrl;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: 'WebUtilsPro' }],
        creator: 'WebUtilsPro',
        publisher: 'WebUtilsPro',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: canonicalUrl,
            title: fullTitle,
            description,
            siteName: 'WebUtilsPro',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
    };
}

export function generateToolSchema(tool: {
    name: string;
    description: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: tool.url,
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        operatingSystem: 'Any',
    };
}

export function generateBreadcrumb(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
