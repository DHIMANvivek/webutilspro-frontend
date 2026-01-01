import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import OgImageGeneratorClient from '@/components/tools/OgImageGenerator/OgImageGeneratorClient';

export const metadata = genMeta({
    title: 'Open Graph (OG) Image Playground | Social Card Maker',
    description: 'Design beautiful Open Graph images for your website. Preview social cards for Twitter/LinkedIn and generate Next.js ImageResponse code instantly.',
    keywords: [
        'og image generator',
        'open graph preview',
        'social card maker',
        'nextjs image response',
        'meta tag image',
        'twitter card preview'
    ],
    canonical: '/tools/og-image-generator'
});

const jsonLd = generateToolSchema({
    name: 'OG Image Playground',
    description: 'Design and preview Open Graph social sharing images. Export code for Next.js OG generation.',
    url: 'https://webutilspro.com/tools/og-image-generator'
});

export default function OgImageGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <div className="container mx-auto px-4 py-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        OG Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Playground</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Design social sharing cards for your website. Preview them live and copy the <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm">ImageResponse</code> code for Next.js.
                    </p>
                </div>

                <OgImageGeneratorClient />
            </div>
        </div>
    );
}
