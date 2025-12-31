import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';
import ToasterProvider from '@/components/ToasterProvider';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com'),
    title: {
        default: 'WebUtilsPro - Free Developer Tools for SEO & Productivity',
        template: '%s | WebUtilsPro',
    },
    description:
        'Access free developer tools including Regex Tester, JSON to CSV Converter, Markdown to HTML, AI Error Explainer, and Prompt Optimizer. Boost your productivity today!',
    keywords: [
        'developer tools',
        'regex tester',
        'json to csv',
        'markdown to html',
        'ai error explainer',
        'prompt optimizer',
        'free tools',
        'programming tools',
    ],
    authors: [{ name: 'WebUtilsPro' }],
    creator: 'WebUtilsPro',
    publisher: 'WebUtilsPro',
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: 'WebUtilsPro - Free Online Developer Tools',
        description: 'Boost your productivity with professional-grade developer tools. Powered by AI, designed for speed.',
        siteName: 'WebUtilsPro',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'WebUtilsPro Developer Tools',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'WebUtilsPro - Free Online Developer Tools',
        description: 'Professional utilities for modern developers. AI-powered and free to use.',
        images: ['/og-image.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/logo.png" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'WebUtilsPro',
                            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com',
                            logo: '/logo.png',
                            description: 'Free developer tools for productivity and SEO',
                            sameAs: [
                                'https://twitter.com/devtoolshub',
                                'https://github.com/devtoolshub',
                            ],
                        }),
                    }}
                />
            </head>
            <body className={inter.className}>
                <CustomCursor />
                <div className="flex flex-col min-h-screen">
                    <ToasterProvider />
                    <Header />
                    <CommandPalette />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
