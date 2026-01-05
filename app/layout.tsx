import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';
import ToasterProvider from '@/components/ToasterProvider';
import SmartErrorBoundary from '@/components/SmartErrorBoundary';
import TourManager from '@/components/TourManager';
import ToolsShowcase from '@/components/ToolsShowcase';
import FloatingJumpButton from '@/components/FloatingJumpButton';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import GoogleTagManager, { GoogleTagManagerNoScript } from '@/components/GoogleTagManager';

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
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <GoogleTagManager />
                <meta name="google-adsense-account" content="ca-pub-5500315527317299" />
                <link rel="icon" type="image/png" href="/logo.png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <link rel="shortcut icon" href="/logo.png" />

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
                                'https://github.com/DHIMANvivek',
                            ],
                        }),
                    }}
                />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5500315527317299"
                    crossOrigin="anonymous"
                ></script>
                <GoogleAnalytics />

                {/* Push Notification Widget */}
                <script src="https://webutilspro.com/push-widget.js" data-api-key="pn_224c27fb28fefbbb1366f557b7449ada0bb3fa2e70c56e01c0d196c527848ccf" async></script>
            </head>
            <body className={inter.className}>
                <GoogleTagManagerNoScript />

                <SmartErrorBoundary>
                    <TourManager />
                    <div className="flex flex-col min-h-screen">
                        <ToasterProvider />
                        <Header />
                        <CommandPalette />
                        <ToolsShowcase />
                        <FloatingJumpButton />
                        <main className="min-h-screen">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </SmartErrorBoundary>
            </body>
        </html>
    );
}
